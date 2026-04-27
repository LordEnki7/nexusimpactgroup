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
