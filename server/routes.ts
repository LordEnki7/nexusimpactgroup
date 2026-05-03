import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { 
  insertInquirySchema, 
  insertSubscriberSchema, 
  insertQuoteRequestSchema, 
  insertCallbackRequestSchema,
  insertDivisionSchema,
  insertIncidentSchema,
  insertAgentLogSchema
} from "@shared/schema";
import { z } from "zod";
import type { RequestHandler } from "express";
import { runCFOAnalysis, askCFO, getCFOQuickStatus } from "./agents/cfoAgent";
import { runCOOAnalysis, askCOO, getCOOQuickStatus } from "./agents/cooAgent";
import { runCTOAnalysis, askCTO, getCTOQuickStatus } from "./agents/ctoAgent";
import { runCMOAnalysis, askCMO, getCMOQuickStatus } from "./agents/cmoAgent";
import { runCHROAnalysis, askCHRO, getCHROQuickStatus } from "./agents/chroAgent";
import { runAllCMODivisionAgents, runSocialMediaAnalysis, runSEOAnalysis, runContentAnalysis } from "./agents/division/cmoDivisionAgents";
import { runAllCTODivisionAgents, runDevOpsAnalysis, runSecurityAnalysis, runArchitectureAnalysis } from "./agents/division/ctoDivisionAgents";
import { generateDailyBrief, createProposal, executeApprovedTask, askOrchestrator, analyzeCrossBusiness, getEcosystemOverview } from "./agents/orchestratorAgent";
import { runOpportunityHunter, runRevenueGenerator, runGrowthEngine, runSystemOptimizer } from "./agents/specialistAgents";
import { scheduler } from "./agents/scheduler";
import { collectDivisionData, pingAllDivisions, checkDivisionHealth } from "./agents/divisionCollector";
import { runSecurityScan, logSecurityEvent, askSecurityAgent } from "./agents/securityAgent";
import { registerCommandCenterAuth, requireCommandCenterAuth } from "./commandCenterAuth";
import { generateOutreachDraft, generateCrossDivisionRecommendations, summarizeContact, getCrmPipelineSummary } from "./agents/crmAgent";
import { insertCrmContactSchema, insertCrmDealSchema, insertCrmActivitySchema } from "@shared/schema";

const isAdmin: RequestHandler = requireCommandCenterAuth;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Auth routes for Command Center access
  registerCommandCenterAuth(app);

  // Health check endpoint for load balancers and reverse proxies
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Submit inquiry about a division
  app.post("/api/inquiries", async (req, res) => {
    try {
      const data = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(data);
      res.json({ success: true, inquiry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to submit inquiry" });
      }
    }
  });

  // Subscribe to newsletter
  app.post("/api/subscribe", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      
      // Check if already subscribed
      const existing = await storage.getSubscriberByEmail(data.email);
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          error: "This email is already subscribed" 
        });
      }

      const subscriber = await storage.createSubscriber(data);
      res.json({ success: true, subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to subscribe" });
      }
    }
  });

  // Get all inquiries (admin endpoint)
  app.get("/api/inquiries", async (req, res) => {
    try {
      const allInquiries = await storage.getInquiries();
      res.json({ success: true, inquiries: allInquiries });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch inquiries" });
    }
  });

  // Submit quote request
  app.post("/api/quotes", async (req, res) => {
    try {
      const data = insertQuoteRequestSchema.parse(req.body);
      const quote = await storage.createQuoteRequest(data);
      res.json({ success: true, quote });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to submit quote request" });
      }
    }
  });

  // Submit callback request
  app.post("/api/callbacks", async (req, res) => {
    try {
      const data = insertCallbackRequestSchema.parse(req.body);
      const callback = await storage.createCallbackRequest(data);
      res.json({ success: true, callback });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to submit callback request" });
      }
    }
  });

  // Get blog posts
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json({ success: true, posts });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch blog posts" });
    }
  });

  // Get single blog post by slug
  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      res.json({ success: true, post });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch blog post" });
    }
  });

  // ============================================
  // NIG CORE COMMAND CENTER ENDPOINTS (Protected)
  // ============================================

  // Get dashboard overview (admin only)
  app.get("/api/dashboard", isAdmin, async (req, res) => {
    try {
      const [allDivisions, allMetrics, allIncidents, financials, logs] = await Promise.all([
        storage.getDivisions(),
        storage.getDivisionMetrics(),
        storage.getIncidents(),
        storage.getFinancialSnapshots(),
        storage.getAgentLogs(10)
      ]);

      const liveDivisions = allDivisions.filter(d => d.status === "live").length;
      const openIncidents = allIncidents.filter(i => i.status === "open").length;
      
      res.json({
        success: true,
        data: {
          divisions: allDivisions,
          metrics: allMetrics,
          incidents: allIncidents,
          financials: financials,
          agentLogs: logs,
          summary: {
            totalDivisions: allDivisions.length,
            liveDivisions,
            comingSoonDivisions: allDivisions.length - liveDivisions,
            openIncidents,
            totalIncidents: allIncidents.length
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch dashboard data" });
    }
  });

  // Get all divisions (admin only)
  app.get("/api/divisions", isAdmin, async (req, res) => {
    try {
      const allDivisions = await storage.getDivisions();
      res.json({ success: true, divisions: allDivisions });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch divisions" });
    }
  });

  // Create a division (admin only)
  app.post("/api/divisions", isAdmin, async (req, res) => {
    try {
      const data = insertDivisionSchema.parse(req.body);
      const division = await storage.createDivision(data);
      res.json({ success: true, division });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to create division" });
      }
    }
  });

  // Get incidents (admin only)
  app.get("/api/incidents", isAdmin, async (req, res) => {
    try {
      const divisionId = req.query.divisionId ? parseInt(req.query.divisionId as string) : undefined;
      const allIncidents = await storage.getIncidents(divisionId);
      res.json({ success: true, incidents: allIncidents });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch incidents" });
    }
  });

  // Create incident (admin only)
  app.post("/api/incidents", isAdmin, async (req, res) => {
    try {
      const data = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(data);
      res.json({ success: true, incident });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to create incident" });
      }
    }
  });

  // Get agent logs (admin only)
  app.get("/api/agent-logs", isAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getAgentLogs(limit);
      res.json({ success: true, logs });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch agent logs" });
    }
  });

  // Create agent log (admin only)
  app.post("/api/agent-logs", isAdmin, async (req, res) => {
    try {
      const data = insertAgentLogSchema.parse(req.body);
      const log = await storage.createAgentLog(data);
      res.json({ success: true, log });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ success: false, errors: error.errors });
      } else {
        res.status(500).json({ success: false, error: "Failed to create agent log" });
      }
    }
  });

  // Seed initial divisions (admin only, one-time setup)
  app.post("/api/seed-divisions", isAdmin, async (req, res) => {
    try {
      const initialDivisions = [
        { name: "C.A.R.E.N.", description: "Automated Roadside Guardian", category: "Safety", status: "live", externalUrl: "https://carenalert.com", tier: 1 },
        { name: "Real Pulse Verifier", description: "True Identity Validation", category: "Security", status: "live", externalUrl: "https://realpulseverifier.com", tier: 2 },
        { name: "My Life Assistant", description: "AI Personal Concierge", category: "AI", status: "live", externalUrl: "https://mylifeassistant.vip", tier: 1 },
        { name: "The Remedy Club", description: "Credit & Debt Freedom", category: "Finance", status: "live", externalUrl: "https://theremedyclub.vip", tier: 1 },
        { name: "Rent-A-Buddy", description: "Platonic Connection", category: "Social", status: "live", externalUrl: "https://rent-a-buddy.info", tier: 2 },
        { name: "Eternal Chase", description: "Immersive Entertainment", category: "Entertainment", status: "live", externalUrl: "https://eternalchase.stream", tier: 2 },
        { name: "Project DNA Music", description: "Sonic Engineering", category: "Entertainment", status: "live", externalUrl: "https://projectdnamusic.info", tier: 2 },
        { name: "Zapp Marketing", description: "Global Manufacturing", category: "Trade", status: "live", externalUrl: "https://zapp-ecommerce.online", tier: 2 },
        { name: "Studio Artist Live", description: "Creative Performance Platform", category: "Entertainment", status: "live", externalUrl: "https://studioartistlive.com", tier: 2 },
        { name: "Right Time Notary", description: "Mobile Notary Services", category: "Services", status: "coming_soon", tier: 3 },
        { name: "The Shock Factor", description: "Podcast Entertainment", category: "Entertainment", status: "coming_soon", tier: 3 },
        { name: "ClearSpace", description: "iPhone Image Cleaner", category: "Utility", status: "live", externalUrl: "https://clearspace.photos", tier: 2 },
        { name: "CAD and Me", description: "Coronary Artery Disease Audiobook", category: "Health", status: "coming_soon", tier: 3 },
        { name: "NIG Core", description: "Central Intelligence Hub", category: "Core", status: "active", tier: 0 },
        { name: "YaPide", description: "Fast & Affordable Delivery Platform", category: "Delivery", status: "live", externalUrl: "https://yapide.app", tier: 2 },
      ];

      const created = [];
      for (const div of initialDivisions) {
        try {
          const division = await storage.createDivision(div);
          created.push(division);
        } catch (e) {
          // Skip if already exists
        }
      }
      
      res.json({ success: true, message: `Seeded ${created.length} divisions`, divisions: created });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to seed divisions" });
    }
  });

  // ============================================
  // CFO AGENT ENDPOINTS
  // ============================================

  // Run full CFO analysis
  app.post("/api/cfo/analyze", isAdmin, async (req, res) => {
    try {
      const [divisions, financials, incidents] = await Promise.all([
        storage.getDivisions(),
        storage.getFinancialSnapshots(),
        storage.getIncidents()
      ]);

      const analysis = await runCFOAnalysis({
        divisions: divisions.map(d => ({
          name: d.name,
          status: d.status,
          tier: d.tier || 3,
          category: d.category
        })),
        financials: financials.map(f => ({
          divisionId: f.divisionId,
          period: f.period,
          revenue: f.revenue,
          costs: f.costs,
          margin: f.margin,
          subscribers: f.subscribers,
          activeUsers: f.activeUsers
        })),
        incidents: incidents.map(i => ({
          title: i.title,
          severity: i.severity,
          status: i.status,
          divisionId: i.divisionId
        }))
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("CFO analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run CFO analysis" });
    }
  });

  // Ask CFO a question
  app.post("/api/cfo/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: "Question required" });
      }
      
      const answer = await askCFO(question);
      res.json({ success: true, answer });
    } catch (error) {
      console.error("CFO ask error:", error);
      res.status(500).json({ success: false, error: "Failed to get answer" });
    }
  });

  // Get CFO quick status
  app.get("/api/cfo/status", isAdmin, async (req, res) => {
    try {
      const status = await getCFOQuickStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get status" });
    }
  });

  // ============================================
  // COO AGENT ENDPOINTS
  // ============================================

  // Run full COO operational analysis
  app.post("/api/coo/analyze", isAdmin, async (req, res) => {
    try {
      const [divisions, incidents, agentLogs] = await Promise.all([
        storage.getDivisions(),
        storage.getIncidents(),
        storage.getAgentLogs()
      ]);

      const analysis = await runCOOAnalysis({
        divisions: divisions.map(d => ({
          id: d.id,
          name: d.name,
          status: d.status,
          tier: d.tier || 3,
          category: d.category,
          externalUrl: d.externalUrl
        })),
        incidents: incidents.map(i => ({
          id: i.id,
          title: i.title,
          severity: i.severity,
          status: i.status,
          divisionId: i.divisionId
        })),
        agentLogs: agentLogs.map(l => ({
          agentName: l.agentName,
          action: l.action,
          status: l.status
        }))
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("COO analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run COO analysis" });
    }
  });

  // Ask COO a question
  app.post("/api/coo/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: "Question required" });
      }
      
      const answer = await askCOO(question);
      res.json({ success: true, answer });
    } catch (error) {
      console.error("COO ask error:", error);
      res.status(500).json({ success: false, error: "Failed to get answer" });
    }
  });

  // Get COO quick status
  app.get("/api/coo/status", isAdmin, async (req, res) => {
    try {
      const status = await getCOOQuickStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get status" });
    }
  });

  // ============================================
  // CTO AGENT ENDPOINTS
  // ============================================

  // Run full CTO technical analysis
  app.post("/api/cto/analyze", isAdmin, async (req, res) => {
    try {
      const [divisions, incidents] = await Promise.all([
        storage.getDivisions(),
        storage.getIncidents()
      ]);

      const analysis = await runCTOAnalysis({
        divisions: divisions.map(d => ({
          id: d.id,
          name: d.name,
          status: d.status,
          tier: d.tier || 3,
          category: d.category,
          externalUrl: d.externalUrl
        })),
        incidents: incidents.map(i => ({
          id: i.id,
          title: i.title,
          severity: i.severity,
          status: i.status,
          divisionId: i.divisionId
        }))
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("CTO analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run CTO analysis" });
    }
  });

  // Ask CTO a question
  app.post("/api/cto/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: "Question required" });
      }
      
      const answer = await askCTO(question);
      res.json({ success: true, answer });
    } catch (error) {
      console.error("CTO ask error:", error);
      res.status(500).json({ success: false, error: "Failed to get answer" });
    }
  });

  // Get CTO quick status
  app.get("/api/cto/status", isAdmin, async (req, res) => {
    try {
      const status = await getCTOQuickStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get status" });
    }
  });

  // ============================================
  // CMO AGENT ENDPOINTS
  // ============================================

  // Run full CMO marketing analysis
  app.post("/api/cmo/analyze", isAdmin, async (req, res) => {
    try {
      const [divisions, subscribers, inquiries, quoteRequests] = await Promise.all([
        storage.getDivisions(),
        storage.getSubscribers(),
        storage.getInquiries(),
        storage.getQuoteRequests()
      ]);

      const analysis = await runCMOAnalysis({
        divisions: divisions.map(d => ({
          id: d.id,
          name: d.name,
          status: d.status,
          tier: d.tier || 3,
          category: d.category,
          externalUrl: d.externalUrl
        })),
        subscribers: subscribers.length,
        inquiries: inquiries.length,
        quoteRequests: quoteRequests.length
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("CMO analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run CMO analysis" });
    }
  });

  // Ask CMO a question
  app.post("/api/cmo/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: "Question required" });
      }
      
      const answer = await askCMO(question);
      res.json({ success: true, answer });
    } catch (error) {
      console.error("CMO ask error:", error);
      res.status(500).json({ success: false, error: "Failed to get answer" });
    }
  });

  // Get CMO quick status
  app.get("/api/cmo/status", isAdmin, async (req, res) => {
    try {
      const status = await getCMOQuickStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get status" });
    }
  });

  // ============================================
  // CHRO AGENT ENDPOINTS
  // ============================================

  // Run full CHRO HR analysis
  app.post("/api/chro/analyze", isAdmin, async (req, res) => {
    try {
      const divisions = await storage.getDivisions();

      const analysis = await runCHROAnalysis({
        divisions: divisions.map(d => ({
          id: d.id,
          name: d.name,
          status: d.status,
          tier: d.tier || 3,
          category: d.category
        })),
        totalDivisions: divisions.length,
        activeDivisions: divisions.filter(d => d.status === "live").length
      });

      res.json({ success: true, analysis });
    } catch (error) {
      console.error("CHRO analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run CHRO analysis" });
    }
  });

  // Ask CHRO a question
  app.post("/api/chro/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: "Question required" });
      }
      
      const answer = await askCHRO(question);
      res.json({ success: true, answer });
    } catch (error) {
      console.error("CHRO ask error:", error);
      res.status(500).json({ success: false, error: "Failed to get answer" });
    }
  });

  // Get CHRO quick status
  app.get("/api/chro/status", isAdmin, async (req, res) => {
    try {
      const status = await getCHROQuickStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get status" });
    }
  });

  // ============================================
  // DIVISION AGENT ENDPOINTS
  // ============================================

  // CMO Division Agents
  app.post("/api/division/cmo/all", isAdmin, async (req, res) => {
    try {
      const analyses = await runAllCMODivisionAgents();
      res.json({ success: true, analyses });
    } catch (error) {
      console.error("CMO Division Agents error:", error);
      res.status(500).json({ success: false, error: "Failed to run analyses" });
    }
  });

  app.post("/api/division/cmo/social-media", isAdmin, async (req, res) => {
    try {
      const analysis = await runSocialMediaAnalysis();
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run analysis" });
    }
  });

  app.post("/api/division/cmo/seo", isAdmin, async (req, res) => {
    try {
      const analysis = await runSEOAnalysis();
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run analysis" });
    }
  });

  app.post("/api/division/cmo/content", isAdmin, async (req, res) => {
    try {
      const analysis = await runContentAnalysis();
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run analysis" });
    }
  });

  // CTO Division Agents
  app.post("/api/division/cto/all", isAdmin, async (req, res) => {
    try {
      const analyses = await runAllCTODivisionAgents();
      res.json({ success: true, analyses });
    } catch (error) {
      console.error("CTO Division Agents error:", error);
      res.status(500).json({ success: false, error: "Failed to run analyses" });
    }
  });

  app.post("/api/division/cto/devops", isAdmin, async (req, res) => {
    try {
      const analysis = await runDevOpsAnalysis();
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run analysis" });
    }
  });

  app.post("/api/division/cto/security", isAdmin, async (req, res) => {
    try {
      const analysis = await runSecurityAnalysis();
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run analysis" });
    }
  });

  app.post("/api/division/cto/architecture", isAdmin, async (req, res) => {
    try {
      const analysis = await runArchitectureAnalysis();
      res.json({ success: true, analysis });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run analysis" });
    }
  });

  // ============================================
  // MASTER ORCHESTRATOR ENDPOINTS
  // ============================================

  app.post("/api/orchestrator/daily-brief", isAdmin, async (req, res) => {
    try {
      const brief = await generateDailyBrief();
      res.json({ success: true, brief });
    } catch (error) {
      console.error("Daily brief error:", error);
      res.status(500).json({ success: false, error: "Failed to generate daily brief" });
    }
  });

  app.get("/api/orchestrator/daily-brief/latest", isAdmin, async (req, res) => {
    try {
      const brief = await storage.getLatestBrief();
      res.json({ success: true, brief: brief || null });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch latest brief" });
    }
  });

  app.get("/api/orchestrator/daily-briefs", isAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const briefs = await storage.getDailyBriefs(limit);
      res.json({ success: true, briefs });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch briefs" });
    }
  });

  app.post("/api/orchestrator/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ success: false, error: "Question required" });
      }
      const answer = await askOrchestrator(question);
      res.json({ success: true, answer });
    } catch (error) {
      console.error("Orchestrator ask error:", error);
      res.status(500).json({ success: false, error: "Failed to get answer" });
    }
  });

  app.post("/api/orchestrator/cross-business", isAdmin, async (req, res) => {
    try {
      const analysis = await analyzeCrossBusiness();
      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Cross-business analysis error:", error);
      res.status(500).json({ success: false, error: "Failed to run cross-business analysis" });
    }
  });

  app.get("/api/orchestrator/overview", isAdmin, async (req, res) => {
    try {
      const overview = await getEcosystemOverview();
      res.json({ success: true, overview });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get ecosystem overview" });
    }
  });

  // ============================================
  // PROPOSAL & APPROVAL ENDPOINTS
  // ============================================

  app.post("/api/proposals", isAdmin, async (req, res) => {
    try {
      const { title, objective, reason, platformsInvolved, agentsRequired, resourcesNeeded, expectedResult, estimatedTime, category } = req.body;
      if (!title || !objective || !reason) {
        return res.status(400).json({ success: false, error: "Title, objective, and reason are required" });
      }
      const proposal = await createProposal({
        title, objective, reason, platformsInvolved, agentsRequired, resourcesNeeded, expectedResult, estimatedTime, category
      });
      res.json({ success: true, proposal });
    } catch (error) {
      console.error("Create proposal error:", error);
      res.status(500).json({ success: false, error: "Failed to create proposal" });
    }
  });

  app.get("/api/proposals", isAdmin, async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      const proposals = await storage.getProposals(status);
      res.json({ success: true, proposals });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch proposals" });
    }
  });

  app.get("/api/proposals/:id", isAdmin, async (req, res) => {
    try {
      const proposal = await storage.getProposal(parseInt(req.params.id));
      if (!proposal) {
        return res.status(404).json({ success: false, error: "Proposal not found" });
      }
      res.json({ success: true, proposal });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch proposal" });
    }
  });

  app.put("/api/proposals/:id/approve", isAdmin, async (req, res) => {
    try {
      const proposal = await storage.updateProposalStatus(parseInt(req.params.id), "approved");
      if (!proposal) {
        return res.status(404).json({ success: false, error: "Proposal not found" });
      }
      await storage.createAgentLog({
        agentType: "orchestrator",
        agentName: "Master Orchestrator",
        action: `Proposal Approved: ${proposal.title}`,
        details: `Priority Score: ${proposal.priorityScore}`,
        status: "completed"
      });
      res.json({ success: true, proposal });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to approve proposal" });
    }
  });

  app.put("/api/proposals/:id/reject", isAdmin, async (req, res) => {
    try {
      const { reason } = req.body;
      const proposal = await storage.updateProposalStatus(parseInt(req.params.id), "rejected", reason);
      if (!proposal) {
        return res.status(404).json({ success: false, error: "Proposal not found" });
      }
      res.json({ success: true, proposal });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to reject proposal" });
    }
  });

  app.post("/api/proposals/:id/execute", isAdmin, async (req, res) => {
    try {
      const result = await executeApprovedTask(parseInt(req.params.id));
      res.json({ success: true, result });
    } catch (error) {
      console.error("Execute proposal error:", error);
      res.status(500).json({ success: false, error: "Failed to execute proposal" });
    }
  });

  // ============================================
  // EXECUTION REPORTS & MEMORY ENDPOINTS
  // ============================================

  app.get("/api/execution-reports", isAdmin, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const reports = await storage.getExecutionReports(limit);
      res.json({ success: true, reports });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch execution reports" });
    }
  });

  app.get("/api/memory", isAdmin, async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const entries = await storage.getMemoryEntries(category, limit);
      res.json({ success: true, entries });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch memory entries" });
    }
  });

  app.post("/api/memory", isAdmin, async (req, res) => {
    try {
      const { category, title, content, agentSource, qualityScore, tags } = req.body;
      if (!category || !title || !content || !agentSource) {
        return res.status(400).json({ success: false, error: "Category, title, content, and agentSource are required" });
      }
      const entry = await storage.createMemoryEntry({ category, title, content, agentSource, qualityScore, tags });
      res.json({ success: true, entry });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create memory entry" });
    }
  });

  // ============================================
  // SPECIALIST AGENT ENDPOINTS
  // ============================================

  app.post("/api/specialist/opportunity-hunter", isAdmin, async (req, res) => {
    try {
      const { focusArea } = req.body || {};
      const analysis = await runOpportunityHunter(focusArea);
      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Opportunity Hunter error:", error);
      res.status(500).json({ success: false, error: "Failed to run opportunity scan" });
    }
  });

  app.post("/api/specialist/revenue-generator", isAdmin, async (req, res) => {
    try {
      const { focusArea } = req.body || {};
      const analysis = await runRevenueGenerator(focusArea);
      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Revenue Generator error:", error);
      res.status(500).json({ success: false, error: "Failed to run revenue analysis" });
    }
  });

  app.post("/api/specialist/growth-engine", isAdmin, async (req, res) => {
    try {
      const { focusArea } = req.body || {};
      const analysis = await runGrowthEngine(focusArea);
      res.json({ success: true, analysis });
    } catch (error) {
      console.error("Growth Engine error:", error);
      res.status(500).json({ success: false, error: "Failed to run growth analysis" });
    }
  });

  app.post("/api/specialist/system-optimizer", isAdmin, async (req, res) => {
    try {
      const { focusArea } = req.body || {};
      const analysis = await runSystemOptimizer(focusArea);
      res.json({ success: true, analysis });
    } catch (error) {
      console.error("System Optimizer error:", error);
      res.status(500).json({ success: false, error: "Failed to run optimization scan" });
    }
  });

  // ============================================
  // SCHEDULER & ALERT ENDPOINTS
  // ============================================

  // Get scheduler status
  app.get("/api/scheduler/status", isAdmin, async (req, res) => {
    try {
      const status = scheduler.getStatus();
      res.json({ success: true, status });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get status" });
    }
  });

  // Start scheduler
  app.post("/api/scheduler/start", isAdmin, async (req, res) => {
    try {
      await scheduler.start();
      res.json({ success: true, message: "Scheduler started" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to start scheduler" });
    }
  });

  // Stop scheduler
  app.post("/api/scheduler/stop", isAdmin, async (req, res) => {
    try {
      scheduler.stop();
      res.json({ success: true, message: "Scheduler stopped" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to stop scheduler" });
    }
  });

  // Run a specific task now
  app.post("/api/scheduler/run/:taskId", isAdmin, async (req, res) => {
    try {
      await scheduler.runTaskNow(req.params.taskId);
      res.json({ success: true, message: "Task executed" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to run task" });
    }
  });

  // Get alerts
  app.get("/api/alerts", isAdmin, async (req, res) => {
    try {
      const alerts = scheduler.getAlerts(req.query.includeResolved === "true");
      res.json({ success: true, alerts });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get alerts" });
    }
  });

  // Resolve an alert
  app.post("/api/alerts/:alertId/resolve", isAdmin, async (req, res) => {
    try {
      scheduler.resolveAlert(req.params.alertId);
      res.json({ success: true, message: "Alert resolved" });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to resolve alert" });
    }
  });

  // Manually trigger division data collection
  app.post("/api/divisions/collect", isAdmin, async (req, res) => {
    try {
      const results = await collectDivisionData();
      const succeeded = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success);
      res.json({
        success: true,
        message: `Collected from ${succeeded}/${results.length} division apps`,
        results,
        failedDivisions: failed.map((r) => ({ name: r.divisionName, error: r.error })),
      });
    } catch (error) {
      res.status(500).json({ success: false, error: "Collection failed" });
    }
  });

  // Get latest collection status per division
  app.get("/api/divisions/collection-status", isAdmin, async (req, res) => {
    try {
      const allDivisions = await storage.getDivisions();
      const metrics = await storage.getDivisionMetrics();
      const statusByDivision = allDivisions.map((d) => {
        const divMetrics = metrics.filter((m) => m.divisionId === d.id);
        const lastHealth = divMetrics.find((m) => m.metricKey === "health_score");
        const lastUptime = divMetrics.find((m) => m.metricKey === "uptime");
        const lastUsers = divMetrics.find((m) => m.metricKey === "active_users");
        return {
          id: d.id,
          name: d.name,
          status: d.status,
          lastCollected: lastHealth?.recordedAt || null,
          healthScore: lastHealth ? Number(lastHealth.value) : null,
          uptime: lastUptime ? Number(lastUptime.value) : null,
          activeUsers: lastUsers ? Number(lastUsers.value) : null,
        };
      });
      res.json({ success: true, divisions: statusByDivision });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get collection status" });
    }
  });

  // Live ping check — runs in parallel, no NIG API required
  app.get("/api/divisions/ping", isAdmin, async (req, res) => {
    try {
      const results = await pingAllDivisions();
      // Also update division statuses in DB based on ping results
      const allDivisions = await storage.getDivisions();
      for (const result of results) {
        const division = allDivisions.find((d) =>
          d.name.toLowerCase().includes(result.name.toLowerCase().split(" ")[0])
        );
        if (division && result.status === "live" && division.status === "coming_soon") {
          await storage.updateDivisionStatus(division.id, "live");
        } else if (division && result.status === "offline" && division.status === "live") {
          await storage.updateDivisionStatus(division.id, "degraded");
        }
      }
      const live = results.filter((r) => r.status === "live").length;
      const offline = results.filter((r) => r.status === "offline").length;
      res.json({ success: true, results, summary: { total: results.length, live, offline, degraded: results.length - live - offline } });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ── WEBHOOK RECEIVER ─────────────────────────────────────────────────────────
  // Public endpoint — any NIG app can POST events here using x-nig-key header

  const getWebhookToken = () => process.env.WEBHOOK_SECRET || "nig-webhook-default-change-me";

  app.get("/api/webhook/info", isAdmin, (_req, res) => {
    const token = getWebhookToken();
    const baseUrl = process.env.APP_URL || `https://${process.env.REPL_SLUG || "your-nig-domain"}.replit.app`;
    res.json({
      webhookUrl: `${baseUrl}/api/webhook/event`,
      token,
      tokenEnvVar: "WEBHOOK_SECRET",
      usingDefault: !process.env.WEBHOOK_SECRET,
    });
  });

  app.post("/api/webhook/event", async (req, res) => {
    const token = getWebhookToken();
    const provided = req.headers["x-nig-key"];
    if (!provided || provided !== token) {
      return res.status(401).json({ error: "Unauthorized — missing or invalid x-nig-key header" });
    }

    const { app: appName, eventType, severity = "INFO", details, source, metadata } = req.body || {};
    if (!appName || !eventType || !details) {
      return res.status(400).json({ error: "Required fields: app, eventType, details" });
    }

    const validSeverities = ["INFO", "LOW", "MEDIUM", "HIGH", "CRITICAL"];
    const safeSeverity = validSeverities.includes(severity?.toUpperCase()) ? severity.toUpperCase() : "INFO";

    try {
      const event = await storage.createSecurityEvent({
        appName,
        eventType,
        severity: safeSeverity,
        source: source || appName,
        details,
        metadata: metadata ? JSON.stringify(metadata) : undefined,
        reviewed: false,
      });

      // Auto-log HIGH/CRITICAL to agent logs
      if (safeSeverity === "HIGH" || safeSeverity === "CRITICAL") {
        await storage.createAgentLog({
          agentType: "security",
          agentName: "NIG Security Integrity Agent",
          action: `Webhook Alert — ${safeSeverity}`,
          details: `[${appName}] ${eventType}: ${details}`,
          status: "warning",
        });
      }

      res.json({ success: true, eventId: event.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ── YAPIDE INTEGRATION ───────────────────────────────────────────────────────

  // Auto-insert YaPide into the divisions table if it doesn't exist
  (async () => {
    try {
      const existing = await storage.getDivisions();
      if (!existing.find(d => d.name === "YaPide")) {
        await storage.createDivision({
          name: "YaPide",
          description: "Fast & Affordable Delivery Platform",
          category: "Delivery",
          status: "live",
          externalUrl: "https://yapide.app",
          tier: 2,
        });
        console.log("[YaPide] Division auto-created in database");
      }
    } catch {}
  })();

  app.get("/api/yapide/status", isAdmin, async (_req, res) => {
    const hasToken = !!process.env.YAPIDE_HUB_TOKEN;
    res.json({
      tokenConfigured: hasToken,
      domain: "yapide.app",
      authHeader: "X-Hub-Token",
      envVar: "YAPIDE_HUB_TOKEN",
      csrfEndpoint: "https://yapide.app/api/csrf-token",
    });
  });

  // ── MARKETPLACE ──────────────────────────────────────────────────────────────

  const MARKETPLACE_SEED = [
    {
      title: "My Life Assistant",
      tagline: "Your personal AI assistant for daily life management",
      problem: "People struggle to manage appointments, reminders, tasks, and personal information across multiple apps with no unified intelligence layer.",
      targetCustomer: "Busy professionals, parents, and individuals aged 25–55 who want a single AI-powered hub for their daily life",
      demoUrl: "https://mylifeassistant.vip",
      revenueModel: "Subscription SaaS — $9.99/month basic, $24.99/month premium with AI features. Upsell: family plans, concierge add-ons.",
      techStack: "React, Node.js, PostgreSQL, OpenAI GPT-4o, Twilio",
      category: "AI / Productivity",
      tier: "launch_ready",
      priceMin: 18000, priceMax: 45000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Full source code (frontend + backend)", "Brand assets & logo", "Working demo with live AI integration", "Monetization plan & pricing strategy", "User flow map & onboarding docs", "30-day setup support option"]),
      featured: true, sortOrder: 1,
    },
    {
      title: "The Remedy Club",
      tagline: "Holistic wellness community and telehealth marketplace",
      problem: "People seeking holistic health solutions have no curated marketplace connecting them to verified practitioners, supplements, and wellness plans.",
      targetCustomer: "Health-conscious adults 30–60 seeking alternative medicine, functional health, and community-based wellness support",
      demoUrl: "https://theremedyclub.vip",
      revenueModel: "Marketplace commission 15–20% per booking. Subscription membership $19.99/month. Supplement affiliate revenue.",
      techStack: "React, Express, PostgreSQL, Stripe, Calendly API",
      category: "Health & Wellness",
      tier: "premium",
      priceMin: 35000, priceMax: 80000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Complete marketplace platform (frontend + backend)", "Practitioner onboarding system", "Booking & payment infrastructure", "Brand kit & marketing assets", "Revenue model documentation", "User acquisition playbook"]),
      featured: true, sortOrder: 2,
    },
    {
      title: "Rent-A-Buddy",
      tagline: "On-demand companion and social activity platform",
      problem: "Millions of people experience loneliness and lack social confidence. There is no trusted, safe marketplace for paid companionship and guided social activities.",
      targetCustomer: "Singles, seniors, travelers, and socially anxious individuals who want real human connection — for events, outings, or conversation",
      demoUrl: "https://rent-a-buddy.info",
      revenueModel: "Platform commission 20% per booking. Premium buddy profiles $29.99/month. Background check upsell $9.99.",
      techStack: "React, Node.js, PostgreSQL, Stripe, Google Maps API",
      category: "Social",
      tier: "launch_ready",
      priceMin: 20000, priceMax: 50000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Full two-sided marketplace platform", "Provider & client matching system", "Payment & booking infrastructure", "Safety & verification framework", "Brand assets and go-to-market plan", "Legal template for terms of service"]),
      featured: false, sortOrder: 3,
    },
    {
      title: "Eternal Chase",
      tagline: "Gamified dating and relationship growth platform",
      problem: "Dating apps are swiping machines with no depth. Users want meaningful connections with relationship goals, challenges, and progression built in.",
      targetCustomer: "Singles and couples aged 21–45 who want gamified relationship-building rather than shallow swipe-based matching",
      demoUrl: "https://eternalchase.stream",
      revenueModel: "Freemium subscription $14.99/month premium. In-app coins for boosts. Couples challenge packs $4.99 each.",
      techStack: "React Native, Node.js, PostgreSQL, WebSockets, OpenAI",
      category: "Entertainment / Dating",
      tier: "premium",
      priceMin: 30000, priceMax: 75000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Web and mobile-ready codebase", "Gamification engine (challenges, streaks, rewards)", "Matching algorithm", "Brand assets & onboarding flow", "Monetization plan with in-app purchase structure", "Market size analysis"]),
      featured: false, sortOrder: 4,
    },
    {
      title: "Project DNA Music",
      tagline: "AI-powered music discovery and artist collaboration platform",
      problem: "Independent artists have no centralized platform to collaborate, distribute, and monetize music while fans have no way to discover authentic underground talent.",
      targetCustomer: "Independent musicians, producers, and music fans who want direct artist-to-fan relationships and collaborative creation tools",
      demoUrl: "https://projectdnamusic.info",
      revenueModel: "Artist subscriptions $12.99/month. Fan memberships $7.99/month. Collaboration marketplace 10% commission. NFT music drops.",
      techStack: "React, Node.js, PostgreSQL, Stripe, AWS S3, OpenAI",
      category: "Music / Entertainment",
      tier: "launch_ready",
      priceMin: 18000, priceMax: 42000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Full platform (artist dashboard + fan portal)", "Music upload & streaming infrastructure", "Collaboration request system", "Monetization flows (subscriptions + marketplace)", "Brand identity & marketing assets", "Artist onboarding playbook"]),
      featured: false, sortOrder: 5,
    },
    {
      title: "Zapp Marketing & Manufacturing",
      tagline: "Full-service digital marketing and custom product manufacturing hub",
      problem: "Small businesses need both marketing services and custom branded products but are forced to use 5+ vendors with no integrated workflow.",
      targetCustomer: "Small-to-mid businesses, e-commerce brands, and entrepreneurs who need marketing campaigns and physical branded merchandise in one place",
      demoUrl: "https://zapp-ecommerce.online",
      revenueModel: "Service retainers $1,500–$10,000/month. Product margins 30–50%. White-label reseller licensing $499/month.",
      techStack: "React, Node.js, Stripe, Shopify API, Printful API",
      category: "Marketing / E-Commerce",
      tier: "premium",
      priceMin: 40000, priceMax: 100000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Service booking and client portal", "E-commerce store with product fulfillment integration", "Marketing campaign management tools", "Client reporting dashboard", "Full brand kit", "Vendor relationship documentation"]),
      featured: false, sortOrder: 6,
    },
    {
      title: "Studio Artist Live",
      tagline: "Live streaming and virtual concert platform for independent artists",
      problem: "Independent artists have no dedicated live-stream platform built for music performance, with ticketing, tipping, and fan engagement built in.",
      targetCustomer: "Independent musicians, DJs, and performing artists who want to monetize live streams and build paid fan communities",
      demoUrl: "https://studioartistlive.com",
      revenueModel: "Ticket sales 15% platform fee. Monthly artist subscriptions $19.99. Fan super-chat tipping (30% cut). Virtual merch table.",
      techStack: "React, Node.js, WebRTC, Stripe, AWS Media Services",
      category: "Entertainment / Streaming",
      tier: "launch_ready",
      priceMin: 15000, priceMax: 38000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Live streaming infrastructure with low-latency WebRTC", "Ticketing and payment system", "Artist dashboard & analytics", "Fan engagement tools (chat, tips, reactions)", "Brand assets & promotional templates", "Deployment documentation"]),
      featured: false, sortOrder: 7,
    },
    {
      title: "ClearSpace",
      tagline: "AI-powered photo cleanup and storage management app for iPhone",
      problem: "iPhone users accumulate thousands of duplicate, blurry, and unwanted photos with no intelligent tool to safely clean up their camera roll.",
      targetCustomer: "iPhone users with large photo libraries — especially parents, travelers, and professionals managing large media collections",
      demoUrl: "https://clearspace.photos",
      revenueModel: "One-time purchase $4.99 or subscription $1.99/month. Premium unlimited cleanup $9.99/month. iCloud upsell referral.",
      techStack: "Swift, Core ML, Photos Framework, CloudKit",
      category: "Mobile Utility",
      tier: "starter",
      priceMin: 8000, priceMax: 20000,
      status: "available",
      dealTypes: "license,full_ip",
      whatBuyerGets: JSON.stringify(["iOS app source code", "App Store listing and screenshots", "AI photo classification model", "Brand assets & app icon", "Monetization documentation", "App Store submission guide"]),
      featured: false, sortOrder: 8,
    },
    {
      title: "Real Pulse Verifier",
      tagline: "True identity and credential verification platform",
      problem: "Digital fraud, fake profiles, and unverified credentials cost businesses billions. There is no lightweight, API-first identity verification layer built for SMBs.",
      targetCustomer: "Marketplaces, gig economy platforms, hiring companies, and fintech startups needing fast, affordable identity verification",
      demoUrl: "https://realpulseverifier.com",
      revenueModel: "API pay-per-verification $0.50–$2.00 per check. Monthly SaaS plans $299–$2,499/month. Enterprise contracts.",
      techStack: "Node.js, PostgreSQL, React, Stripe, Twilio, Document AI",
      category: "Security / Identity",
      tier: "premium",
      priceMin: 45000, priceMax: 110000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Full verification platform and API", "Admin dashboard with case management", "Identity document scanning pipeline", "API documentation and SDKs", "Brand assets", "Compliance framework notes", "Enterprise sales playbook"]),
      featured: false, sortOrder: 9,
    },
    {
      title: "Right Time Notary",
      tagline: "On-demand mobile notary booking platform",
      problem: "Finding a notary is a slow, frustrating process. People need verified mobile notaries available on short notice — especially for real estate, legal, and medical documents.",
      targetCustomer: "Real estate agents, law firms, hospitals, and individuals needing fast mobile notary services at their location",
      demoUrl: undefined,
      revenueModel: "Booking commission 20–25%. Notary subscription plans $49.99/month. Urgent booking surcharge $25 platform fee.",
      techStack: "React, Node.js, PostgreSQL, Stripe, Google Maps, Twilio",
      category: "Services",
      tier: "launch_ready",
      priceMin: 12000, priceMax: 30000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Two-sided marketplace (client + notary)", "Booking, scheduling, and routing system", "Payment and invoice infrastructure", "Notary verification flow", "Brand assets and marketing page", "Operational guide"]),
      featured: false, sortOrder: 10,
    },
    {
      title: "The Shock Factor",
      tagline: "Bold entertainment podcast network and fan community",
      problem: "Podcast creators have no dedicated platform to monetize, grow communities, and deliver premium content experiences beyond basic audio distribution.",
      targetCustomer: "Podcast creators with existing audiences and fans of unfiltered, bold entertainment content looking for premium community access",
      demoUrl: undefined,
      revenueModel: "Fan memberships $7.99/month. Exclusive episode paywall. Live show ticket sales. Merch store 40% margin.",
      techStack: "React, Node.js, Stripe, AWS S3, WebSockets",
      category: "Entertainment / Media",
      tier: "starter",
      priceMin: 6000, priceMax: 15000,
      status: "available",
      dealTypes: "license,full_ip",
      whatBuyerGets: JSON.stringify(["Podcast hosting and streaming platform", "Paywall and membership infrastructure", "Community and fan engagement tools", "Brand assets and show templates", "Monetization documentation", "Content strategy guide"]),
      featured: false, sortOrder: 11,
    },
    {
      title: "CAD and Me",
      tagline: "Patient education audiobook platform for coronary artery disease",
      problem: "CAD patients are overwhelmed after diagnosis with medical jargon and no accessible, guided educational resources to understand and manage their condition.",
      targetCustomer: "CAD patients, caregivers, and healthcare providers looking for patient-friendly cardiac education content and tools",
      demoUrl: undefined,
      revenueModel: "One-time audiobook purchase $24.99. Companion app subscription $9.99/month. Hospital licensing B2B contracts.",
      techStack: "React Native, Node.js, Stripe, AWS Polly, PostgreSQL",
      category: "Health / Education",
      tier: "starter",
      priceMin: 7500, priceMax: 18000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Audiobook platform with chapter navigation", "Companion health tracking app", "Content library and audio files", "Brand assets", "Hospital licensing pitch deck", "B2C and B2B revenue model"]),
      featured: false, sortOrder: 12,
    },
    {
      title: "Global Trade Facilitators",
      tagline: "USDA GSM-102 export credit guarantee consulting and deal platform",
      problem: "U.S. agricultural exporters and foreign buyers lack an efficient digital platform to access USDA GSM-102 export credit guarantees — a $5B+ annual program.",
      targetCustomer: "U.S. agricultural exporters, foreign financial institutions, and import companies in emerging markets seeking export credit financing",
      demoUrl: "https://globaltradefacilitators.us.com",
      revenueModel: "Consulting retainer $5,000–$20,000/deal. Deal facilitation commission 0.5–1.5%. SaaS dashboard $999/month.",
      techStack: "React, Node.js, PostgreSQL, Stripe, DocuSign API",
      category: "Finance / Trade",
      tier: "full_business",
      priceMin: 75000, priceMax: 175000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Full deal management platform", "USDA program documentation library", "Client and deal pipeline CRM", "Compliance workflow tools", "Brand assets and pitch materials", "Government program knowledge base", "60-day transition support option"]),
      featured: true, sortOrder: 13,
    },
    {
      title: "YaPide",
      tagline: "Fast and affordable last-mile delivery platform",
      problem: "Small businesses and consumers in underserved markets need affordable, reliable local delivery without the high fees of national platforms.",
      targetCustomer: "Local restaurants, retailers, and consumers in mid-size cities who need fast delivery without paying premium platform rates",
      demoUrl: "https://yapide.app",
      revenueModel: "Per-delivery fee $2.99–$5.99. Business subscription plans $99/month. Driver subscription $9.99/month. Surge pricing.",
      techStack: "React, Node.js, PostgreSQL, Google Maps API, Stripe, WebSockets",
      category: "Delivery / Logistics",
      tier: "premium",
      priceMin: 35000, priceMax: 85000,
      status: "available",
      dealTypes: "license,full_ip,partnership",
      whatBuyerGets: JSON.stringify(["Full delivery marketplace (consumer + driver + merchant)", "Real-time tracking and dispatch system", "Payment and payout infrastructure", "Driver onboarding and rating system", "Brand assets and marketing page", "Market expansion playbook"]),
      featured: false, sortOrder: 14,
    },
  ];

  (async () => {
    try {
      const existing = await storage.getMarketplaceListings();
      if (existing.length === 0) {
        for (const listing of MARKETPLACE_SEED) {
          await storage.createMarketplaceListing(listing as any);
        }
        console.log(`[Marketplace] Seeded ${MARKETPLACE_SEED.length} listings`);
      }
    } catch (err) {
      console.error("[Marketplace] Seed error:", err);
    }
  })();

  app.get("/api/marketplace", async (_req, res) => {
    try {
      const listings = await storage.getMarketplaceListings();
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/marketplace/:id", async (req, res) => {
    try {
      const listing = await storage.getMarketplaceListing(Number(req.params.id));
      if (!listing) return res.status(404).json({ error: "Not found" });
      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/marketplace/inquiry", async (req, res) => {
    try {
      const { listingId, listingTitle, name, email, company, dealType, budget, message } = req.body;
      if (!listingId || !name || !email || !dealType || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const inquiry = await storage.createMarketplaceInquiry({ listingId, listingTitle, name, email, company, dealType, budget, message, status: "new" });
      res.json({ success: true, inquiry });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/marketplace/inquiries", isAdmin, async (_req, res) => {
    try {
      const inquiries = await storage.getMarketplaceInquiries();
      res.json(inquiries);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/marketplace/inquiries/:id", isAdmin, async (req, res) => {
    try {
      await storage.updateMarketplaceInquiry(Number(req.params.id), req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/admin/marketplace/listings", isAdmin, async (_req, res) => {
    try {
      const listings = await storage.getMarketplaceListings();
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/admin/marketplace/listings", isAdmin, async (req, res) => {
    try {
      const listing = await storage.createMarketplaceListing(req.body);
      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/api/admin/marketplace/listings/:id", isAdmin, async (req, res) => {
    try {
      const listing = await storage.updateMarketplaceListing(Number(req.params.id), req.body);
      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ── DIVISION HEALTH CHECK ─────────────────────────────────────────────────────

  app.get("/api/divisions/health", isAdmin, async (_req, res) => {
    try {
      const results = await checkDivisionHealth();
      res.json({ success: true, results, checkedAt: new Date().toISOString() });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ── SECURITY INTEGRITY AGENT ROUTES ─────────────────────────────────────────

  app.post("/api/security/scan", isAdmin, async (req, res) => {
    try {
      const { context } = req.body || {};
      const result = await runSecurityScan(context);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/security/findings", isAdmin, async (req, res) => {
    try {
      const findings = await storage.getSecurityFindings(req.query.status as string);
      res.json({ success: true, findings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.put("/api/security/findings/:id", isAdmin, async (req, res) => {
    try {
      await storage.updateSecurityFinding(Number(req.params.id), req.body);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/security/events", isAdmin, async (req, res) => {
    try {
      const events = await storage.getSecurityEvents(Number(req.query.limit) || 50);
      res.json({ success: true, events });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/security/events", isAdmin, async (req, res) => {
    try {
      const event = await storage.createSecurityEvent(req.body);
      res.json({ success: true, event });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/security/incidents", isAdmin, async (req, res) => {
    try {
      const incidents = await storage.getSecurityIncidents(req.query.status as string);
      res.json({ success: true, incidents });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/security/ask", isAdmin, async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) return res.status(400).json({ success: false, error: "Question required" });
      const answer = await askSecurityAgent(question);
      res.json({ success: true, answer });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ── CRM ROUTES ─────────────────────────────────────────────────────────────

  // Pipeline summary
  app.get("/api/crm/pipeline", isAdmin, async (req, res) => {
    try {
      const summary = await getCrmPipelineSummary();
      res.json({ success: true, summary });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get pipeline summary" });
    }
  });

  // Contacts
  app.get("/api/crm/contacts", isAdmin, async (req, res) => {
    try {
      const contacts = await storage.getCrmContacts(req.query.search as string);
      res.json({ success: true, contacts });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get contacts" });
    }
  });

  app.get("/api/crm/contacts/:id", isAdmin, async (req, res) => {
    try {
      const contact = await storage.getCrmContact(Number(req.params.id));
      if (!contact) return res.status(404).json({ success: false, error: "Not found" });
      const deals = await storage.getCrmDeals(contact.id);
      const activities = await storage.getCrmActivities(contact.id);
      res.json({ success: true, contact, deals, activities });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get contact" });
    }
  });

  app.post("/api/crm/contacts", isAdmin, async (req, res) => {
    try {
      const data = insertCrmContactSchema.parse(req.body);
      const contact = await storage.createCrmContact(data);
      res.json({ success: true, contact });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/crm/contacts/:id", isAdmin, async (req, res) => {
    try {
      const contact = await storage.updateCrmContact(Number(req.params.id), req.body);
      res.json({ success: true, contact });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update contact" });
    }
  });

  app.delete("/api/crm/contacts/:id", isAdmin, async (req, res) => {
    try {
      await storage.deleteCrmContact(Number(req.params.id));
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to delete contact" });
    }
  });

  // CSV import
  app.post("/api/crm/import", isAdmin, async (req, res) => {
    try {
      const { contacts, filename } = req.body;
      if (!Array.isArray(contacts) || contacts.length === 0) {
        return res.status(400).json({ success: false, error: "No contacts provided" });
      }
      const imp = await storage.createCrmImport({ filename: filename || "import.csv", rowsTotal: contacts.length });
      const pick = (row: any, ...keys: string[]) => {
        for (const k of keys) { if (row[k] && String(row[k]).trim()) return String(row[k]).trim(); }
        return "";
      };
      const mapped: any[] = contacts.map((row: any) => ({
        firstName: pick(row, "First Name", "firstName", "first_name", "Given Name"),
        lastName: pick(row, "Last Name", "lastName", "last_name", "Family Name", "Surname"),
        email: pick(row,
          "E-mail Address", "Email Address", "email", "Email",
          "E-mail 2 Address", "E-mail 3 Address"
        ),
        phone: pick(row,
          "Mobile Phone", "Home Phone", "Business Phone",
          "Phone", "phone", "Mobile", "Cell Phone", "Work Phone"
        ),
        company: pick(row, "Company", "company", "Organization", "Employer", "Business"),
        jobTitle: pick(row, "Job Title", "jobTitle", "job_title", "Title", "Position", "Role"),
        linkedinUrl: pick(row, "LinkedIn URL", "linkedinUrl", "LinkedIn", "URL", "Website"),
        source: "csv_import",
        tags: pick(row, "Tags", "tags", "Category", "Group"),
        notes: pick(row, "Notes", "notes", "Description", "Comments"),
      })).filter((c: any) => c.firstName || c.lastName || c.email);

      const result = await storage.bulkCreateCrmContacts(mapped);
      await storage.updateCrmImport(imp.id, { rowsImported: result.imported, rowsFailed: result.failed, status: "completed" });
      res.json({ success: true, imported: result.imported, failed: result.failed, importId: imp.id });
    } catch (error: any) {
      console.error("[CRM Import error]", error);
      res.status(500).json({ success: false, error: error?.message || String(error) || "Internal server error during import" });
    }
  });

  // Deals
  app.get("/api/crm/deals", isAdmin, async (req, res) => {
    try {
      const deals = await storage.getCrmDeals(
        req.query.contactId ? Number(req.query.contactId) : undefined,
        req.query.division as string,
        req.query.stage as string
      );
      res.json({ success: true, deals });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to get deals" });
    }
  });

  app.post("/api/crm/deals", isAdmin, async (req, res) => {
    try {
      const data = insertCrmDealSchema.parse(req.body);
      const deal = await storage.createCrmDeal(data);
      res.json({ success: true, deal });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  app.put("/api/crm/deals/:id", isAdmin, async (req, res) => {
    try {
      const deal = await storage.updateCrmDeal(Number(req.params.id), req.body);
      res.json({ success: true, deal });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update deal" });
    }
  });

  // Activities
  app.post("/api/crm/activities", isAdmin, async (req, res) => {
    try {
      const data = insertCrmActivitySchema.parse(req.body);
      const activity = await storage.createCrmActivity(data);
      res.json({ success: true, activity });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // AI: generate outreach draft
  app.post("/api/crm/outreach/:contactId/:dealId", isAdmin, async (req, res) => {
    try {
      const draft = await generateOutreachDraft(Number(req.params.contactId), Number(req.params.dealId));
      await storage.updateCrmDeal(Number(req.params.dealId), { aiDraftOutreach: draft });
      res.json({ success: true, draft });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI: cross-division recommendations
  app.get("/api/crm/recommendations/:contactId", isAdmin, async (req, res) => {
    try {
      const recommendations = await generateCrossDivisionRecommendations(Number(req.params.contactId));
      res.json({ success: true, recommendations });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // AI: summarize contact
  app.post("/api/crm/summarize/:contactId", isAdmin, async (req, res) => {
    try {
      const summary = await summarizeContact(Number(req.params.contactId));
      await storage.updateCrmContact(Number(req.params.contactId), { aiSummary: summary });
      res.json({ success: true, summary });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Auto-start scheduler
  scheduler.start();

  return httpServer;
}
