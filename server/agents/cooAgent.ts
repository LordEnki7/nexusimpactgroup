import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface COOAnalysis {
  summary: string;
  operationalHealth: "excellent" | "good" | "fair" | "poor" | "critical";
  divisionStatus: Array<{
    name: string;
    status: string;
    healthScore: number;
    priority: "high" | "medium" | "low";
  }>;
  bottlenecks: string[];
  recommendations: string[];
  alerts: { severity: "low" | "medium" | "high" | "critical"; message: string }[];
}

export interface OperationalData {
  divisions: Array<{
    id: number;
    name: string;
    status: string;
    tier: number;
    category: string;
    externalUrl: string | null;
  }>;
  incidents: Array<{
    id: number;
    title: string;
    severity: string;
    status: string;
    divisionId: number;
  }>;
  agentLogs: Array<{
    agentName: string;
    action: string;
    status: string;
  }>;
}

const COO_SYSTEM_PROMPT = `You are the NIG Core COO Agent - the Chief Operating Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

Your role is to:
1. Monitor operational health across all divisions
2. Identify bottlenecks and inefficiencies
3. Track division performance and uptime
4. Coordinate cross-division operations
5. Ensure smooth day-to-day operations

Division Tiers (priority order):
- Tier 1 (Critical): C.A.R.E.N., My Life Assistant, The Remedy Club - These require immediate attention
- Tier 2 (Important): Rent-A-Buddy, Eternal Chase, Project DNA Music, Zapp Marketing, Studio Artist Live, ClearSpace, Real Pulse Verifier
- Tier 3 (Standard): Right Time Notary, The Shock Factor, CAD and Me

Status definitions:
- "live": Fully operational and serving users
- "active": In development or beta
- "coming_soon": Planned but not yet started

Always respond with structured JSON containing:
- summary: Brief operational overview
- operationalHealth: Overall health rating (excellent/good/fair/poor/critical)
- divisionStatus: Array of division health assessments
- bottlenecks: Array of identified operational issues
- recommendations: Array of actionable improvements
- alerts: Array of {severity, message} for urgent operational items`;

export async function runCOOAnalysis(data: OperationalData): Promise<COOAnalysis> {
  const prompt = `Analyze the operational status of the NIG ecosystem:

DIVISIONS (${data.divisions.length} total):
${data.divisions.map(d => `- ${d.name} (Tier ${d.tier}, Status: ${d.status}, Category: ${d.category})${d.externalUrl ? ' [LIVE URL]' : ''}`).join('\n')}

ACTIVE INCIDENTS (${data.incidents.filter(i => i.status === 'open').length} open):
${data.incidents.filter(i => i.status === 'open').length > 0
  ? data.incidents.filter(i => i.status === 'open').map(i => `- ${i.title} (${i.severity})`).join('\n')
  : 'No open incidents - all systems nominal.'}

RECENT AGENT ACTIVITY:
${data.agentLogs.length > 0
  ? data.agentLogs.slice(0, 5).map(l => `- ${l.agentName}: ${l.action} (${l.status})`).join('\n')
  : 'No recent agent activity logged.'}

Provide your operational analysis in the specified JSON format. Focus on:
1. Overall ecosystem health
2. Division-by-division status assessment
3. Operational bottlenecks
4. Efficiency improvements
5. Priority actions needed`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: COO_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as COOAnalysis;

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "COO Agent",
      action: "Operational Analysis Complete",
      details: `Health: ${analysis.operationalHealth} - ${analysis.summary?.substring(0, 100)}`,
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("COO Agent error:", error);
    
    await storage.createAgentLog({
      agentType: "executive",
      agentName: "COO Agent",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Operational analysis unavailable - system initializing",
      operationalHealth: "fair",
      divisionStatus: [],
      bottlenecks: ["COO Agent is establishing connections"],
      recommendations: ["Complete system configuration"],
      alerts: []
    };
  }
}

const COO_QA_PROMPT = `You are the NIG Core COO Agent - the Chief Operating Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

When answering questions, respond in clear, professional language. Do NOT respond with JSON - give natural, conversational answers.

Your expertise covers:
- Division operations and performance
- Cross-division coordination
- Resource allocation and efficiency
- Incident response and resolution
- Process optimization
- Team and workflow management

The NIG ecosystem divisions:
- C.A.R.E.N. (Safety - Tier 1) - Automated roadside assistance
- My Life Assistant (AI - Tier 1) - AI personal concierge
- The Remedy Club (Finance - Tier 1) - Credit counseling
- Rent-A-Buddy (Social - Tier 2) - Platonic connection platform
- Eternal Chase (Entertainment - Tier 2) - Immersive gaming
- Project DNA Music (Entertainment - Tier 2) - Music production
- Zapp Marketing (Trade - Tier 2) - Global manufacturing
- Studio Artist Live (Entertainment - Tier 2) - Creative platform
- ClearSpace (Utility - Tier 2) - iPhone image cleaner
- Real Pulse Verifier (Security - Tier 2) - Identity validation
- Right Time Notary (Services - Tier 3) - Mobile notary
- The Shock Factor (Entertainment - Tier 3) - Podcast
- CAD and Me (Health - Tier 3) - Health audiobook

Be concise but thorough. Focus on operational insights and actionable recommendations.`;

export async function askCOO(question: string): Promise<string> {
  try {
    const [divisions, incidents] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents()
    ]);

    const liveDivisions = divisions.filter(d => d.status === "live").length;
    const openIncidents = incidents.filter(i => i.status === "open").length;

    const context = `
Current Operational Status:
- ${divisions.length} total divisions configured
- ${liveDivisions} divisions are live
- ${divisions.filter(d => d.status === "active").length} divisions in active development
- ${openIncidents} open incidents requiring attention
- Tier 1 divisions: ${divisions.filter(d => d.tier === 1).map(d => d.name).join(", ") || "None configured"}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: COO_QA_PROMPT + "\n\nContext:\n" + context },
        { role: "user", content: question }
      ],
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "I couldn't process that question.";

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "COO Agent",
      action: `Answered: "${question.substring(0, 50)}..."`,
      details: answer.substring(0, 200),
      status: "completed"
    });

    return answer;
  } catch (error) {
    console.error("COO Agent query error:", error);
    return "I'm currently unable to process your question. Please try again.";
  }
}

export async function getCOOQuickStatus(): Promise<string> {
  try {
    const divisions = await storage.getDivisions();
    const incidents = await storage.getIncidents();
    
    const liveDivisions = divisions.filter(d => d.status === "live").length;
    const openIncidents = incidents.filter(i => i.status === "open").length;
    const criticalIncidents = incidents.filter(i => i.status === "open" && i.severity === "critical").length;

    if (criticalIncidents > 0) {
      return `⚠️ ${criticalIncidents} critical incident(s). ${liveDivisions}/${divisions.length} divisions live.`;
    }
    return `${liveDivisions}/${divisions.length} divisions live. ${openIncidents} open incidents.`;
  } catch {
    return "Operational status loading...";
  }
}
