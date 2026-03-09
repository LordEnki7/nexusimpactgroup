import OpenAI from "openai";
import { storage } from "../storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const DIVISIONS_CONTEXT = `The NIG ecosystem includes 15 divisions:
- C.A.R.E.N. (Safety - Tier 1) - Automated roadside assistance | carenalert.com
- My Life Assistant (AI - Tier 1) - AI personal concierge | mylifeassistant.vip
- The Remedy Club (Finance - Tier 1) - Credit counseling & debt freedom | theremedyclub.vip
- Rent-A-Buddy (Social - Tier 2) - Platonic connection platform | rent-a-buddy.info
- Eternal Chase (Entertainment - Tier 2) - Immersive entertainment | eternalchase.stream
- Project DNA Music (Entertainment - Tier 2) - Sonic engineering | projectdnamusic.info
- Zapp Marketing and Manufacturing (Trade - Tier 2) - Global manufacturing, 40k+ products | zapp-ecommerce.online
- Studio Artist Live (Entertainment - Tier 2) - Creative performance platform | studioartistlive.com
- ClearSpace (Utility - Tier 2) - iPhone image cleaner | clearspace.photos
- Real Pulse Verifier (Security - Tier 2) - True identity validation
- Right Time Notary (Services - Tier 3) - Mobile notary services
- The Shock Factor (Entertainment - Tier 3) - Podcast entertainment
- CAD and Me (Health - Tier 3) - Coronary artery disease audiobook
- Global Trade Facilitators (Trade - Tier 1) - GSM-102 USDA Export Credit Guarantee | globaltradefacilitators.us.com
- NIG Core (Core - Tier 0) - Central intelligence hub & ecosystem command center`;

const PRIORITY_SCORING_INSTRUCTIONS = `Score each item on a 1-100 priority scale based on:
- Revenue Impact (0-20): Direct revenue generation potential
- Growth Impact (0-20): User acquisition and market expansion potential
- Urgency (0-15): Time sensitivity and competitive pressure
- Ease of Execution (0-15): Implementation complexity (higher = easier)
- Automation Potential (0-15): Can be automated or scaled without human effort
- Strategic Value (0-15): Long-term ecosystem positioning and moat building`;

export interface OpportunityBrief {
  summary: string;
  opportunities: Array<{
    title: string;
    description: string;
    type: "growth" | "partnership" | "investment" | "market_expansion" | "product";
    divisions_involved: string[];
    priority_score: number;
    estimated_revenue_impact: string;
    timeline: string;
    next_steps: string[];
  }>;
  market_trends: string[];
  competitive_insights: string[];
}

export interface RevenueProposal {
  summary: string;
  revenue_streams: Array<{
    title: string;
    description: string;
    asset_type: "app" | "content" | "data" | "service" | "partnership" | "subscription";
    source_division: string;
    estimated_monthly_revenue: string;
    implementation_effort: "low" | "medium" | "high";
    priority_score: number;
    monetization_model: string;
    action_plan: string[];
  }>;
  cross_sell_opportunities: Array<{
    from_division: string;
    to_division: string;
    opportunity: string;
    estimated_impact: string;
  }>;
  total_estimated_new_revenue: string;
}

export interface CampaignProposal {
  summary: string;
  campaigns: Array<{
    title: string;
    division: string;
    objective: string;
    target_audience: string;
    channels: string[];
    budget_estimate: string;
    expected_results: string;
    priority_score: number;
    timeline: string;
    viral_potential: "low" | "medium" | "high";
    action_steps: string[];
  }>;
  funnel_optimizations: Array<{
    division: string;
    stage: string;
    current_issue: string;
    recommended_fix: string;
    expected_improvement: string;
  }>;
  viral_opportunities: string[];
}

export interface OptimizationReport {
  summary: string;
  inefficiencies: Array<{
    title: string;
    area: string;
    description: string;
    impact: "low" | "medium" | "high" | "critical";
    current_cost: string;
    potential_savings: string;
  }>;
  automations: Array<{
    title: string;
    description: string;
    divisions_affected: string[];
    priority_score: number;
    implementation_effort: "low" | "medium" | "high";
    time_saved_weekly: string;
    action_plan: string[];
  }>;
  workflow_improvements: Array<{
    workflow: string;
    current_state: string;
    proposed_state: string;
    benefit: string;
  }>;
  system_health_score: number;
}

const OPPORTUNITY_HUNTER_PROMPT = `You are the NIG Opportunity Hunter Agent - a specialized AI that scans for growth, partnership, investment, and market expansion opportunities across the Nexus Impact Group ecosystem.

${DIVISIONS_CONTEXT}

Your mission:
1. Identify untapped growth opportunities across all divisions
2. Spot partnership and collaboration potential (internal cross-division and external)
3. Find investment-worthy initiatives with high ROI
4. Detect market gaps and emerging trends relevant to NIG divisions
5. Evaluate competitive landscape for strategic advantages

${PRIORITY_SCORING_INSTRUCTIONS}

Always respond with structured JSON containing:
- summary: Executive overview of opportunity landscape
- opportunities: Array of opportunity briefs with priority scores
- market_trends: Array of relevant market trends
- competitive_insights: Array of competitive intelligence findings`;

const REVENUE_GENERATOR_PROMPT = `You are the NIG Revenue Generator Agent - a specialized AI that analyzes all ecosystem assets and identifies new monetization opportunities for Nexus Impact Group.

${DIVISIONS_CONTEXT}

Your mission:
1. Analyze all ecosystem assets (apps, content, data, services, partnerships)
2. Identify new revenue streams and monetization models
3. Find cross-selling and upselling opportunities between divisions
4. Optimize pricing strategies across the ecosystem
5. Discover subscription, licensing, and data monetization opportunities
6. Calculate estimated revenue impact for each opportunity

${PRIORITY_SCORING_INSTRUCTIONS}

Always respond with structured JSON containing:
- summary: Revenue landscape overview
- revenue_streams: Array of revenue opportunities with priority scores
- cross_sell_opportunities: Array of cross-division revenue plays
- total_estimated_new_revenue: Estimated total new monthly revenue`;

const GROWTH_ENGINE_PROMPT = `You are the NIG Growth Engine Agent - a specialized AI that designs marketing campaigns, identifies viral opportunities, and optimizes acquisition funnels for Nexus Impact Group.

${DIVISIONS_CONTEXT}

Your mission:
1. Design high-impact marketing campaigns for each division
2. Identify viral growth opportunities and network effects
3. Optimize user acquisition funnels across all platforms
4. Create cross-promotion strategies between divisions
5. Spot influencer and community growth opportunities
6. Maximize organic growth through SEO, content, and social strategies

${PRIORITY_SCORING_INSTRUCTIONS}

Always respond with structured JSON containing:
- summary: Growth landscape overview
- campaigns: Array of campaign proposals with priority scores
- funnel_optimizations: Array of funnel improvement recommendations
- viral_opportunities: Array of viral growth strategies`;

const SYSTEM_OPTIMIZER_PROMPT = `You are the NIG System Optimizer Agent - a specialized AI that detects inefficiencies, simplifies workflows, and proposes automations across the Nexus Impact Group ecosystem.

${DIVISIONS_CONTEXT}

Your mission:
1. Detect operational inefficiencies across all divisions
2. Identify repetitive tasks that can be automated
3. Simplify workflows and reduce complexity
4. Optimize resource allocation and utilization
5. Propose technology upgrades and integrations
6. Monitor system health and performance bottlenecks

${PRIORITY_SCORING_INSTRUCTIONS}

Always respond with structured JSON containing:
- summary: System health overview
- inefficiencies: Array of detected inefficiencies
- automations: Array of automation proposals with priority scores
- workflow_improvements: Array of workflow optimization recommendations
- system_health_score: Overall system health score (1-100)`;

async function getEcosystemContext(): Promise<string> {
  try {
    const [divisions, financials, incidents, agentLogs, proposals] = await Promise.all([
      storage.getDivisions(),
      storage.getFinancialSnapshots(),
      storage.getIncidents(),
      storage.getAgentLogs(20),
      storage.getProposals()
    ]);

    const liveDivisions = divisions.filter(d => d.externalUrl).length;
    const openIncidents = incidents.filter(i => i.status === "open").length;
    const pendingProposals = proposals.filter(p => p.status === "pending").length;

    return `
CURRENT ECOSYSTEM STATUS:
- Total Divisions: ${divisions.length}
- Live Divisions: ${liveDivisions}
- Open Incidents: ${openIncidents}
- Pending Proposals: ${pendingProposals}

DIVISIONS:
${divisions.map(d => `- ${d.name} (${d.category}, Tier ${d.tier}, Status: ${d.status})${d.externalUrl ? ` [LIVE: ${d.externalUrl}]` : ' [NOT LIVE]'}`).join('\n')}

FINANCIAL DATA:
${financials.length > 0
      ? financials.slice(0, 10).map(f => `Period: ${f.period}, Revenue: $${f.revenue || 0}, Costs: $${f.costs || 0}`).join('\n')
      : 'No financial data recorded yet - ecosystem is in setup phase.'}

RECENT AGENT ACTIVITY:
${agentLogs.slice(0, 5).map(l => `- ${l.agentName}: ${l.action} (${l.status})`).join('\n') || 'No recent activity.'}
`;
  } catch {
    return "Ecosystem data unavailable - system initializing.";
  }
}

export async function runOpportunityHunter(focusArea?: string): Promise<OpportunityBrief> {
  const context = await getEcosystemContext();

  const prompt = `Scan the NIG ecosystem for opportunities${focusArea ? ` with focus on: ${focusArea}` : ''}.

${context}

Identify the top growth, partnership, investment, and market expansion opportunities. Prioritize opportunities that leverage cross-division synergies and the ecosystem's unique breadth across Safety, AI, Finance, Entertainment, Trade, Health, and Security.

Provide your analysis in the specified JSON format with priority scores for each opportunity.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: OPPORTUNITY_HUNTER_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as OpportunityBrief;

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "Opportunity Hunter",
      action: "Opportunity Scan Complete",
      details: `Found ${analysis.opportunities?.length || 0} opportunities. ${analysis.summary?.substring(0, 150)}`,
      status: "completed"
    });

    await storage.createExecutionReport({
      taskTitle: "Opportunity Scan",
      agentName: "Opportunity Hunter",
      objective: focusArea || "Full ecosystem opportunity scan",
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
      actionLog: JSON.stringify(analysis.opportunities?.map(o => o.title) || []),
      toolsUsed: "OpenAI GPT-4o, Ecosystem Data Analysis",
      outputsCreated: `${analysis.opportunities?.length || 0} opportunity briefs`,
      qualityScore: 8,
      resultsReview: analysis.summary,
    });

    return analysis;
  } catch (error) {
    console.error("Opportunity Hunter error:", error);

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "Opportunity Hunter",
      action: "Scan Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Opportunity scan unavailable - system initializing",
      opportunities: [],
      market_trends: ["System is being configured"],
      competitive_insights: []
    };
  }
}

export async function runRevenueGenerator(focusArea?: string): Promise<RevenueProposal> {
  const context = await getEcosystemContext();

  const prompt = `Analyze the NIG ecosystem for new revenue opportunities${focusArea ? ` with focus on: ${focusArea}` : ''}.

${context}

Identify monetization opportunities across all ecosystem assets: apps, content, data, services, partnerships, and subscriptions. Focus on quick-win revenue streams and high-value long-term plays.

Provide your analysis in the specified JSON format with priority scores and estimated revenue impact.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: REVENUE_GENERATOR_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as RevenueProposal;

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "Revenue Generator",
      action: "Revenue Analysis Complete",
      details: `Found ${analysis.revenue_streams?.length || 0} revenue streams. Est. new revenue: ${analysis.total_estimated_new_revenue || 'TBD'}`,
      status: "completed"
    });

    await storage.createExecutionReport({
      taskTitle: "Revenue Analysis",
      agentName: "Revenue Generator",
      objective: focusArea || "Full ecosystem revenue analysis",
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
      actionLog: JSON.stringify(analysis.revenue_streams?.map(r => r.title) || []),
      toolsUsed: "OpenAI GPT-4o, Financial Data Analysis",
      outputsCreated: `${analysis.revenue_streams?.length || 0} revenue proposals, ${analysis.cross_sell_opportunities?.length || 0} cross-sell opportunities`,
      qualityScore: 8,
      resultsReview: analysis.summary,
      businessImpact: `Estimated new revenue: ${analysis.total_estimated_new_revenue || 'TBD'}`,
    });

    return analysis;
  } catch (error) {
    console.error("Revenue Generator error:", error);

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "Revenue Generator",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Revenue analysis unavailable - system initializing",
      revenue_streams: [],
      cross_sell_opportunities: [],
      total_estimated_new_revenue: "$0"
    };
  }
}

export async function runGrowthEngine(focusArea?: string): Promise<CampaignProposal> {
  const context = await getEcosystemContext();

  const prompt = `Design growth campaigns and optimize funnels for the NIG ecosystem${focusArea ? ` with focus on: ${focusArea}` : ''}.

${context}

Create high-impact marketing campaigns, identify viral growth opportunities, and recommend funnel optimizations. Prioritize campaigns that can drive immediate user acquisition and those with viral potential.

Provide your analysis in the specified JSON format with priority scores for each campaign.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: GROWTH_ENGINE_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as CampaignProposal;

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "Growth Engine",
      action: "Growth Analysis Complete",
      details: `Designed ${analysis.campaigns?.length || 0} campaigns. ${analysis.summary?.substring(0, 150)}`,
      status: "completed"
    });

    await storage.createExecutionReport({
      taskTitle: "Growth Campaign Design",
      agentName: "Growth Engine",
      objective: focusArea || "Full ecosystem growth analysis",
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
      actionLog: JSON.stringify(analysis.campaigns?.map(c => c.title) || []),
      toolsUsed: "OpenAI GPT-4o, Marketing Analytics",
      outputsCreated: `${analysis.campaigns?.length || 0} campaign proposals, ${analysis.funnel_optimizations?.length || 0} funnel fixes`,
      qualityScore: 8,
      resultsReview: analysis.summary,
    });

    return analysis;
  } catch (error) {
    console.error("Growth Engine error:", error);

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "Growth Engine",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Growth analysis unavailable - system initializing",
      campaigns: [],
      funnel_optimizations: [],
      viral_opportunities: []
    };
  }
}

export async function runSystemOptimizer(focusArea?: string): Promise<OptimizationReport> {
  const context = await getEcosystemContext();

  const prompt = `Analyze the NIG ecosystem for inefficiencies and optimization opportunities${focusArea ? ` with focus on: ${focusArea}` : ''}.

${context}

Detect operational inefficiencies, propose automations, and recommend workflow improvements. Focus on reducing costs, saving time, and improving system reliability across all divisions.

Provide your analysis in the specified JSON format with priority scores and a system health score.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_OPTIMIZER_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as OptimizationReport;

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "System Optimizer",
      action: "Optimization Scan Complete",
      details: `Found ${analysis.inefficiencies?.length || 0} inefficiencies, proposed ${analysis.automations?.length || 0} automations. Health: ${analysis.system_health_score || 'N/A'}/100`,
      status: "completed"
    });

    await storage.createExecutionReport({
      taskTitle: "System Optimization Scan",
      agentName: "System Optimizer",
      objective: focusArea || "Full ecosystem optimization scan",
      status: "completed",
      startTime: new Date(),
      endTime: new Date(),
      actionLog: JSON.stringify([
        ...(analysis.inefficiencies?.map(i => `Inefficiency: ${i.title}`) || []),
        ...(analysis.automations?.map(a => `Automation: ${a.title}`) || [])
      ]),
      toolsUsed: "OpenAI GPT-4o, System Analysis",
      outputsCreated: `${analysis.inefficiencies?.length || 0} inefficiency reports, ${analysis.automations?.length || 0} automation proposals`,
      qualityScore: 8,
      resultsReview: analysis.summary,
    });

    return analysis;
  } catch (error) {
    console.error("System Optimizer error:", error);

    await storage.createAgentLog({
      agentType: "specialist",
      agentName: "System Optimizer",
      action: "Scan Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Optimization scan unavailable - system initializing",
      inefficiencies: [],
      automations: [],
      workflow_improvements: [],
      system_health_score: 0
    };
  }
}
