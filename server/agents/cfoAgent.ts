import { openai } from "./openaiClient";
import { storage } from "../storage";

export interface CFOAnalysis {
  summary: string;
  insights: string[];
  recommendations: string[];
  alerts: { severity: "low" | "medium" | "high" | "critical"; message: string }[];
  projections: { metric: string; current: number; projected: number; trend: string }[];
}

export interface FinancialData {
  divisions: Array<{
    name: string;
    status: string;
    tier: number;
    category: string;
  }>;
  financials: Array<{
    divisionId: number | null;
    period: string;
    revenue: string | null;
    costs: string | null;
    margin: string | null;
    subscribers: number | null;
    activeUsers: number | null;
  }>;
  incidents: Array<{
    title: string;
    severity: string;
    status: string;
    divisionId: number;
  }>;
}

const CFO_SYSTEM_PROMPT = `You are the NIG Core CFO Agent - a sophisticated AI financial advisor for Nexus Impact Group's ecosystem of 14 technology divisions.

Your role is to:
1. Analyze financial health across all divisions
2. Identify revenue opportunities and cost optimizations
3. Detect financial risks and provide early warnings
4. Generate actionable recommendations for business growth
5. Track key performance indicators and trends

The NIG ecosystem includes these divisions:
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

Always respond with structured JSON containing:
- summary: A brief executive summary
- insights: Array of key observations
- recommendations: Array of actionable suggestions
- alerts: Array of {severity, message} for urgent items
- projections: Array of {metric, current, projected, trend} for forecasts`;

export async function runCFOAnalysis(data: FinancialData): Promise<CFOAnalysis> {
  const prompt = `Analyze the following NIG ecosystem data and provide financial insights:

DIVISIONS (${data.divisions.length} total):
${data.divisions.map(d => `- ${d.name} (${d.category}, Tier ${d.tier}, Status: ${d.status})`).join('\n')}

FINANCIAL DATA:
${data.financials.length > 0 
  ? data.financials.map(f => `Period: ${f.period}, Revenue: $${f.revenue || 0}, Costs: $${f.costs || 0}, Margin: ${f.margin || 0}%, Subscribers: ${f.subscribers || 0}`).join('\n')
  : 'No financial data recorded yet - this is a new system being set up.'}

ACTIVE INCIDENTS:
${data.incidents.filter(i => i.status === 'open').length > 0
  ? data.incidents.filter(i => i.status === 'open').map(i => `- ${i.title} (${i.severity})`).join('\n')
  : 'No open incidents.'}

Provide your analysis in the specified JSON format. Focus on:
1. Division performance optimization
2. Revenue growth opportunities
3. Cost reduction strategies
4. Risk mitigation
5. Strategic priorities for Q1 2026`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CFO_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as CFOAnalysis;

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CFO Agent",
      action: "Financial Analysis Complete",
      details: analysis.summary,
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("CFO Agent error:", error);
    
    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CFO Agent",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Analysis unavailable - system initializing",
      insights: ["CFO Agent is setting up initial connections"],
      recommendations: ["Complete system configuration"],
      alerts: [],
      projections: []
    };
  }
}

export async function getCFOQuickStatus(): Promise<string> {
  try {
    const divisions = await storage.getDivisions();
    const liveDivisions = divisions.filter(d => d.status === "live").length;
    const incidents = await storage.getIncidents();
    const openIncidents = incidents.filter(i => i.status === "open").length;

    return `${liveDivisions}/${divisions.length} divisions live. ${openIncidents} open incidents.`;
  } catch {
    return "System initializing...";
  }
}

const CFO_QA_PROMPT = `You are the NIG Core CFO Agent - a sophisticated AI financial advisor for Nexus Impact Group's ecosystem of 14 technology divisions.

When answering questions, respond in clear, professional language. Do NOT respond with JSON - give natural, conversational answers that are easy to read.

The NIG ecosystem includes these divisions:
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

Be concise but thorough. Use bullet points when listing multiple items. Focus on actionable insights.`;

export async function askCFO(question: string): Promise<string> {
  try {
    const [divisions, financials, incidents] = await Promise.all([
      storage.getDivisions(),
      storage.getFinancialSnapshots(),
      storage.getIncidents()
    ]);

    const context = `
Current NIG Ecosystem Status:
- ${divisions.length} total divisions
- ${divisions.filter(d => d.status === "live").length} live divisions
- ${incidents.filter(i => i.status === "open").length} open incidents
- Tier 1 divisions: ${divisions.filter(d => d.tier === 1).map(d => d.name).join(", ") || "None configured yet"}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CFO_QA_PROMPT + "\n\nContext:\n" + context },
        { role: "user", content: question }
      ],
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "I couldn't process that question.";

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CFO Agent",
      action: `Answered: "${question.substring(0, 50)}..."`,
      details: answer.substring(0, 200),
      status: "completed"
    });

    return answer;
  } catch (error) {
    console.error("CFO Agent query error:", error);
    return "I'm currently unable to process your question. Please try again.";
  }
}
