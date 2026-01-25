import OpenAI from "openai";
import { storage } from "../../storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface DivisionAgentAnalysis {
  agentName: string;
  summary: string;
  health: "excellent" | "good" | "fair" | "poor" | "critical";
  metrics: Record<string, string>;
  tasks: Array<{ task: string; status: string; priority: string }>;
  recommendations: string[];
  alerts: Array<{ severity: string; message: string }>;
}

const DEVOPS_AGENT_PROMPT = `You are the DevOps Division Agent under the CTO of Nexus Impact Group.

Your responsibilities:
- Monitor CI/CD pipelines across all divisions
- Track deployment frequency and success rates
- Manage infrastructure automation
- Ensure high availability and uptime
- Optimize build and deploy times

Divisions: All 14 NIG divisions
Platforms: Replit, Cloud infrastructure, Docker, GitHub Actions

Respond with JSON containing:
- agentName: "DevOps Agent"
- summary: Current DevOps status
- health: Rating
- metrics: {deployments, uptime, buildTime, pipelineHealth}
- tasks: Array of current tasks
- recommendations: Array of actionable items
- alerts: Array of urgent issues`;

const SECURITY_AGENT_PROMPT = `You are the Security Division Agent under the CTO of Nexus Impact Group.

Your responsibilities:
- Monitor security vulnerabilities
- Track dependency updates
- Audit access controls
- Monitor for threats
- Ensure compliance (SOC2, GDPR, PCI-DSS)

High-security divisions:
- C.A.R.E.N. (emergency data)
- The Remedy Club (financial data)
- Real Pulse Verifier (biometric data)
- My Life Assistant (personal data)

Respond with JSON containing:
- agentName: "Security Agent"
- summary: Current security status
- health: Rating
- metrics: {vulnerabilities, auditScore, complianceStatus, threatLevel}
- tasks: Array of current tasks
- recommendations: Array of actionable items
- alerts: Array of urgent issues`;

const ARCHITECTURE_AGENT_PROMPT = `You are the Architecture Division Agent under the CTO of Nexus Impact Group.

Your responsibilities:
- Maintain system architecture documentation
- Review technical decisions
- Ensure scalability patterns
- Monitor technical debt
- Plan technology roadmap

Tech stack: React, Node.js, PostgreSQL, Express, Drizzle ORM
Infrastructure: Replit deployments, cloud services

Respond with JSON containing:
- agentName: "Architecture Agent"
- summary: Current architecture status
- health: Rating
- metrics: {techDebtScore, scalability, codeQuality, documentation}
- tasks: Array of current tasks
- recommendations: Array of actionable items
- alerts: Array of urgent issues`;

export async function runDevOpsAnalysis(): Promise<DivisionAgentAnalysis> {
  try {
    const divisions = await storage.getDivisions();
    const liveDivisions = divisions.filter(d => d.externalUrl).length;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: DEVOPS_AGENT_PROMPT },
        { role: "user", content: `Analyze DevOps status. ${divisions.length} total divisions, ${liveDivisions} deployed.` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as DivisionAgentAnalysis;
    
    await storage.createAgentLog({
      agentType: "division",
      agentName: "DevOps Agent",
      action: "Analysis Complete",
      details: analysis.summary?.substring(0, 150) || "Analysis completed",
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("DevOps Agent error:", error);
    return {
      agentName: "DevOps Agent",
      summary: "Analysis unavailable",
      health: "fair",
      metrics: {},
      tasks: [],
      recommendations: [],
      alerts: []
    };
  }
}

export async function runSecurityAnalysis(): Promise<DivisionAgentAnalysis> {
  try {
    const [divisions, incidents] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents()
    ]);
    
    const securityIncidents = incidents.filter(i => 
      i.title.toLowerCase().includes('security') || 
      i.severity === 'critical'
    );
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SECURITY_AGENT_PROMPT },
        { role: "user", content: `Analyze security status. ${divisions.length} divisions. ${securityIncidents.length} security-related incidents.` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as DivisionAgentAnalysis;
    
    await storage.createAgentLog({
      agentType: "division",
      agentName: "Security Agent",
      action: "Analysis Complete",
      details: analysis.summary?.substring(0, 150) || "Analysis completed",
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("Security Agent error:", error);
    return {
      agentName: "Security Agent",
      summary: "Analysis unavailable",
      health: "fair",
      metrics: {},
      tasks: [],
      recommendations: [],
      alerts: []
    };
  }
}

export async function runArchitectureAnalysis(): Promise<DivisionAgentAnalysis> {
  try {
    const divisions = await storage.getDivisions();
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: ARCHITECTURE_AGENT_PROMPT },
        { role: "user", content: `Analyze architecture status. ${divisions.length} divisions in ecosystem.` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as DivisionAgentAnalysis;
    
    await storage.createAgentLog({
      agentType: "division",
      agentName: "Architecture Agent",
      action: "Analysis Complete",
      details: analysis.summary?.substring(0, 150) || "Analysis completed",
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("Architecture Agent error:", error);
    return {
      agentName: "Architecture Agent",
      summary: "Analysis unavailable",
      health: "fair",
      metrics: {},
      tasks: [],
      recommendations: [],
      alerts: []
    };
  }
}

export async function runAllCTODivisionAgents(): Promise<DivisionAgentAnalysis[]> {
  const [devops, security, architecture] = await Promise.all([
    runDevOpsAnalysis(),
    runSecurityAnalysis(),
    runArchitectureAnalysis()
  ]);
  return [devops, security, architecture];
}
