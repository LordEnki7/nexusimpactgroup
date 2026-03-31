import { openai } from "./openaiClient";
import { storage } from "../storage";

const DIVISIONS = [
  "C.A.R.E.N.", "Real Pulse Verifier", "My Life Assistant", "The Remedy Club",
  "NIG Core", "Rent-A-Buddy", "Eternal Chase", "Project DNA Music",
  "Zapp Marketing and Manufacturing", "Studio Artist Live", "Right Time Notary",
  "The Shock Factor", "ClearSpace", "CAD and Me", "Global Trade Facilitators",
];

export async function generateOutreachDraft(contactId: number, dealId: number): Promise<string> {
  const contact = await storage.getCrmContact(contactId);
  const deal = await storage.getCrmDeal(dealId);
  const activities = await storage.getCrmActivities(contactId);

  if (!contact || !deal) throw new Error("Contact or deal not found");

  const activitySummary = activities.slice(0, 5)
    .map((a) => `${a.type}: ${a.subject}`)
    .join("\n") || "No previous activity";

  const prompt = `You are an expert sales agent for Nexus Impact Group (NIG), a fully integrated ecosystem of 15 business divisions.

Contact: ${contact.firstName} ${contact.lastName}
Company: ${contact.company || "N/A"}
Job Title: ${contact.jobTitle || "N/A"}
Division of Interest: ${deal.division}
Current Pipeline Stage: ${deal.stage}
Deal Value: $${deal.value || "0"}

Recent Activity:
${activitySummary}

Write a concise, professional, personalized outreach message (email or message) to move this lead to the next stage. 
- Be warm and specific to their division
- Mention a concrete benefit of ${deal.division}
- Include a clear call-to-action
- Keep it under 150 words
- Do not use generic filler phrases`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 300,
  });

  return response.choices[0].message.content || "Unable to generate outreach draft.";
}

export async function generateCrossDivisionRecommendations(contactId: number): Promise<string[]> {
  const contact = await storage.getCrmContact(contactId);
  const deals = await storage.getCrmDeals(contactId);

  if (!contact) return [];

  const currentDivisions = deals.map((d) => d.division).join(", ") || "None";
  const tags = contact.tags || "";
  const notes = contact.notes || "";

  const prompt = `You are an AI sales advisor for Nexus Impact Group (NIG).

NIG Divisions: ${DIVISIONS.join(", ")}

Contact Profile:
- Name: ${contact.firstName} ${contact.lastName}
- Company: ${contact.company || "N/A"}
- Job Title: ${contact.jobTitle || "N/A"}
- Tags: ${tags}
- Notes: ${notes}
- Already engaged with: ${currentDivisions}

Based on this profile, which 2-3 OTHER NIG divisions would be the best cross-sell opportunities for this contact?
Return ONLY a JSON array of strings with division names, no explanation. Example: ["The Remedy Club", "My Life Assistant"]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 100,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content || "{}";
    const parsed = JSON.parse(content);
    const arr = Array.isArray(parsed) ? parsed : (parsed.divisions || parsed.recommendations || []);
    return arr.filter((d: string) => DIVISIONS.includes(d) && !currentDivisions.includes(d));
  } catch {
    return [];
  }
}

export async function summarizeContact(contactId: number): Promise<string> {
  const contact = await storage.getCrmContact(contactId);
  const deals = await storage.getCrmDeals(contactId);
  const activities = await storage.getCrmActivities(contactId);

  if (!contact) throw new Error("Contact not found");

  const dealSummary = deals.map((d) => `${d.division} (${d.stage}, $${d.value || 0})`).join(", ") || "No deals";
  const recentActivity = activities.slice(0, 3).map((a) => a.subject).join("; ") || "No activity";

  const prompt = `Summarize this NIG sales contact in 2-3 sentences for a sales rep:

Name: ${contact.firstName} ${contact.lastName}
Company: ${contact.company || "N/A"}
Title: ${contact.jobTitle || "N/A"}
Source: ${contact.source || "manual"}
Deals: ${dealSummary}
Recent: ${recentActivity}
Notes: ${contact.notes || "None"}

Be concise and highlight the most important sales context.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 150,
  });

  return response.choices[0].message.content || "";
}

export async function getCrmPipelineSummary(): Promise<any> {
  const deals = await storage.getCrmDeals();
  const contacts = await storage.getCrmContacts();

  const stages = ["New Lead", "Contacted", "Qualified", "Proposal Sent", "Closed Won", "Closed Lost"];
  const byStage: Record<string, number> = {};
  stages.forEach((s) => (byStage[s] = 0));

  let totalValue = 0;
  let wonValue = 0;
  const byDivision: Record<string, number> = {};

  for (const deal of deals) {
    byStage[deal.stage] = (byStage[deal.stage] || 0) + 1;
    const v = Number(deal.value || 0);
    totalValue += v;
    if (deal.stage === "Closed Won") wonValue += v;
    byDivision[deal.division] = (byDivision[deal.division] || 0) + 1;
  }

  return {
    totalContacts: contacts.length,
    totalDeals: deals.length,
    totalPipelineValue: totalValue,
    closedWonValue: wonValue,
    byStage,
    byDivision,
    topDivisions: Object.entries(byDivision)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([div, count]) => ({ division: div, deals: count })),
  };
}

export { DIVISIONS };
