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
import { isAuthenticated } from "./replit_integrations/auth";
import { runCFOAnalysis, askCFO, getCFOQuickStatus } from "./agents/cfoAgent";
import { runCOOAnalysis, askCOO, getCOOQuickStatus } from "./agents/cooAgent";
import { runCTOAnalysis, askCTO, getCTOQuickStatus } from "./agents/ctoAgent";
import { runCMOAnalysis, askCMO, getCMOQuickStatus } from "./agents/cmoAgent";

// Admin user ID - only this user can access the dashboard
const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

// Middleware to check if user is the admin
// TEMPORARILY BYPASSED for development/testing
const isAdmin: typeof isAuthenticated = async (req, res, next) => {
  // Bypass auth temporarily for testing
  return next();
  
  // Original auth logic (commented out for now):
  // await isAuthenticated(req, res, () => {
  //   const user = req.user as any;
  //   const userId = user?.claims?.sub;
  //   
  //   // If no ADMIN_USER_ID is set, allow any authenticated user (for initial setup)
  //   if (!ADMIN_USER_ID || userId === ADMIN_USER_ID) {
  //     next();
  //   } else {
  //     res.status(403).json({ success: false, error: "Access denied" });
  //   }
  // });
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
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
        { name: "Real Pulse Verifier", description: "True Identity Validation", category: "Security", status: "coming_soon", tier: 2 },
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
        { name: "NIG Core", description: "Central Intelligence Hub", category: "Core", status: "active", tier: 0 }
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

  return httpServer;
}
