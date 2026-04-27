import { openai } from "../openaiClient";
import { storage } from "../../storage";

export interface DivisionAgentAnalysis {
  agentName: string;
  summary: string;
  health: "excellent" | "good" | "fair" | "poor" | "critical";
  metrics: Record<string, string>;
  tasks: Array<{ task: string; status: string; priority: string }>;
  recommendations: string[];
  alerts: Array<{ severity: string; message: string }>;
}

const SOCIAL_MEDIA_PROMPT = `You are the Social Media Division Agent under the CMO of Nexus Impact Group.

Your responsibilities:
- Monitor social media presence across all 14 divisions
- Track engagement, followers, and reach
- Identify viral opportunities
- Manage social media calendar
- Coordinate influencer partnerships

Divisions to track: C.A.R.E.N., My Life Assistant, The Remedy Club, Rent-A-Buddy, Eternal Chase, Project DNA Music, Zapp Marketing, Studio Artist Live, ClearSpace, Real Pulse Verifier, Right Time Notary, The Shock Factor, CAD and Me

Platforms: Instagram, TikTok, X/Twitter, LinkedIn, Facebook, YouTube

Respond with JSON containing:
- agentName: "Social Media Agent"
- summary: Current social media status
- health: Rating
- metrics: {followers, engagement, reach, contentRate}
- tasks: Array of current tasks
- recommendations: Array of actionable items
- alerts: Array of urgent issues`;

const SEO_AGENT_PROMPT = `You are the SEO Division Agent under the CMO of Nexus Impact Group.

Your responsibilities:
- Monitor search rankings for all 14 divisions
- Track organic traffic and keyword performance
- Identify link building opportunities
- Optimize on-page SEO
- Technical SEO audits

Divisions with live sites to track:
- carenalert.com
- mylifeassistant.vip
- theremedyclub.vip
- rent-a-buddy.info
- eternalchase.stream
- projectdnamusic.info
- zapp-ecommerce.online
- studioartistlive.com
- clearspace.photos
- realpulseverifier.com
- globaltradefacilitators.us.com
- yapide.app

Respond with JSON containing:
- agentName: "SEO Agent"
- summary: Current SEO status
- health: Rating
- metrics: {organicTraffic, domainAuthority, backlinks, keywordRankings}
- tasks: Array of current tasks
- recommendations: Array of actionable items
- alerts: Array of urgent issues`;

const CONTENT_AGENT_PROMPT = `You are the Content Marketing Division Agent under the CMO of Nexus Impact Group.

Your responsibilities:
- Plan and track content across all divisions
- Monitor blog posts and articles
- Coordinate video content production
- Manage email marketing content
- Develop content strategy

Content types: Blog posts, videos, podcasts, email newsletters, case studies, whitepapers

Divisions: All 14 NIG divisions

Respond with JSON containing:
- agentName: "Content Agent"
- summary: Current content status
- health: Rating
- metrics: {articlesPublished, videoContent, emailCampaigns, engagement}
- tasks: Array of current tasks
- recommendations: Array of actionable items
- alerts: Array of urgent issues`;

export async function runSocialMediaAnalysis(): Promise<DivisionAgentAnalysis> {
  try {
    const divisions = await storage.getDivisions();
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SOCIAL_MEDIA_PROMPT },
        { role: "user", content: `Analyze social media status for ${divisions.length} divisions. ${divisions.filter(d => d.externalUrl).length} have live websites.` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as DivisionAgentAnalysis;
    
    await storage.createAgentLog({
      agentType: "division",
      agentName: "Social Media Agent",
      action: "Analysis Complete",
      details: analysis.summary?.substring(0, 150) || "Analysis completed",
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("Social Media Agent error:", error);
    return {
      agentName: "Social Media Agent",
      summary: "Analysis unavailable",
      health: "fair",
      metrics: {},
      tasks: [],
      recommendations: [],
      alerts: []
    };
  }
}

export async function runSEOAnalysis(): Promise<DivisionAgentAnalysis> {
  try {
    const divisions = await storage.getDivisions();
    const liveSites = divisions.filter(d => d.externalUrl).map(d => d.externalUrl);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SEO_AGENT_PROMPT },
        { role: "user", content: `Analyze SEO status for ${liveSites.length} live websites: ${liveSites.join(', ')}` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as DivisionAgentAnalysis;
    
    await storage.createAgentLog({
      agentType: "division",
      agentName: "SEO Agent",
      action: "Analysis Complete",
      details: analysis.summary?.substring(0, 150) || "Analysis completed",
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("SEO Agent error:", error);
    return {
      agentName: "SEO Agent",
      summary: "Analysis unavailable",
      health: "fair",
      metrics: {},
      tasks: [],
      recommendations: [],
      alerts: []
    };
  }
}

export async function runContentAnalysis(): Promise<DivisionAgentAnalysis> {
  try {
    const [divisions, blogPosts] = await Promise.all([
      storage.getDivisions(),
      storage.getBlogPosts()
    ]);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: CONTENT_AGENT_PROMPT },
        { role: "user", content: `Analyze content status. ${divisions.length} divisions. ${blogPosts.length} blog posts published.` }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const analysis = JSON.parse(response.choices[0]?.message?.content || "{}") as DivisionAgentAnalysis;
    
    await storage.createAgentLog({
      agentType: "division",
      agentName: "Content Agent",
      action: "Analysis Complete",
      details: analysis.summary?.substring(0, 150) || "Analysis completed",
      status: "completed"
    });

    return analysis;
  } catch (error) {
    console.error("Content Agent error:", error);
    return {
      agentName: "Content Agent",
      summary: "Analysis unavailable",
      health: "fair",
      metrics: {},
      tasks: [],
      recommendations: [],
      alerts: []
    };
  }
}

export async function runAllCMODivisionAgents(): Promise<DivisionAgentAnalysis[]> {
  const [socialMedia, seo, content] = await Promise.all([
    runSocialMediaAnalysis(),
    runSEOAnalysis(),
    runContentAnalysis()
  ]);
  return [socialMedia, seo, content];
}
