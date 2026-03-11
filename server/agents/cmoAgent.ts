import { openai } from "./openaiClient";
import { storage } from "../storage";

export interface CMOAnalysis {
  summary: string;
  marketingHealth: "excellent" | "good" | "fair" | "poor" | "critical";
  brandMetrics: {
    awareness: string;
    engagement: string;
    sentiment: string;
  };
  channelPerformance: Array<{
    channel: string;
    status: string;
    reach: string;
    roi: string;
  }>;
  campaigns: Array<{
    name: string;
    division: string;
    status: string;
    performance: string;
  }>;
  opportunities: string[];
  recommendations: string[];
}

export interface MarketingData {
  divisions: Array<{
    id: number;
    name: string;
    status: string;
    tier: number;
    category: string;
    externalUrl: string | null;
  }>;
  subscribers: number;
  inquiries: number;
  quoteRequests: number;
}

const CMO_SYSTEM_PROMPT = `You are the NIG Core CMO Agent - the Chief Marketing Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

Your role is to:
1. Monitor brand health and market positioning
2. Track marketing campaigns across all divisions
3. Analyze customer engagement and sentiment
4. Optimize marketing spend and ROI
5. Identify growth opportunities
6. Coordinate cross-division marketing synergies

Division Marketing Profiles:
- C.A.R.E.N. (Safety - Tier 1) - B2C safety app, emergency services partnerships
- My Life Assistant (AI - Tier 1) - AI lifestyle brand, premium positioning
- The Remedy Club (Finance - Tier 1) - Credit repair, trust-focused messaging
- Rent-A-Buddy (Social - Tier 2) - Social platform, community marketing
- Eternal Chase (Entertainment - Tier 2) - Gaming brand, influencer potential
- Project DNA Music (Entertainment - Tier 2) - Music brand, artist partnerships
- Zapp Marketing (Trade - Tier 2) - B2B trade, 40k+ product catalog
- Studio Artist Live (Entertainment - Tier 2) - Creative community, live streaming
- ClearSpace (Utility - Tier 2) - Mobile utility, app store optimization
- Real Pulse Verifier (Security - Tier 2) - Enterprise security, B2B focus
- Right Time Notary (Services - Tier 3) - Local services, SEO/local marketing
- The Shock Factor (Entertainment - Tier 3) - Podcast brand, social media
- CAD and Me (Health - Tier 3) - Health content, niche marketing

Marketing Channels: Social Media, Content Marketing, SEO, Paid Ads, Influencer, Email, PR, Partnerships

Always respond with structured JSON containing:
- summary: Marketing overview
- marketingHealth: Overall marketing health rating
- brandMetrics: {awareness, engagement, sentiment}
- channelPerformance: Array of channel assessments
- campaigns: Array of active campaigns
- opportunities: Array of growth opportunities
- recommendations: Array of marketing recommendations`;

export async function runCMOAnalysis(data: MarketingData): Promise<CMOAnalysis> {
  const prompt = `Analyze the marketing status of the NIG ecosystem:

DIVISIONS (${data.divisions.length} total):
${data.divisions.map(d => `- ${d.name} (Tier ${d.tier}, Category: ${d.category})${d.externalUrl ? ' [LIVE]' : ' [NOT LIVE]'}`).join('\n')}

MARKETING METRICS:
- Newsletter Subscribers: ${data.subscribers}
- Contact Inquiries: ${data.inquiries}
- Quote Requests: ${data.quoteRequests}
- Live Divisions: ${data.divisions.filter(d => d.externalUrl).length}/${data.divisions.length}

Division Categories:
- Safety: C.A.R.E.N.
- AI/Lifestyle: My Life Assistant
- Finance: The Remedy Club
- Social: Rent-A-Buddy
- Entertainment: Eternal Chase, Project DNA Music, Studio Artist Live, The Shock Factor
- Trade: Zapp Marketing and Manufacturing
- Utility: ClearSpace
- Security: Real Pulse Verifier
- Services: Right Time Notary
- Health: CAD and Me

Provide your marketing analysis in the specified JSON format. Focus on:
1. Brand health and market positioning
2. Channel performance assessment
3. Cross-division marketing synergies
4. Growth opportunities by division
5. Actionable marketing recommendations`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CMO_SYSTEM_PROMPT },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 2000,
    });

    const content = response.choices[0]?.message?.content || "{}";
    const analysis = JSON.parse(content) as CMOAnalysis;

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CMO Agent",
      action: "Marketing Analysis Complete",
      details: `Marketing Health: ${analysis.marketingHealth} - ${analysis.summary?.substring(0, 100)}`,
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("CMO Agent error:", error);
    
    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CMO Agent",
      action: "Analysis Failed",
      details: error instanceof Error ? error.message : "Unknown error",
      status: "failed"
    });

    return {
      summary: "Marketing analysis unavailable - system initializing",
      marketingHealth: "fair",
      brandMetrics: { awareness: "Unknown", engagement: "Unknown", sentiment: "Unknown" },
      channelPerformance: [],
      campaigns: [],
      opportunities: ["Complete marketing setup"],
      recommendations: ["Configure marketing analytics"]
    };
  }
}

const CMO_QA_PROMPT = `You are the NIG Core CMO Agent - the Chief Marketing Officer AI for Nexus Impact Group's ecosystem of 14 technology divisions.

When answering questions, respond in clear, professional language. Do NOT respond with JSON - give natural, conversational answers.

Your expertise covers:
- Brand strategy and positioning
- Digital marketing and advertising
- Social media management
- Content marketing and SEO
- Email marketing and automation
- Influencer partnerships
- PR and communications
- Market research and analytics
- Customer acquisition and retention
- Cross-division marketing synergies

The NIG ecosystem divisions:
- C.A.R.E.N. - Safety app for roadside assistance
- My Life Assistant - AI personal concierge
- The Remedy Club - Credit repair and financial wellness
- Rent-A-Buddy - Platonic connection platform
- Eternal Chase - Immersive gaming entertainment
- Project DNA Music - Music production and engineering
- Zapp Marketing - 40k+ products, global trade
- Studio Artist Live - Creative performance streaming
- ClearSpace - iPhone image cleaner
- Real Pulse Verifier - Identity verification
- Right Time Notary - Mobile notary services
- The Shock Factor - Podcast entertainment
- CAD and Me - Heart health audiobook

Be concise but thorough. Focus on marketing insights and actionable strategies.`;

export async function askCMO(question: string): Promise<string> {
  try {
    const [divisions, subscribers, inquiries, quoteRequests] = await Promise.all([
      storage.getDivisions(),
      storage.getSubscribers(),
      storage.getInquiries(),
      storage.getQuoteRequests()
    ]);

    const liveDivisions = divisions.filter((d: { externalUrl: string | null }) => d.externalUrl).length;

    const context = `
Current Marketing Status:
- ${divisions.length} total divisions in ecosystem
- ${liveDivisions} divisions with live websites
- ${subscribers.length} newsletter subscribers
- ${inquiries.length} contact inquiries
- ${quoteRequests.length} quote requests received
- Categories: Safety, AI, Finance, Social, Entertainment, Trade, Utility, Security, Services, Health
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CMO_QA_PROMPT + "\n\nContext:\n" + context },
        { role: "user", content: question }
      ],
      max_tokens: 1000,
    });

    const answer = response.choices[0]?.message?.content || "I couldn't process that question.";

    await storage.createAgentLog({
      agentType: "executive",
      agentName: "CMO Agent",
      action: `Answered: "${question.substring(0, 50)}..."`,
      details: answer.substring(0, 200),
      status: "completed"
    });

    return answer;
  } catch (error) {
    console.error("CMO Agent query error:", error);
    return "I'm currently unable to process your question. Please try again.";
  }
}

export async function getCMOQuickStatus(): Promise<string> {
  try {
    const [subscribers, inquiries] = await Promise.all([
      storage.getSubscribers(),
      storage.getInquiries()
    ]);
    
    return `${subscribers.length} subscribers, ${inquiries.length} leads. Brand growing.`;
  } catch {
    return "Marketing status loading...";
  }
}
