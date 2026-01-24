import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface CTOAnalysis {
  summary: string;
  techHealth: "excellent" | "good" | "fair" | "poor" | "critical";
  systemStatus: {
    uptime: string;
    security: string;
    performance: string;
  };
  techStack: Array<{
    division: string;
    stack: string[];
    status: string;
  }>;
  securityAlerts: { severity: "low" | "medium" | "high" | "critical"; message: string }[];
  recommendations: string[];
  techDebt: string[];
}

export interface TechData {
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
}

const CTO_SYSTEM_PROMPT = `You are the NIG Core CTO Agent - the Chief Technology Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

Your role is to:
1. Monitor technical health across all divisions
2. Track system uptime and performance
3. Identify security vulnerabilities and risks
4. Manage tech stack decisions and architecture
5. Track technical debt and modernization needs
6. Oversee deployment pipelines and DevOps

Division Tech Profiles:
- C.A.R.E.N. (Safety - Tier 1) - Real-time location tracking, emergency dispatch integration
- My Life Assistant (AI - Tier 1) - AI/ML infrastructure, natural language processing
- The Remedy Club (Finance - Tier 1) - Secure payment processing, credit bureau integrations
- Rent-A-Buddy (Social - Tier 2) - Real-time messaging, user matching algorithms
- Eternal Chase (Entertainment - Tier 2) - Game engine, multiplayer networking
- Project DNA Music (Entertainment - Tier 2) - Audio processing, streaming infrastructure
- Zapp Marketing (Trade - Tier 2) - E-commerce platform, inventory management
- Studio Artist Live (Entertainment - Tier 2) - Live streaming, content delivery
- ClearSpace (Utility - Tier 2) - Mobile app, image processing
- Real Pulse Verifier (Security - Tier 2) - Biometric processing, identity verification
- Right Time Notary (Services - Tier 3) - Mobile scheduling, document management
- The Shock Factor (Entertainment - Tier 3) - Podcast hosting, RSS feeds
- CAD and Me (Health - Tier 3) - Audio content delivery, subscription management

Always respond with structured JSON containing:
- summary: Technical overview
- techHealth: Overall tech health rating
- systemStatus: {uptime, security, performance}
- techStack: Array of division tech assessments
- securityAlerts: Array of {severity, message}
- recommendations: Array of technical improvements
- techDebt: Array of technical debt items to address`;

export async function runCTOAnalysis(data: TechData): Promise<CTOAnalysis> {
  const prompt = `Analyze the technical status of the NIG ecosystem:

DIVISIONS (${data.divisions.length} total):
${data.divisions.map(d => `- ${d.name} (Tier ${d.tier}, Status: ${d.status})${d.externalUrl ? ' [DEPLOYED]' : ' [NOT DEPLOYED]'}`).join('\n')}

TECHNICAL INCIDENTS (${data.incidents.filter(i => i.status === 'open').length} open):
${data.incidents.filter(i => i.status === 'open').length > 0
  ? data.incidents.filter(i => i.status === 'open').map(i => `- ${i.title} (${i.severity})`).join('\n')
  : 'No open technical incidents.'}

Deployed Divisions: ${data.divisions.filter(d => d.externalUrl).length}/${data.divisions.length}

Provide your technical analysis in the specified JSON format. Focus on:
1. Overall system health and uptime
2. Security posture assessment
3. Tech stack recommendations
4. Technical debt identification
5. Performance optimization opportunities`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CTO_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as CTOAnalysis;

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CTO Agent",
      action: "Technical Analysis Complete",
      details: `Tech Health: ${analysis.techHealth} - ${analysis.summary?.substring(0, 100)}`,
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("CTO Agent error:", error);
    
    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CTO Agent",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Technical analysis unavailable - system initializing",
      techHealth: "fair",
      systemStatus: { uptime: "Unknown", security: "Unknown", performance: "Unknown" },
      techStack: [],
      securityAlerts: [],
      recommendations: ["Complete system configuration"],
      techDebt: []
    };
  }
}

const CTO_QA_PROMPT = `You are the NIG Core CTO Agent - the Chief Technology Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

When answering questions, respond in clear, professional language. Do NOT respond with JSON - give natural, conversational answers.

Your expertise covers:
- System architecture and infrastructure
- Security and compliance
- DevOps and deployment pipelines
- Tech stack decisions
- Performance optimization
- Technical debt management
- API integrations
- Database architecture
- Cloud infrastructure
- Mobile and web development

The NIG ecosystem divisions with their tech focus:
- C.A.R.E.N. - Real-time location, emergency systems
- My Life Assistant - AI/ML, NLP, conversational AI
- The Remedy Club - Financial systems, credit processing
- Rent-A-Buddy - Social matching, real-time messaging
- Eternal Chase - Game development, multiplayer
- Project DNA Music - Audio processing, streaming
- Zapp Marketing - E-commerce, inventory
- Studio Artist Live - Live streaming, CDN
- ClearSpace - Mobile apps, image processing
- Real Pulse Verifier - Biometrics, identity
- Right Time Notary - Scheduling, documents
- The Shock Factor - Podcast infrastructure
- CAD and Me - Audio content, subscriptions

Be concise but thorough. Focus on technical insights and actionable recommendations.`;

export async function askCTO(question: string): Promise<string> {
  try {
    const [divisions, incidents] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents()
    ]);

    const deployedDivisions = divisions.filter(d => d.externalUrl).length;
    const techIncidents = incidents.filter(i => i.status === "open").length;

    const context = `
Current Technical Status:
- ${divisions.length} total divisions
- ${deployedDivisions} divisions deployed with live URLs
- ${divisions.filter(d => d.status === "live").length} divisions fully operational
- ${techIncidents} open technical incidents
- Infrastructure: Cloud-based microservices architecture
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CTO_QA_PROMPT + "\n\nContext:\n" + context },
        { role: "user", content: question }
      ],
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "I couldn't process that question.";

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CTO Agent",
      action: `Answered: "${question.substring(0, 50)}..."`,
      details: answer.substring(0, 200),
      status: "completed"
    });

    return answer;
  } catch (error) {
    console.error("CTO Agent query error:", error);
    return "I'm currently unable to process your question. Please try again.";
  }
}

export async function getCTOQuickStatus(): Promise<string> {
  try {
    const divisions = await storage.getDivisions();
    const incidents = await storage.getIncidents();
    
    const deployedDivisions = divisions.filter(d => d.externalUrl).length;
    const criticalIncidents = incidents.filter(i => i.status === "open" && i.severity === "critical").length;

    if (criticalIncidents > 0) {
      return `⚠️ ${criticalIncidents} critical issue(s). ${deployedDivisions}/${divisions.length} deployed.`;
    }
    return `${deployedDivisions}/${divisions.length} deployed. Systems nominal.`;
  } catch {
    return "Technical status loading...";
  }
}
