import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  division: text("division").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  active: boolean("active").default(true).notNull(),
});

export const quoteRequests = pgTable("quote_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  projectType: text("project_type").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const callbackRequests = pgTable("callback_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  preferredTime: text("preferred_time"),
  division: text("division"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  subscribedAt: true,
  active: true,
});

export const insertQuoteRequestSchema = createInsertSchema(quoteRequests).omit({
  id: true,
  createdAt: true,
});

export const insertCallbackRequestSchema = createInsertSchema(callbackRequests).omit({
  id: true,
  createdAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = z.infer<typeof insertQuoteRequestSchema>;
export type CallbackRequest = typeof callbackRequests.$inferSelect;
export type InsertCallbackRequest = z.infer<typeof insertCallbackRequestSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

// ============================================
// NIG CORE COMMAND CENTER SCHEMA
// ============================================

export const divisions = pgTable("divisions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("coming_soon"),
  externalUrl: text("external_url"),
  logoUrl: text("logo_url"),
  color: text("color").default("cyan"),
  tier: integer("tier").default(3),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const divisionMetrics = pgTable("division_metrics", {
  id: serial("id").primaryKey(),
  divisionId: integer("division_id").notNull(),
  metricKey: text("metric_key").notNull(),
  metricLabel: text("metric_label").notNull(),
  value: decimal("value", { precision: 15, scale: 2 }).notNull(),
  unit: text("unit"),
  trend: text("trend"),
  period: text("period").default("current"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  divisionId: integer("division_id").notNull(),
  title: text("title").notNull(),
  summary: text("summary"),
  severity: text("severity").notNull().default("low"),
  status: text("status").notNull().default("open"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const financialSnapshots = pgTable("financial_snapshots", {
  id: serial("id").primaryKey(),
  divisionId: integer("division_id"),
  period: text("period").notNull(),
  revenue: decimal("revenue", { precision: 15, scale: 2 }).default("0"),
  costs: decimal("costs", { precision: 15, scale: 2 }).default("0"),
  margin: decimal("margin", { precision: 5, scale: 2 }),
  subscribers: integer("subscribers").default(0),
  activeUsers: integer("active_users").default(0),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

export const agentLogs = pgTable("agent_logs", {
  id: serial("id").primaryKey(),
  agentType: text("agent_type").notNull(),
  agentName: text("agent_name").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orchestratorProposals = pgTable("orchestrator_proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  objective: text("objective").notNull(),
  reason: text("reason").notNull(),
  platformsInvolved: text("platforms_involved"),
  agentsRequired: text("agents_required"),
  resourcesNeeded: text("resources_needed"),
  expectedResult: text("expected_result"),
  estimatedTime: text("estimated_time"),
  priorityScore: integer("priority_score").default(50),
  urgency: text("urgency").default("medium"),
  category: text("category").default("general"),
  status: text("status").notNull().default("pending"),
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const executionReports = pgTable("execution_reports", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id"),
  taskTitle: text("task_title").notNull(),
  agentName: text("agent_name").notNull(),
  objective: text("objective").notNull(),
  status: text("status").notNull().default("in_progress"),
  startTime: timestamp("start_time").defaultNow().notNull(),
  endTime: timestamp("end_time"),
  durationMinutes: integer("duration_minutes"),
  actionLog: text("action_log"),
  toolsUsed: text("tools_used"),
  outputsCreated: text("outputs_created"),
  qualityScore: integer("quality_score"),
  qualityReview: text("quality_review"),
  resultsReview: text("results_review"),
  lessonsLearned: text("lessons_learned"),
  nextSteps: text("next_steps"),
  businessImpact: text("business_impact"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const agentMemory = pgTable("agent_memory", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  agentSource: text("agent_source").notNull(),
  qualityScore: integer("quality_score"),
  tags: text("tags"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dailyBriefs = pgTable("daily_briefs", {
  id: serial("id").primaryKey(),
  briefDate: text("brief_date").notNull(),
  executiveSummary: text("executive_summary").notNull(),
  priorityActions: text("priority_actions"),
  opportunities: text("opportunities"),
  bottlenecks: text("bottlenecks"),
  quickWins: text("quick_wins"),
  approvalQueue: text("approval_queue"),
  agentDeployments: text("agent_deployments"),
  synergies: text("synergies"),
  successTargets: text("success_targets"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDivisionSchema = createInsertSchema(divisions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDivisionMetricSchema = createInsertSchema(divisionMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
});

export const insertFinancialSnapshotSchema = createInsertSchema(financialSnapshots).omit({
  id: true,
  recordedAt: true,
});

export const insertAgentLogSchema = createInsertSchema(agentLogs).omit({
  id: true,
  createdAt: true,
});

export const insertProposalSchema = createInsertSchema(orchestratorProposals).omit({
  id: true,
  createdAt: true,
  approvedAt: true,
  rejectedAt: true,
});

export const insertExecutionReportSchema = createInsertSchema(executionReports).omit({
  id: true,
  createdAt: true,
});

export const insertAgentMemorySchema = createInsertSchema(agentMemory).omit({
  id: true,
  createdAt: true,
});

export const insertDailyBriefSchema = createInsertSchema(dailyBriefs).omit({
  id: true,
  createdAt: true,
});

export type Division = typeof divisions.$inferSelect;
export type InsertDivision = z.infer<typeof insertDivisionSchema>;
export type DivisionMetric = typeof divisionMetrics.$inferSelect;
export type InsertDivisionMetric = z.infer<typeof insertDivisionMetricSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type FinancialSnapshot = typeof financialSnapshots.$inferSelect;
export type InsertFinancialSnapshot = z.infer<typeof insertFinancialSnapshotSchema>;
export type AgentLog = typeof agentLogs.$inferSelect;
export type InsertAgentLog = z.infer<typeof insertAgentLogSchema>;
export type OrchestratorProposal = typeof orchestratorProposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type ExecutionReport = typeof executionReports.$inferSelect;
export type InsertExecutionReport = z.infer<typeof insertExecutionReportSchema>;
export type AgentMemoryEntry = typeof agentMemory.$inferSelect;
export type InsertAgentMemory = z.infer<typeof insertAgentMemorySchema>;
export type DailyBrief = typeof dailyBriefs.$inferSelect;
export type InsertDailyBrief = z.infer<typeof insertDailyBriefSchema>;

// ============================================
// NIG SALES CRM SCHEMA
// ============================================

export const crmContacts = pgTable("crm_contacts", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  jobTitle: text("job_title"),
  linkedinUrl: text("linkedin_url"),
  source: text("source").default("manual"),
  tags: text("tags"),
  notes: text("notes"),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const crmDeals = pgTable("crm_deals", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  division: text("division").notNull(),
  stage: text("stage").notNull().default("New Lead"),
  value: decimal("value", { precision: 15, scale: 2 }).default("0"),
  probability: integer("probability").default(10),
  notes: text("notes"),
  aiDraftOutreach: text("ai_draft_outreach"),
  closedAt: timestamp("closed_at"),
  expectedCloseDate: text("expected_close_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const crmActivities = pgTable("crm_activities", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  dealId: integer("deal_id"),
  type: text("type").notNull().default("note"),
  subject: text("subject").notNull(),
  body: text("body"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const crmImports = pgTable("crm_imports", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  rowsTotal: integer("rows_total").default(0),
  rowsImported: integer("rows_imported").default(0),
  rowsFailed: integer("rows_failed").default(0),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCrmContactSchema = createInsertSchema(crmContacts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCrmDealSchema = createInsertSchema(crmDeals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCrmActivitySchema = createInsertSchema(crmActivities).omit({
  id: true,
  createdAt: true,
});

export type CrmContact = typeof crmContacts.$inferSelect;
export type InsertCrmContact = z.infer<typeof insertCrmContactSchema>;
export type CrmDeal = typeof crmDeals.$inferSelect;
export type InsertCrmDeal = z.infer<typeof insertCrmDealSchema>;
export type CrmActivity = typeof crmActivities.$inferSelect;
export type InsertCrmActivity = z.infer<typeof insertCrmActivitySchema>;
export type CrmImport = typeof crmImports.$inferSelect;

// ============================================
// NIG SECURITY INTEGRITY AGENT SCHEMA
// ============================================

export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  appName: text("app_name").notNull().default("NIG Platform"),
  eventType: text("event_type").notNull(), // failed_login, permission_change, api_abuse, etc.
  severity: text("severity").notNull().default("INFO"), // INFO, LOW, MEDIUM, HIGH, CRITICAL
  source: text("source"), // ip, userId, route, etc.
  details: text("details").notNull(),
  metadata: text("metadata"), // JSON string of extra context
  reviewed: boolean("reviewed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const securityFindings = pgTable("security_findings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  affectedApp: text("affected_app").notNull().default("NIG Platform"),
  riskLevel: text("risk_level").notNull(), // INFO, LOW, MEDIUM, HIGH, CRITICAL
  category: text("category").notNull(),
  confidence: integer("confidence").default(75), // 0-100
  summary: text("summary").notNull(),
  signals: text("signals"), // JSON array of signals observed
  impact: text("impact"),
  recommendation: text("recommendation"),
  escalationRequired: boolean("escalation_required").default(false),
  ownerReviewNeeded: boolean("owner_review_needed").default(false),
  status: text("status").default("open"), // open, reviewed, resolved, false_positive
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const securityIncidents = pgTable("security_incidents", {
  id: serial("id").primaryKey(),
  findingId: integer("finding_id"),
  title: text("title").notNull(),
  affectedApp: text("affected_app").notNull(),
  riskLevel: text("risk_level").notNull(),
  status: text("status").default("open"), // open, investigating, contained, resolved
  summary: text("summary").notNull(),
  actionsTaken: text("actions_taken"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).omit({ id: true, createdAt: true });
export const insertSecurityFindingSchema = createInsertSchema(securityFindings).omit({ id: true, createdAt: true, resolvedAt: true });
export const insertSecurityIncidentSchema = createInsertSchema(securityIncidents).omit({ id: true, createdAt: true, resolvedAt: true });

export type SecurityEvent = typeof securityEvents.$inferSelect;
export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type SecurityFinding = typeof securityFindings.$inferSelect;
export type InsertSecurityFinding = z.infer<typeof insertSecurityFindingSchema>;
export type SecurityIncident = typeof securityIncidents.$inferSelect;
export type InsertSecurityIncident = z.infer<typeof insertSecurityIncidentSchema>;

// Auth schema (mandatory for Replit Auth)
export * from "./models/auth";

// Chat schema (for OpenAI integration)
export * from "./models/chat";
