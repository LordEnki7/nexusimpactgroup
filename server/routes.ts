import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertSubscriberSchema, insertQuoteRequestSchema, insertCallbackRequestSchema } from "@shared/schema";
import { z } from "zod";

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

  return httpServer;
}
