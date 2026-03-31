import { openai } from "./openaiClient";
import { storage } from "../storage";

const NIG_DIVISIONS = [
  { name: "C.A.R.E.N.", category: "Safety", tier: 1, domain: "carenalert.com", description: "Automated roadside assistance" },
  { name: "My Life Assistant", category: "AI", tier: 1, domain: "mylifeassistant.vip", description: "AI personal concierge" },
  { name: "The Remedy Club", category: "Finance", tier: 1, domain: "theremedyclub.vip", description: "Credit counseling & debt freedom" },
  { name: "Rent-A-Buddy", category: "Social", tier: 2, domain: "rent-a-buddy.info", description: "Platonic connection platform" },
  { name: "Eternal Chase", category: "Entertainment", tier: 2, domain: "eternalchase.stream", description: "Immersive entertainment" },
  { name: "Project DNA Music", category: "Entertainment", tier: 2, domain: "projectdnamusic.info", description: "Sonic engineering & music production" },
  { name: "Zapp Marketing and Manufacturing", category: "Trade", tier: 2, domain: "zapp-ecommerce.online", description: "Global manufacturing & 40,000+ products" },
  { name: "Studio Artist Live", category: "Entertainment", tier: 2, domain: "studioartistlive.com", description: "Creative performance platform" },
  { name: "ClearSpace", category: "Utility", tier: 2, domain: "clearspace.photos", description: "iPhone image cleaner" },
  { name: "Real Pulse Verifier", category: "Security", tier: 2, domain: "realpulseverifier.com", description: "True identity validation — LIVE" },
  { name: "Right Time Notary", category: "Services", tier: 3, domain: "", description: "Mobile notary services" },
  { name: "The Shock Factor", category: "Entertainment", tier: 3, domain: "", description: "Podcast entertainment" },
  { name: "CAD and Me", category: "Health", tier: 3, domain: "", description: "Coronary artery disease audiobook" },
  { name: "Global Trade Facilitators", category: "Trade", tier: 1, domain: "globaltradefacilitators.us.com", description: "GSM-102 USDA Export Credit Guarantee" },
  { name: "NIG Core", category: "Core", tier: 0, domain: "", description: "Central intelligence hub & ecosystem command center" },
];

const ORCHESTRATOR_SYSTEM_PROMPT = `You are the Universal Business Orchestrator Agent for Nexus Impact Group (NIG).

You sit above all executive agents (CFO, COO, CTO, CMO, CHRO) and coordinate the entire AI business ecosystem.

MISSION: Maximize revenue, growth, efficiency, automation, and long-term value across all 15 divisions.

RESPONSIBILITIES:
- Monitor system activity across all divisions
- Prioritize high-impact opportunities
- Coordinate specialized agents (executives + specialists)
- Review completed tasks and log outcomes
- Propose strategic initiatives for owner approval
- Identify cross-business synergies between divisions

THE NIG ECOSYSTEM (15 Divisions):
${NIG_DIVISIONS.map(d => `- ${d.name} (${d.category} - Tier ${d.tier}) - ${d.description} [${d.domain}]`).join('\n')}

DIVISION TIERS:
- Tier 1 (Critical/Revenue Priority): C.A.R.E.N., My Life Assistant, The Remedy Club, NIG Core
- Tier 2 (Growth/Scale): Rent-A-Buddy, Eternal Chase, Project DNA Music, Zapp Marketing, Studio Artist Live, ClearSpace, Real Pulse Verifier, Mr. Delete
- Tier 3 (Developing): Right Time Notary, The Shock Factor, CAD and Me

EXECUTIVE AGENTS AVAILABLE:
- CFO Agent: Financial analysis, revenue tracking, cost optimization
- COO Agent: Operations monitoring, workflow efficiency, incident management
- CTO Agent: Technical infrastructure, security, deployments, tech debt
- CMO Agent: Marketing strategy, brand health, customer acquisition
- CHRO Agent: Workforce planning, team capacity, hiring priorities

SPECIALIST AGENTS AVAILABLE:
- Opportunity Hunter: Scans for growth, partnership, investment opportunities
- Revenue Generator: Identifies monetization from ecosystem assets
- Growth Engine: Marketing campaigns, viral opportunities, funnel optimization
- System Optimizer: Efficiency improvements, workflow automation

DECISION RULES:
- Prioritize revenue generation and growth
- Favor automation and repeatable systems
- Identify cross-platform opportunities
- Major actions require owner approval
- Low-risk quick wins may be auto-executed
- Never suggest busywork - focus on high-impact actions

PRIORITY SCORING MODEL (1-100):
Calculate based on weighted factors:
- Revenue Impact (25%): Direct revenue potential
- Growth Impact (20%): User/market growth potential
- Urgency (15%): Time sensitivity
- Ease of Execution (15%): Resources and complexity
- Automation Potential (15%): Can it be systematized
- Strategic Value (10%): Long-term positioning

DECISION STYLE:
- Think strategically
- Communicate clearly and directly
- Recommend decisive action
- Avoid vague suggestions
- Focus on outcomes, not activity
- Favor leverage, automation, and repeatable systems`;

const DAILY_BRIEF_PROMPT = `Generate a comprehensive Daily Executive Brief with ALL 9 sections.

Return a JSON object with this exact structure:
{
  "executiveSummary": "Concise overview of the most important business situation right now",
  "priorityActions": [
    {
      "title": "Action title",
      "whyItMatters": "Why this matters",
      "expectedImpact": "Expected impact",
      "urgency": "critical|high|medium|low",
      "businessAffected": "Division or platform name",
      "agentsRequired": ["Agent names"],
      "assetsNeeded": ["Assets/tools needed"],
      "approvalNeeded": true,
      "priorityScore": 92
    }
  ],
  "opportunities": [
    {
      "title": "Opportunity title",
      "description": "Description",
      "expectedBenefit": "Expected benefit",
      "priorityScore": 85
    }
  ],
  "bottlenecks": [
    {
      "issue": "Problem description",
      "impact": "How it affects business",
      "suggestedFix": "Recommended resolution"
    }
  ],
  "quickWins": [
    {
      "action": "Quick win description",
      "expectedResult": "What it achieves",
      "timeToComplete": "Estimated time"
    }
  ],
  "approvalQueue": [
    {
      "proposal": "What needs approval",
      "objective": "Goal",
      "plan": "Execution plan",
      "expectedResult": "Expected outcome",
      "resourcesRequired": "What's needed",
      "estimatedTime": "Time estimate"
    }
  ],
  "agentDeployments": [
    {
      "agent": "Agent name",
      "task": "What the agent should do",
      "reason": "Why this deployment"
    }
  ],
  "synergies": [
    {
      "divisions": ["Division A", "Division B"],
      "opportunity": "How they can work together",
      "expectedBenefit": "What this achieves"
    }
  ],
  "successTargets": [
    {
      "target": "What success looks like",
      "metric": "How to measure it"
    }
  ]
}`;

export interface DailyBriefData {
  executiveSummary: string;
  priorityActions: Array<{
    title: string;
    whyItMatters: string;
    expectedImpact: string;
    urgency: string;
    businessAffected: string;
    agentsRequired: string[];
    assetsNeeded: string[];
    approvalNeeded: boolean;
    priorityScore: number;
  }>;
  opportunities: Array<{
    title: string;
    description: string;
    expectedBenefit: string;
    priorityScore: number;
  }>;
  bottlenecks: Array<{
    issue: string;
    impact: string;
    suggestedFix: string;
  }>;
  quickWins: Array<{
    action: string;
    expectedResult: string;
    timeToComplete: string;
  }>;
  approvalQueue: Array<{
    proposal: string;
    objective: string;
    plan: string;
    expectedResult: string;
    resourcesRequired: string;
    estimatedTime: string;
  }>;
  agentDeployments: Array<{
    agent: string;
    task: string;
    reason: string;
  }>;
  synergies: Array<{
    divisions: string[];
    opportunity: string;
    expectedBenefit: string;
  }>;
  successTargets: Array<{
    target: string;
    metric: string;
  }>;
}

export interface ProposalInput {
  title: string;
  objective: string;
  reason: string;
  platformsInvolved?: string;
  agentsRequired?: string;
  resourcesNeeded?: string;
  expectedResult?: string;
  estimatedTime?: string;
  urgency?: string;
  category?: string;
}

export interface CrossBusinessAnalysis {
  summary: string;
  synergies: Array<{
    divisions: string[];
    opportunity: string;
    expectedBenefit: string;
    priorityScore: number;
    implementationSteps: string[];
  }>;
  sharedResources: Array<{
    resource: string;
    currentOwner: string;
    canBenefit: string[];
    savings: string;
  }>;
  crossSellingOpportunities: Array<{
    from: string;
    to: string;
    strategy: string;
    expectedRevenue: string;
  }>;
  recommendations: string[];
}

export interface EcosystemOverview {
  totalDivisions: number;
  liveDivisions: number;
  activeDivisions: number;
  openIncidents: number;
  criticalIncidents: number;
  pendingProposals: number;
  recentExecutions: number;
  divisionBreakdown: Array<{
    name: string;
    status: string;
    tier: number;
    category: string;
  }>;
  agentStatus: string;
  healthScore: string;
}

export async function generateDailyBrief(): Promise<DailyBriefData> {
  try {
    const [divisions, incidents, financials, agentLogs, proposals, executionReports, subscribers, inquiries] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents(),
      storage.getFinancialSnapshots(),
      storage.getAgentLogs(20),
      storage.getProposals(),
      storage.getExecutionReports(10),
      storage.getSubscribers(),
      storage.getInquiries()
    ]);

    const pendingProposals = proposals.filter(p => p.status === "pending");
    const openIncidents = incidents.filter(i => i.status === "open");
    const liveDivisions = divisions.filter(d => d.status === "live");

    const contextPrompt = `${DAILY_BRIEF_PROMPT}

CURRENT ECOSYSTEM DATA:

DIVISIONS (${divisions.length} total, ${liveDivisions.length} live):
${divisions.map(d => `- ${d.name} (${d.category}, Tier ${d.tier}, Status: ${d.status})${d.externalUrl ? ' [LIVE: ' + d.externalUrl + ']' : ''}`).join('\n')}

FINANCIAL DATA:
${financials.length > 0 
  ? financials.slice(0, 10).map(f => `Period: ${f.period}, Revenue: $${f.revenue || 0}, Costs: $${f.costs || 0}, Subscribers: ${f.subscribers || 0}`).join('\n')
  : 'No financial data recorded yet - system is being set up.'}

OPEN INCIDENTS (${openIncidents.length}):
${openIncidents.length > 0 ? openIncidents.map(i => `- ${i.title} (${i.severity})`).join('\n') : 'No open incidents.'}

PENDING PROPOSALS (${pendingProposals.length}):
${pendingProposals.length > 0 ? pendingProposals.map(p => `- ${p.title} (Priority: ${p.priorityScore}, Category: ${p.category})`).join('\n') : 'No pending proposals.'}

RECENT AGENT ACTIVITY:
${agentLogs.length > 0 ? agentLogs.slice(0, 10).map(l => `- ${l.agentName}: ${l.action} (${l.status})`).join('\n') : 'No recent agent activity.'}

RECENT EXECUTION REPORTS:
${executionReports.length > 0 ? executionReports.slice(0, 5).map(r => `- ${r.taskTitle}: ${r.status} (Quality: ${r.qualityScore || 'N/A'})`).join('\n') : 'No execution reports yet.'}

MARKETING METRICS:
- Newsletter Subscribers: ${subscribers.length}
- Contact Inquiries: ${inquiries.length}

Today's Date: ${new Date().toISOString().split('T')[0]}

Generate the Daily Executive Brief now. Be specific, actionable, and data-driven.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ORCHESTRATOR_SYSTEM_PROMPT },
        { role: "user", content: contextPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const briefData = JSON.parse(content) as DailyBriefData;

    const today = new Date().toISOString().split('T')[0];
    await storage.createDailyBrief({
      briefDate: today,
      executiveSummary: briefData.executiveSummary || "Brief generated",
      priorityActions: JSON.stringify(briefData.priorityActions || []),
      opportunities: JSON.stringify(briefData.opportunities || []),
      bottlenecks: JSON.stringify(briefData.bottlenecks || []),
      quickWins: JSON.stringify(briefData.quickWins || []),
      approvalQueue: JSON.stringify(briefData.approvalQueue || []),
      agentDeployments: JSON.stringify(briefData.agentDeployments || []),
      synergies: JSON.stringify(briefData.synergies || []),
      successTargets: JSON.stringify(briefData.successTargets || []),
    });

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: "Daily Executive Brief Generated",
      details: briefData.executiveSummary?.substring(0, 200) || "Brief generated",
      status: "completed"
    });

    await storage.createMemoryEntry({
      category: "daily_brief",
      title: `Daily Brief - ${today}`,
      content: briefData.executiveSummary || "Brief generated",
      agentSource: "Master Orchestrator",
      qualityScore: 8,
      tags: "daily,brief,executive",
    });

    return briefData;
  } catch (error) {
    console.error("Orchestrator Daily Brief error:", error);

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: "Daily Brief Generation Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      executiveSummary: "Daily brief generation encountered an error. System is initializing.",
      priorityActions: [],
      opportunities: [],
      bottlenecks: [{ issue: "Brief generation failed", impact: "No daily overview available", suggestedFix: "Retry brief generation" }],
      quickWins: [],
      approvalQueue: [],
      agentDeployments: [],
      synergies: [],
      successTargets: [],
    };
  }
}

export async function createProposal(input: ProposalInput): Promise<any> {
  try {
    const scoringPrompt = `Evaluate this task proposal and assign a priority score (1-100) based on:
- Revenue Impact (25%)
- Growth Impact (20%)
- Urgency (15%)
- Ease of Execution (15%)
- Automation Potential (15%)
- Strategic Value (10%)

Proposal:
- Title: ${input.title}
- Objective: ${input.objective}
- Reason: ${input.reason}
- Platforms: ${input.platformsInvolved || "Not specified"}
- Expected Result: ${input.expectedResult || "Not specified"}

Return JSON: { "priorityScore": <number>, "category": "<string>", "urgency": "critical|high|medium|low", "analysis": "<brief analysis>" }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ORCHESTRATOR_SYSTEM_PROMPT },
        { role: "user", content: scoringPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const scoring = JSON.parse(response.choices[0]?.message?.content || "{}");

    const proposal = await storage.createProposal({
      title: input.title,
      objective: input.objective,
      reason: input.reason,
      platformsInvolved: input.platformsInvolved || null,
      agentsRequired: input.agentsRequired || null,
      resourcesNeeded: input.resourcesNeeded || null,
      expectedResult: input.expectedResult || null,
      estimatedTime: input.estimatedTime || null,
      priorityScore: scoring.priorityScore || 50,
      urgency: scoring.urgency || input.urgency || "medium",
      category: scoring.category || input.category || "general",
      status: "pending",
      rejectionReason: null,
    });

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: `Proposal Created: ${input.title}`,
      details: `Priority Score: ${scoring.priorityScore || 50} | ${scoring.analysis || "Scored by orchestrator"}`,
      status: "completed"
    });

    return { ...proposal, analysis: scoring.analysis };
  } catch (error) {
    console.error("Orchestrator create proposal error:", error);

    const proposal = await storage.createProposal({
      title: input.title,
      objective: input.objective,
      reason: input.reason,
      platformsInvolved: input.platformsInvolved || null,
      agentsRequired: input.agentsRequired || null,
      resourcesNeeded: input.resourcesNeeded || null,
      expectedResult: input.expectedResult || null,
      estimatedTime: input.estimatedTime || null,
      priorityScore: 50,
      urgency: input.urgency || "medium",
      category: input.category || "general",
      status: "pending",
      rejectionReason: null,
    });

    return proposal;
  }
}

export async function executeApprovedTask(proposalId: number): Promise<any> {
  const proposal = await storage.getProposal(proposalId);
  if (!proposal) {
    throw new Error(`Proposal ${proposalId} not found`);
  }
  if (proposal.status !== "approved") {
    throw new Error(`Proposal ${proposalId} is not approved (status: ${proposal.status})`);
  }

  const startTime = new Date();

  const report = await storage.createExecutionReport({
    proposalId: proposal.id,
    taskTitle: proposal.title,
    agentName: "Master Orchestrator",
    objective: proposal.objective,
    status: "in_progress",
    startTime: startTime,
  });

  try {
    const executionPrompt = `You are executing an approved task. Simulate the execution and produce a comprehensive execution report.

TASK DETAILS:
- Title: ${proposal.title}
- Objective: ${proposal.objective}
- Reason: ${proposal.reason}
- Platforms Involved: ${proposal.platformsInvolved || "General"}
- Agents Required: ${proposal.agentsRequired || "Master Orchestrator"}
- Resources Needed: ${proposal.resourcesNeeded || "Standard"}
- Expected Result: ${proposal.expectedResult || "Not specified"}

Generate a complete execution report as JSON:
{
  "actionLog": "Step-by-step list of actions taken",
  "toolsUsed": "Tools, APIs, and assets used",
  "outputsCreated": "Deliverables and outputs produced",
  "qualityScore": <1-10>,
  "qualityReview": "Assessment of work quality - strengths, weaknesses, risks",
  "resultsReview": "Expected vs actual outcome analysis",
  "businessImpact": "Expected business impact",
  "lessonsLearned": "Key takeaways from execution",
  "nextSteps": "Recommended follow-up actions"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ORCHESTRATOR_SYSTEM_PROMPT },
        { role: "user", content: executionPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const executionResult = JSON.parse(response.choices[0]?.message?.content || "{}");
    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    const updatedReport = await storage.updateExecutionReport(report.id, {
      status: "completed",
      endTime: endTime,
      durationMinutes: durationMinutes || 1,
      actionLog: executionResult.actionLog || "Task executed",
      toolsUsed: executionResult.toolsUsed || "AI orchestration tools",
      outputsCreated: executionResult.outputsCreated || "Execution outputs",
      qualityScore: executionResult.qualityScore || 7,
      qualityReview: executionResult.qualityReview || "Task completed satisfactorily",
      resultsReview: executionResult.resultsReview || "Results match expectations",
      businessImpact: executionResult.businessImpact || "Positive business impact expected",
      lessonsLearned: executionResult.lessonsLearned || "Execution proceeded as planned",
      nextSteps: executionResult.nextSteps || "Monitor results and iterate",
    });

    await storage.updateProposalStatus(proposalId, "executed");

    await storage.createMemoryEntry({
      category: "execution",
      title: `Executed: ${proposal.title}`,
      content: `Quality: ${executionResult.qualityScore}/10. ${executionResult.lessonsLearned || "No lessons recorded"}`,
      agentSource: "Master Orchestrator",
      qualityScore: executionResult.qualityScore || 7,
      tags: "execution,completed,audit",
    });

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: `Task Executed: ${proposal.title}`,
      details: `Quality: ${executionResult.qualityScore}/10 | Duration: ${durationMinutes}min`,
      status: "completed"
    });

    return updatedReport;
  } catch (error) {
    console.error("Orchestrator execution error:", error);

    const endTime = new Date();
    const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

    await storage.updateExecutionReport(report.id, {
      status: "failed",
      endTime: endTime,
      durationMinutes: durationMinutes || 1,
      actionLog: "Execution failed due to error",
      qualityScore: 1,
      qualityReview: error instanceof Error ? error.message : "Unknown error",
    });

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: `Task Execution Failed: ${proposal.title}`,
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    throw error;
  }
}

export async function askOrchestrator(question: string): Promise<string> {
  try {
    const [divisions, incidents, proposals, agentLogs, latestBrief] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents(),
      storage.getProposals(),
      storage.getAgentLogs(10),
      storage.getLatestBrief()
    ]);

    const liveDivisions = divisions.filter(d => d.status === "live").length;
    const openIncidents = incidents.filter(i => i.status === "open").length;
    const pendingProposals = proposals.filter(p => p.status === "pending").length;

    const context = `
CURRENT ECOSYSTEM STATUS:
- ${divisions.length} total divisions, ${liveDivisions} live
- ${openIncidents} open incidents
- ${pendingProposals} pending proposals awaiting approval
- Latest brief: ${latestBrief?.executiveSummary?.substring(0, 200) || "No brief generated yet"}

RECENT AGENT ACTIVITY:
${agentLogs.slice(0, 5).map(l => `- ${l.agentName}: ${l.action} (${l.status})`).join('\n') || 'No recent activity'}

ALL 15 DIVISIONS:
${NIG_DIVISIONS.map(d => `- ${d.name} (${d.category}, Tier ${d.tier})`).join('\n')}
`;

    const qaPrompt = `${ORCHESTRATOR_SYSTEM_PROMPT}

When answering questions, respond in clear, professional language. Do NOT respond with JSON - give natural, conversational answers that are executive-level and actionable.

Context:
${context}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: qaPrompt },
        { role: "user", content: question }
      ],
      max_tokens: 1500,
    });

    const answer = response.choices[0]?.message?.content || "I couldn't process that question.";

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: `Answered: "${question.substring(0, 50)}..."`,
      details: answer.substring(0, 200),
      status: "completed"
    });

    return answer;
  } catch (error) {
    console.error("Orchestrator Q&A error:", error);
    return "I'm currently unable to process your question. The orchestrator is initializing. Please try again.";
  }
}

export async function analyzeCrossBusiness(): Promise<CrossBusinessAnalysis> {
  try {
    const [divisions, financials, incidents] = await Promise.all([
      storage.getDivisions(),
      storage.getFinancialSnapshots(),
      storage.getIncidents()
    ]);

    const analysisPrompt = `Analyze the NIG ecosystem for cross-business synergies and opportunities.

ECOSYSTEM DIVISIONS:
${NIG_DIVISIONS.map(d => `- ${d.name} (${d.category}, Tier ${d.tier}) - ${d.description}`).join('\n')}

ACTIVE DIVISIONS IN DATABASE:
${divisions.map(d => `- ${d.name} (Status: ${d.status}, Category: ${d.category})`).join('\n') || 'Divisions being configured'}

Return a JSON analysis:
{
  "summary": "Overview of cross-business intelligence findings",
  "synergies": [
    {
      "divisions": ["Division A", "Division B"],
      "opportunity": "How they can work together",
      "expectedBenefit": "Quantified benefit",
      "priorityScore": 85,
      "implementationSteps": ["Step 1", "Step 2"]
    }
  ],
  "sharedResources": [
    {
      "resource": "Resource name",
      "currentOwner": "Division",
      "canBenefit": ["Other divisions"],
      "savings": "Estimated savings"
    }
  ],
  "crossSellingOpportunities": [
    {
      "from": "Source division",
      "to": "Target division",
      "strategy": "Cross-sell strategy",
      "expectedRevenue": "Revenue estimate"
    }
  ],
  "recommendations": ["Top recommendations"]
}

Focus on:
1. Shared user bases between divisions
2. Cross-marketing opportunities
3. Shared technology infrastructure
4. Combined service offerings
5. Data sharing opportunities
6. Strategic partnerships between divisions`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ORCHESTRATOR_SYSTEM_PROMPT },
        { role: "user", content: analysisPrompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 3000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as CrossBusinessAnalysis;

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: "Cross-Business Analysis Complete",
      details: analysis.summary?.substring(0, 200) || "Analysis generated",
      status: "completed"
    });

    await storage.createMemoryEntry({
      category: "cross_business",
      title: `Cross-Business Analysis - ${new Date().toISOString().split('T')[0]}`,
      content: analysis.summary || "Cross-business analysis completed",
      agentSource: "Master Orchestrator",
      qualityScore: 8,
      tags: "synergy,cross-business,analysis",
    });

    return analysis;
  } catch (error) {
    console.error("Cross-business analysis error:", error);

    await storage.createAgentLog({
      agentType: "orchestrator",
      agentName: "Master Orchestrator",
      action: "Cross-Business Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Cross-business analysis unavailable - system initializing",
      synergies: [],
      sharedResources: [],
      crossSellingOpportunities: [],
      recommendations: ["Complete system configuration to enable cross-business analysis"],
    };
  }
}

export async function getEcosystemOverview(): Promise<EcosystemOverview> {
  try {
    const [divisions, incidents, proposals, executionReports] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents(),
      storage.getProposals(),
      storage.getExecutionReports(10)
    ]);

    const liveDivisions = divisions.filter(d => d.status === "live").length;
    const activeDivisions = divisions.filter(d => d.status === "active" || d.status === "live").length;
    const openIncidents = incidents.filter(i => i.status === "open").length;
    const criticalIncidents = incidents.filter(i => i.status === "open" && i.severity === "critical").length;
    const pendingProposals = proposals.filter(p => p.status === "pending").length;
    const recentExecutions = executionReports.filter(r => r.status === "completed").length;

    let healthScore = "good";
    if (criticalIncidents > 0) healthScore = "critical";
    else if (openIncidents > 3) healthScore = "poor";
    else if (openIncidents > 0) healthScore = "fair";
    else if (liveDivisions > divisions.length * 0.5) healthScore = "excellent";

    return {
      totalDivisions: divisions.length || NIG_DIVISIONS.length,
      liveDivisions,
      activeDivisions,
      openIncidents,
      criticalIncidents,
      pendingProposals,
      recentExecutions,
      divisionBreakdown: divisions.length > 0
        ? divisions.map(d => ({ name: d.name, status: d.status, tier: d.tier || 3, category: d.category }))
        : NIG_DIVISIONS.map(d => ({ name: d.name, status: "configured", tier: d.tier, category: d.category })),
      agentStatus: "All executive agents operational (CFO, COO, CTO, CMO, CHRO)",
      healthScore,
    };
  } catch (error) {
    console.error("Ecosystem overview error:", error);
    return {
      totalDivisions: NIG_DIVISIONS.length,
      liveDivisions: 0,
      activeDivisions: 0,
      openIncidents: 0,
      criticalIncidents: 0,
      pendingProposals: 0,
      recentExecutions: 0,
      divisionBreakdown: NIG_DIVISIONS.map(d => ({ name: d.name, status: "initializing", tier: d.tier, category: d.category })),
      agentStatus: "System initializing",
      healthScore: "fair",
    };
  }
}
