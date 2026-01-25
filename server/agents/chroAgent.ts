import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface CHROAnalysis {
  summary: string;
  teamHealth: "excellent" | "good" | "fair" | "poor" | "critical";
  workforceMetrics: {
    capacity: string;
    productivity: string;
    morale: string;
  };
  divisionStaffing: Array<{
    division: string;
    headcount: number;
    status: string;
    needs: string;
  }>;
  hiringPriorities: Array<{
    role: string;
    division: string;
    priority: "critical" | "high" | "medium" | "low";
    reason: string;
  }>;
  recommendations: string[];
  riskAreas: string[];
}

export interface HRData {
  divisions: Array<{
    id: number;
    name: string;
    status: string;
    tier: number;
    category: string;
  }>;
  totalDivisions: number;
  activeDivisions: number;
}

const CHRO_SYSTEM_PROMPT = `You are the NIG Core CHRO Agent - the Chief Human Resources Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

Your role is to:
1. Monitor team capacity and workforce health
2. Identify staffing needs across divisions
3. Track productivity and team performance
4. Recommend hiring priorities
5. Assess team morale and engagement
6. Plan for organizational growth

Division Staffing Profiles (estimated based on tier and complexity):
- C.A.R.E.N. (Safety - Tier 1) - Needs: developers, emergency response specialists, customer support
- My Life Assistant (AI - Tier 1) - Needs: AI/ML engineers, data scientists, UX designers
- The Remedy Club (Finance - Tier 1) - Needs: financial analysts, compliance officers, counselors
- Rent-A-Buddy (Social - Tier 2) - Needs: community managers, moderators, developers
- Eternal Chase (Entertainment - Tier 2) - Needs: game developers, artists, QA testers
- Project DNA Music (Entertainment - Tier 2) - Needs: audio engineers, producers, marketing
- Zapp Marketing (Trade - Tier 2) - Needs: e-commerce specialists, logistics, customer service
- Studio Artist Live (Entertainment - Tier 2) - Needs: streaming engineers, content moderators
- ClearSpace (Utility - Tier 2) - Needs: mobile developers, iOS specialists
- Real Pulse Verifier (Security - Tier 2) - Needs: security engineers, biometrics experts
- Right Time Notary (Services - Tier 3) - Needs: notaries, schedulers, operations
- The Shock Factor (Entertainment - Tier 3) - Needs: content creators, editors
- CAD and Me (Health - Tier 3) - Needs: content writers, medical advisors

Team Roles: Engineering, Product, Design, Marketing, Operations, Support, Finance, Legal

Always respond with structured JSON containing:
- summary: Workforce overview
- teamHealth: Overall team health rating
- workforceMetrics: {capacity, productivity, morale}
- divisionStaffing: Array of division staffing assessments
- hiringPriorities: Array of priority roles to hire
- recommendations: Array of HR recommendations
- riskAreas: Array of potential HR risks`;

export async function runCHROAnalysis(data: HRData): Promise<CHROAnalysis> {
  const prompt = `Analyze the human resources status of the NIG ecosystem:

DIVISIONS (${data.divisions.length} total):
${data.divisions.map(d => `- ${d.name} (Tier ${d.tier}, Status: ${d.status}, Category: ${d.category})`).join('\n')}

WORKFORCE OVERVIEW:
- Total Divisions: ${data.totalDivisions}
- Active Divisions: ${data.activeDivisions}
- Tier 1 (High Complexity): ${data.divisions.filter(d => d.tier === 1).length} divisions
- Tier 2 (Medium Complexity): ${data.divisions.filter(d => d.tier === 2).length} divisions
- Tier 3 (Lower Complexity): ${data.divisions.filter(d => d.tier === 3).length} divisions

Note: This is a startup ecosystem - assume lean teams with growth potential.

Provide your HR analysis in the specified JSON format. Focus on:
1. Current team capacity assessment
2. Critical hiring needs by division
3. Productivity optimization opportunities
4. Organizational growth planning
5. Risk areas in staffing`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CHRO_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as CHROAnalysis;

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CHRO Agent",
      action: "HR Analysis Complete",
      details: `Team Health: ${analysis.teamHealth} - ${analysis.summary?.substring(0, 100)}`,
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("CHRO Agent error:", error);
    
    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CHRO Agent",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "HR analysis unavailable - system initializing",
      teamHealth: "fair",
      workforceMetrics: { capacity: "Unknown", productivity: "Unknown", morale: "Unknown" },
      divisionStaffing: [],
      hiringPriorities: [],
      recommendations: ["Complete HR system configuration"],
      riskAreas: []
    };
  }
}

const CHRO_QA_PROMPT = `You are the NIG Core CHRO Agent - the Chief Human Resources Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

When answering questions, respond in clear, professional language. Do NOT respond with JSON - give natural, conversational answers.

Your expertise covers:
- Workforce planning and capacity
- Hiring and recruitment strategy
- Team productivity and performance
- Employee engagement and morale
- Organizational structure
- Compensation and benefits
- Training and development
- HR compliance and policies
- Culture and team dynamics

The NIG ecosystem divisions and typical staffing needs:
- C.A.R.E.N. - Emergency response, customer support teams
- My Life Assistant - AI/ML engineers, data scientists
- The Remedy Club - Financial counselors, compliance
- Rent-A-Buddy - Community managers, moderators
- Eternal Chase - Game developers, artists
- Project DNA Music - Audio engineers, producers
- Zapp Marketing - E-commerce, logistics teams
- Studio Artist Live - Streaming engineers
- ClearSpace - Mobile developers
- Real Pulse Verifier - Security engineers
- Right Time Notary - Notaries, operations
- The Shock Factor - Content creators
- CAD and Me - Medical content advisors

Be concise but thorough. Focus on actionable HR insights.`;

export async function askCHRO(question: string): Promise<string> {
  try {
    const divisions = await storage.getDivisions();
    const activeDivisions = divisions.filter(d => d.status === "live").length;

    const context = `
Current Workforce Context:
- ${divisions.length} total divisions in ecosystem
- ${activeDivisions} divisions fully operational
- Startup environment with growth trajectory
- Focus on technology and innovation
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CHRO_QA_PROMPT + "\n\nContext:\n" + context },
        { role: "user", content: question }
      ],
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "I couldn't process that question.";

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CHRO Agent",
      action: `Answered: "${question.substring(0, 50)}..."`,
      details: answer.substring(0, 200),
      status: "completed"
    });

    return answer;
  } catch (error) {
    console.error("CHRO Agent query error:", error);
    return "I'm currently unable to process your question. Please try again.";
  }
}

export async function getCHROQuickStatus(): Promise<string> {
  try {
    const divisions = await storage.getDivisions();
    const activeDivisions = divisions.filter(d => d.status === "live").length;
    return `${activeDivisions}/${divisions.length} divisions staffed. Capacity growing.`;
  } catch {
    return "HR status loading...";
  }
}
