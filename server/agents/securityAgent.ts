import { openai } from "./openaiClient";
import { storage } from "../storage";
import type { InsertSecurityFinding, InsertSecurityEvent } from "@shared/schema";

const NIG_APPS = [
  "C.A.R.E.N. (carenalert.com)",
  "Real Pulse Verifier (realpulseverifier.com)",
  "My Life Assistant (mylifeassistant.vip)",
  "The Remedy Club (theremedyclub.vip)",
  "Rent-A-Buddy (rent-a-buddy.info)",
  "Eternal Chase (eternalchase.stream)",
  "Project DNA Music (projectdnamusic.info)",
  "Zapp Marketing and Manufacturing (zapp-ecommerce.online)",
  "Studio Artist Live (studioartistlive.com)",
  "ClearSpace (clearspace.photos)",
  "Global Trade Facilitators (globaltradefacilitators.us.com)",
  "NIG Core Command Center",
];

const SECURITY_AGENT_PROMPT = `You are the NIG Security Integrity Agent — a defensive monitoring AI protecting 12 NIG apps. Detect threats, anomalies, and integrity issues. Never recommend offensive actions or unauthorized access.

Risk levels: INFO | LOW | MEDIUM | HIGH | CRITICAL

Categories: failed_login, privilege_escalation, api_abuse, account_spike, bot_activity, payment_manipulation, config_change, audit_tampering, cross_app_anomaly, token_misuse, integrity_failure

Return valid JSON with a "findings" array. Each finding: { scanTitle, affectedApp, riskLevel, category, confidence (0-100), summary, signals (array), impact, recommendation, escalationRequired (bool), ownerReviewNeeded (bool), qualityScore (1-10) }. Return {"findings":[]} if clean.`;

export interface SecurityScanResult {
  findings: any[];
  scanDuration: number;
  highestSeverity: string;
  status: "clear" | "monitoring" | "escalated" | "action_required";
  qualityScore: number;
}

function getSeverityWeight(level: string): number {
  const weights: Record<string, number> = { INFO: 1, LOW: 2, MEDIUM: 3, HIGH: 4, CRITICAL: 5 };
  return weights[level] || 0;
}

function getHighestSeverity(findings: any[]): string {
  if (!findings.length) return "INFO";
  return findings.reduce((max, f) =>
    getSeverityWeight(f.riskLevel) > getSeverityWeight(max) ? f.riskLevel : max, "INFO"
  );
}

function getStatus(highest: string): SecurityScanResult["status"] {
  if (highest === "CRITICAL" || highest === "HIGH") return "escalated";
  if (highest === "MEDIUM") return "action_required";
  if (highest === "LOW") return "monitoring";
  return "clear";
}

export async function runSecurityScan(context?: string): Promise<SecurityScanResult> {
  const start = Date.now();

  // Pull recent agent logs, incidents, and division uptime context — keep it lean
  const recentLogs = await storage.getAgentLogs(8);
  const recentIncidents = await storage.getIncidents();
  const recentFindings = await (storage as any).getSecurityFindings?.() ?? [];

  const openIncidents = recentIncidents.filter((i: any) => i.status === "open").length;
  const openFindings = recentFindings.filter((f: any) => f.status === "open").length;

  const contextBlock = `PLATFORM SIGNALS (last 8 agent actions):
${recentLogs.map((l: any) => `[${l.status}] ${l.agentName}: ${l.action}`).join("\n")}

Open Incidents: ${openIncidents} | Open Security Findings: ${openFindings}
${context ? `\nOPERATOR FOCUS: ${context}` : ""}

TASK: Scan all NIG apps for threats or anomalies. Return JSON with a "findings" array (each item: scanTitle, affectedApp, riskLevel, category, confidence, summary, signals, impact, recommendation, escalationRequired, ownerReviewNeeded). Return {"findings":[]} if clean.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SECURITY_AGENT_PROMPT },
      { role: "user", content: contextBlock },
    ],
    response_format: { type: "json_object" },
    max_tokens: 1500,
    temperature: 0.3,
  });

  let findings: any[] = [];
  try {
    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    findings = Array.isArray(parsed) ? parsed : parsed.findings || [];
  } catch {
    findings = [];
  }

  const scanDuration = Date.now() - start;
  const highestSeverity = getHighestSeverity(findings);
  const status = getStatus(highestSeverity);
  const qualityScore = findings.length > 0
    ? Math.round(findings.reduce((sum, f) => sum + (f.qualityScore || 7), 0) / findings.length)
    : 9;

  // Persist findings to DB
  for (const finding of findings) {
    try {
      await (storage as any).createSecurityFinding({
        title: finding.scanTitle || "Security Finding",
        affectedApp: finding.affectedApp || "NIG Platform",
        riskLevel: finding.riskLevel || "INFO",
        category: finding.category || "General",
        confidence: finding.confidence || 75,
        summary: finding.summary || "",
        signals: JSON.stringify(finding.signals || []),
        impact: finding.impact || "",
        recommendation: finding.recommendation || "",
        escalationRequired: finding.escalationRequired || false,
        ownerReviewNeeded: finding.ownerReviewNeeded || false,
        status: "open",
      } as InsertSecurityFinding);
    } catch {}
  }

  // Log scan to agent logs
  await storage.createAgentLog({
    agentType: "security",
    agentName: "NIG Security Integrity Agent",
    action: "Security Integrity Scan",
    details: `Scan complete. ${findings.length} finding(s). Highest: ${highestSeverity}. Status: ${status}. Duration: ${(scanDuration / 1000).toFixed(1)}s`,
    status: status === "clear" ? "completed" : status === "escalated" ? "warning" : "completed",
  });

  // Store memory if high/critical
  const escalated = findings.filter((f) => getSeverityWeight(f.riskLevel) >= 4);
  if (escalated.length > 0) {
    await storage.createMemoryEntry({
      category: "security_pattern",
      title: `Security Escalation — ${new Date().toLocaleDateString()}`,
      content: JSON.stringify(escalated.map((f) => ({ title: f.scanTitle, risk: f.riskLevel, category: f.category }))),
      agentSource: "NIG Security Integrity Agent",
      qualityScore: 9,
      tags: "security,escalation,critical",
    });
  }

  return { findings, scanDuration, highestSeverity, status, qualityScore };
}

export async function logSecurityEvent(event: InsertSecurityEvent): Promise<void> {
  await (storage as any).createSecurityEvent(event);

  // Auto-escalate CRITICAL events immediately
  if (event.severity === "CRITICAL" || event.severity === "HIGH") {
    await storage.createAgentLog({
      agentType: "security",
      agentName: "NIG Security Integrity Agent",
      action: "Security Alert",
      details: `${event.severity} event: ${event.eventType} — ${event.details}`,
      status: "warning",
    });
  }
}

export async function askSecurityAgent(question: string): Promise<string> {
  const recentFindings = await (storage as any).getSecurityFindings?.() ?? [];
  const openFindings = recentFindings.filter((f: any) => f.status === "open").slice(0, 10);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SECURITY_AGENT_PROMPT },
      {
        role: "user",
        content: `OPEN FINDINGS (${openFindings.length}):\n${openFindings.map((f: any) => `[${f.riskLevel}] ${f.title}: ${f.summary}`).join("\n")}\n\nQUESTION: ${question}\n\nAnswer clearly and actionably. Plain text, no JSON.`,
      },
    ],
    max_tokens: 800,
    temperature: 0.4,
  });

  return response.choices[0].message.content || "Unable to generate security analysis.";
}
