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
  agentLogs
} from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

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
  
  getDivisionMetrics(divisionId?: number): Promise<DivisionMetric[]>;
  createDivisionMetric(metric: InsertDivisionMetric): Promise<DivisionMetric>;
  
  getIncidents(divisionId?: number): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  
  getFinancialSnapshots(divisionId?: number): Promise<FinancialSnapshot[]>;
  createFinancialSnapshot(snapshot: InsertFinancialSnapshot): Promise<FinancialSnapshot>;
  
  getAgentLogs(limit?: number): Promise<AgentLog[]>;
  createAgentLog(log: InsertAgentLog): Promise<AgentLog>;
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
    return await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
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
}

export const storage = new DatabaseStorage();
