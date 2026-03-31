import { 
  type User, 
  type InsertUser,
  type Inquiry,
  type InsertInquiry,
  type Subscriber,
  type InsertSubscriber,
  type QuoteRequest,
  type InsertQuoteRequest,
  type CallbackRequest,
  type InsertCallbackRequest,
  type BlogPost,
  type InsertBlogPost,
  type Division,
  type InsertDivision,
  type DivisionMetric,
  type InsertDivisionMetric,
  type Incident,
  type InsertIncident,
  type FinancialSnapshot,
  type InsertFinancialSnapshot,
  type AgentLog,
  type InsertAgentLog,
  type OrchestratorProposal,
  type InsertProposal,
  type ExecutionReport,
  type InsertExecutionReport,
  type AgentMemoryEntry,
  type InsertAgentMemory,
  type DailyBrief,
  type InsertDailyBrief,
  type CrmContact,
  type InsertCrmContact,
  type CrmDeal,
  type InsertCrmDeal,
  type CrmActivity,
  type InsertCrmActivity,
  type CrmImport,
  users,
  inquiries,
  subscribers,
  quoteRequests,
  callbackRequests,
  blogPosts,
  divisions,
  divisionMetrics,
  incidents,
  financialSnapshots,
  agentLogs,
  orchestratorProposals,
  executionReports,
  agentMemory,
  dailyBriefs,
  crmContacts,
  crmDeals,
  crmActivities,
  crmImports,
} from "@shared/schema";
import { db } from "../db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  getInquiries(): Promise<Inquiry[]>;
  
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getSubscribers(): Promise<Subscriber[]>;
  
  createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest>;
  getQuoteRequests(): Promise<QuoteRequest[]>;
  
  createCallbackRequest(callback: InsertCallbackRequest): Promise<CallbackRequest>;
  getCallbackRequests(): Promise<CallbackRequest[]>;
  
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;

  getDivisions(): Promise<Division[]>;
  getDivision(id: number): Promise<Division | undefined>;
  createDivision(division: InsertDivision): Promise<Division>;
  updateDivisionStatus(id: number, status: string): Promise<Division | undefined>;
  
  getDivisionMetrics(divisionId?: number): Promise<DivisionMetric[]>;
  createDivisionMetric(metric: InsertDivisionMetric): Promise<DivisionMetric>;
  
  getIncidents(divisionId?: number): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  
  getFinancialSnapshots(divisionId?: number): Promise<FinancialSnapshot[]>;
  createFinancialSnapshot(snapshot: InsertFinancialSnapshot): Promise<FinancialSnapshot>;
  
  getAgentLogs(limit?: number): Promise<AgentLog[]>;
  createAgentLog(log: InsertAgentLog): Promise<AgentLog>;

  createProposal(proposal: InsertProposal): Promise<OrchestratorProposal>;
  getProposals(status?: string): Promise<OrchestratorProposal[]>;
  getProposal(id: number): Promise<OrchestratorProposal | undefined>;
  updateProposalStatus(id: number, status: string, reason?: string): Promise<OrchestratorProposal | undefined>;

  createExecutionReport(report: InsertExecutionReport): Promise<ExecutionReport>;
  getExecutionReports(limit?: number): Promise<ExecutionReport[]>;
  updateExecutionReport(id: number, updates: Partial<ExecutionReport>): Promise<ExecutionReport | undefined>;

  createMemoryEntry(entry: InsertAgentMemory): Promise<AgentMemoryEntry>;
  getMemoryEntries(category?: string, limit?: number): Promise<AgentMemoryEntry[]>;

  createDailyBrief(brief: InsertDailyBrief): Promise<DailyBrief>;
  getLatestBrief(): Promise<DailyBrief | undefined>;
  getDailyBriefs(limit?: number): Promise<DailyBrief[]>;

  // CRM
  getCrmContacts(search?: string, limit?: number): Promise<CrmContact[]>;
  getCrmContact(id: number): Promise<CrmContact | undefined>;
  createCrmContact(contact: InsertCrmContact): Promise<CrmContact>;
  updateCrmContact(id: number, updates: Partial<CrmContact>): Promise<CrmContact | undefined>;
  deleteCrmContact(id: number): Promise<void>;
  bulkCreateCrmContacts(contacts: InsertCrmContact[]): Promise<{ imported: number; failed: number }>;

  getCrmDeals(contactId?: number, division?: string, stage?: string): Promise<CrmDeal[]>;
  getCrmDeal(id: number): Promise<CrmDeal | undefined>;
  createCrmDeal(deal: InsertCrmDeal): Promise<CrmDeal>;
  updateCrmDeal(id: number, updates: Partial<CrmDeal>): Promise<CrmDeal | undefined>;

  getCrmActivities(contactId?: number, dealId?: number): Promise<CrmActivity[]>;
  createCrmActivity(activity: InsertCrmActivity): Promise<CrmActivity>;

  createCrmImport(imp: { filename: string; rowsTotal: number }): Promise<CrmImport>;
  updateCrmImport(id: number, updates: Partial<CrmImport>): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [newInquiry] = await db.insert(inquiries).values(inquiry).returning();
    return newInquiry;
  }

  async getInquiries(): Promise<Inquiry[]> {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const [newSubscriber] = await db.insert(subscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const [subscriber] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    return subscriber;
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt));
  }

  async createQuoteRequest(quote: InsertQuoteRequest): Promise<QuoteRequest> {
    const [newQuote] = await db.insert(quoteRequests).values(quote).returning();
    return newQuote;
  }

  async getQuoteRequests(): Promise<QuoteRequest[]> {
    return await db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
  }

  async createCallbackRequest(callback: InsertCallbackRequest): Promise<CallbackRequest> {
    const [newCallback] = await db.insert(callbackRequests).values(callback).returning();
    return newCallback;
  }

  async getCallbackRequests(): Promise<CallbackRequest[]> {
    return await db.select().from(callbackRequests).orderBy(desc(callbackRequests.createdAt));
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blogPosts).values(post).returning();
    return newPost;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).where(eq(blogPosts.published, true)).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getDivisions(): Promise<Division[]> {
    return await db.select().from(divisions).orderBy(divisions.tier, divisions.name);
  }

  async getDivision(id: number): Promise<Division | undefined> {
    const [division] = await db.select().from(divisions).where(eq(divisions.id, id));
    return division;
  }

  async createDivision(division: InsertDivision): Promise<Division> {
    const [newDivision] = await db.insert(divisions).values(division).returning();
    return newDivision;
  }

  async updateDivisionStatus(id: number, status: string): Promise<Division | undefined> {
    const [updated] = await db
      .update(divisions)
      .set({ status, updatedAt: new Date() })
      .where(eq(divisions.id, id))
      .returning();
    return updated;
  }

  async getDivisionMetrics(divisionId?: number): Promise<DivisionMetric[]> {
    if (divisionId) {
      return await db.select().from(divisionMetrics).where(eq(divisionMetrics.divisionId, divisionId)).orderBy(desc(divisionMetrics.recordedAt));
    }
    return await db.select().from(divisionMetrics).orderBy(desc(divisionMetrics.recordedAt));
  }

  async createDivisionMetric(metric: InsertDivisionMetric): Promise<DivisionMetric> {
    const [newMetric] = await db.insert(divisionMetrics).values(metric).returning();
    return newMetric;
  }

  async getIncidents(divisionId?: number): Promise<Incident[]> {
    if (divisionId) {
      return await db.select().from(incidents).where(eq(incidents.divisionId, divisionId)).orderBy(desc(incidents.createdAt));
    }
    return await db.select().from(incidents).orderBy(desc(incidents.createdAt));
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db.insert(incidents).values(incident).returning();
    return newIncident;
  }

  async getFinancialSnapshots(divisionId?: number): Promise<FinancialSnapshot[]> {
    if (divisionId) {
      return await db.select().from(financialSnapshots).where(eq(financialSnapshots.divisionId, divisionId)).orderBy(desc(financialSnapshots.recordedAt));
    }
    return await db.select().from(financialSnapshots).orderBy(desc(financialSnapshots.recordedAt));
  }

  async createFinancialSnapshot(snapshot: InsertFinancialSnapshot): Promise<FinancialSnapshot> {
    const [newSnapshot] = await db.insert(financialSnapshots).values(snapshot).returning();
    return newSnapshot;
  }

  async getAgentLogs(limit: number = 50): Promise<AgentLog[]> {
    return await db.select().from(agentLogs).orderBy(desc(agentLogs.createdAt)).limit(limit);
  }

  async createAgentLog(log: InsertAgentLog): Promise<AgentLog> {
    const [newLog] = await db.insert(agentLogs).values(log).returning();
    return newLog;
  }

  async createProposal(proposal: InsertProposal): Promise<OrchestratorProposal> {
    const [newProposal] = await db.insert(orchestratorProposals).values(proposal).returning();
    return newProposal;
  }

  async getProposals(status?: string): Promise<OrchestratorProposal[]> {
    if (status) {
      return await db.select().from(orchestratorProposals).where(eq(orchestratorProposals.status, status)).orderBy(desc(orchestratorProposals.createdAt));
    }
    return await db.select().from(orchestratorProposals).orderBy(desc(orchestratorProposals.createdAt));
  }

  async getProposal(id: number): Promise<OrchestratorProposal | undefined> {
    const [proposal] = await db.select().from(orchestratorProposals).where(eq(orchestratorProposals.id, id));
    return proposal;
  }

  async updateProposalStatus(id: number, status: string, reason?: string): Promise<OrchestratorProposal | undefined> {
    const updates: any = { status };
    if (status === "approved") updates.approvedAt = new Date();
    if (status === "rejected") {
      updates.rejectedAt = new Date();
      if (reason) updates.rejectionReason = reason;
    }
    const [updated] = await db.update(orchestratorProposals).set(updates).where(eq(orchestratorProposals.id, id)).returning();
    return updated;
  }

  async createExecutionReport(report: InsertExecutionReport): Promise<ExecutionReport> {
    const [newReport] = await db.insert(executionReports).values(report).returning();
    return newReport;
  }

  async getExecutionReports(limit: number = 50): Promise<ExecutionReport[]> {
    return await db.select().from(executionReports).orderBy(desc(executionReports.createdAt)).limit(limit);
  }

  async updateExecutionReport(id: number, updates: Partial<ExecutionReport>): Promise<ExecutionReport | undefined> {
    const [updated] = await db.update(executionReports).set(updates).where(eq(executionReports.id, id)).returning();
    return updated;
  }

  async createMemoryEntry(entry: InsertAgentMemory): Promise<AgentMemoryEntry> {
    const [newEntry] = await db.insert(agentMemory).values(entry).returning();
    return newEntry;
  }

  async getMemoryEntries(category?: string, limit: number = 50): Promise<AgentMemoryEntry[]> {
    if (category) {
      return await db.select().from(agentMemory).where(eq(agentMemory.category, category)).orderBy(desc(agentMemory.createdAt)).limit(limit);
    }
    return await db.select().from(agentMemory).orderBy(desc(agentMemory.createdAt)).limit(limit);
  }

  async createDailyBrief(brief: InsertDailyBrief): Promise<DailyBrief> {
    const [newBrief] = await db.insert(dailyBriefs).values(brief).returning();
    return newBrief;
  }

  async getLatestBrief(): Promise<DailyBrief | undefined> {
    const [brief] = await db.select().from(dailyBriefs).orderBy(desc(dailyBriefs.createdAt)).limit(1);
    return brief;
  }

  async getDailyBriefs(limit: number = 10): Promise<DailyBrief[]> {
    return await db.select().from(dailyBriefs).orderBy(desc(dailyBriefs.createdAt)).limit(limit);
  }

  // ── CRM ──────────────────────────────────────────────────────────────────

  async getCrmContacts(search?: string, limit: number = 100): Promise<CrmContact[]> {
    if (search) {
      const { ilike, or } = await import("drizzle-orm");
      const term = `%${search}%`;
      return await db.select().from(crmContacts)
        .where(or(ilike(crmContacts.firstName, term), ilike(crmContacts.lastName, term), ilike(crmContacts.email, term), ilike(crmContacts.company, term)))
        .orderBy(desc(crmContacts.createdAt)).limit(limit);
    }
    return await db.select().from(crmContacts).orderBy(desc(crmContacts.createdAt)).limit(limit);
  }

  async getCrmContact(id: number): Promise<CrmContact | undefined> {
    const [c] = await db.select().from(crmContacts).where(eq(crmContacts.id, id));
    return c;
  }

  async createCrmContact(contact: InsertCrmContact): Promise<CrmContact> {
    const [c] = await db.insert(crmContacts).values(contact).returning();
    return c;
  }

  async updateCrmContact(id: number, updates: Partial<CrmContact>): Promise<CrmContact | undefined> {
    const [c] = await db.update(crmContacts).set({ ...updates, updatedAt: new Date() }).where(eq(crmContacts.id, id)).returning();
    return c;
  }

  async deleteCrmContact(id: number): Promise<void> {
    await db.delete(crmDeals).where(eq(crmDeals.contactId, id));
    await db.delete(crmActivities).where(eq(crmActivities.contactId, id));
    await db.delete(crmContacts).where(eq(crmContacts.id, id));
  }

  async bulkCreateCrmContacts(contacts: InsertCrmContact[]): Promise<{ imported: number; failed: number }> {
    let imported = 0;
    let failed = 0;
    for (const contact of contacts) {
      try {
        await db.insert(crmContacts).values(contact);
        imported++;
      } catch {
        failed++;
      }
    }
    return { imported, failed };
  }

  async getCrmDeals(contactId?: number, division?: string, stage?: string): Promise<CrmDeal[]> {
    let query = db.select().from(crmDeals).$dynamic();
    const conditions = [];
    if (contactId) conditions.push(eq(crmDeals.contactId, contactId));
    if (division) conditions.push(eq(crmDeals.division, division));
    if (stage) conditions.push(eq(crmDeals.stage, stage));
    if (conditions.length > 0) {
      const { and } = await import("drizzle-orm");
      query = query.where(and(...conditions));
    }
    return await query.orderBy(desc(crmDeals.updatedAt));
  }

  async getCrmDeal(id: number): Promise<CrmDeal | undefined> {
    const [d] = await db.select().from(crmDeals).where(eq(crmDeals.id, id));
    return d;
  }

  async createCrmDeal(deal: InsertCrmDeal): Promise<CrmDeal> {
    const [d] = await db.insert(crmDeals).values(deal).returning();
    return d;
  }

  async updateCrmDeal(id: number, updates: Partial<CrmDeal>): Promise<CrmDeal | undefined> {
    const [d] = await db.update(crmDeals).set({ ...updates, updatedAt: new Date() }).where(eq(crmDeals.id, id)).returning();
    return d;
  }

  async getCrmActivities(contactId?: number, dealId?: number): Promise<CrmActivity[]> {
    if (contactId) return await db.select().from(crmActivities).where(eq(crmActivities.contactId, contactId)).orderBy(desc(crmActivities.createdAt));
    if (dealId) return await db.select().from(crmActivities).where(eq(crmActivities.dealId, dealId)).orderBy(desc(crmActivities.createdAt));
    return await db.select().from(crmActivities).orderBy(desc(crmActivities.createdAt)).limit(50);
  }

  async createCrmActivity(activity: InsertCrmActivity): Promise<CrmActivity> {
    const [a] = await db.insert(crmActivities).values(activity).returning();
    return a;
  }

  async createCrmImport(imp: { filename: string; rowsTotal: number }): Promise<CrmImport> {
    const [i] = await db.insert(crmImports).values({ filename: imp.filename, rowsTotal: imp.rowsTotal, status: "processing" }).returning();
    return i;
  }

  async updateCrmImport(id: number, updates: Partial<CrmImport>): Promise<void> {
    await db.update(crmImports).set(updates).where(eq(crmImports.id, id));
  }
}

export const storage = new DatabaseStorage();
