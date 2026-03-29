import { storage } from "../storage";
import { runCFOAnalysis, getCFOQuickStatus } from "./cfoAgent";
import { runCOOAnalysis, getCOOQuickStatus } from "./cooAgent";
import { runCTOAnalysis, getCTOQuickStatus } from "./ctoAgent";
import { runCMOAnalysis, getCMOQuickStatus } from "./cmoAgent";
import { runCHROAnalysis, getCHROQuickStatus } from "./chroAgent";
import { generateDailyBrief, analyzeCrossBusiness } from "./orchestratorAgent";
import { collectDivisionData } from "./divisionCollector";

interface ScheduledTask {
  id: string;
  name: string;
  interval: number;
  lastRun: Date | null;
  nextRun: Date;
  enabled: boolean;
  handler: () => Promise<void>;
}

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  source: string;
  message: string;
  createdAt: Date;
  resolved: boolean;
}

class AgentScheduler {
  private tasks: Map<string, ScheduledTask> = new Map();
  private alerts: Alert[] = [];
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();
  private isRunning = false;

  constructor() {
    this.initializeTasks();
  }

  private initializeTasks() {
    this.registerTask({
      id: "executive_health_check",
      name: "Executive Agent Health Check",
      interval: 30 * 60 * 1000,
      lastRun: null,
      nextRun: new Date(Date.now() + 30 * 60 * 1000),
      enabled: true,
      handler: this.runExecutiveHealthCheck.bind(this)
    });

    this.registerTask({
      id: "alert_scan",
      name: "Alert Scan",
      interval: 15 * 60 * 1000,
      lastRun: null,
      nextRun: new Date(Date.now() + 15 * 60 * 1000),
      enabled: true,
      handler: this.runAlertScan.bind(this)
    });

    this.registerTask({
      id: "daily_summary",
      name: "Daily Summary",
      interval: 24 * 60 * 60 * 1000,
      lastRun: null,
      nextRun: this.getNextMorning(),
      enabled: true,
      handler: this.runDailySummary.bind(this)
    });

    this.registerTask({
      id: "daily_executive_brief",
      name: "Daily Executive Brief",
      interval: 24 * 60 * 60 * 1000,
      lastRun: null,
      nextRun: this.getNextMorning(),
      enabled: true,
      handler: this.runDailyExecutiveBrief.bind(this)
    });

    this.registerTask({
      id: "cross_business_scan",
      name: "Cross-Business Synergy Scan",
      interval: 7 * 24 * 60 * 60 * 1000,
      lastRun: null,
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      enabled: true,
      handler: this.runCrossBusinessScan.bind(this)
    });

    this.registerTask({
      id: "division_data_collection",
      name: "Division App Data Collection",
      interval: 30 * 60 * 1000,
      lastRun: null,
      nextRun: new Date(Date.now() + 5 * 60 * 1000),
      enabled: true,
      handler: this.runDivisionDataCollection.bind(this)
    });
  }

  private registerTask(task: ScheduledTask) {
    this.tasks.set(task.id, task);
  }

  private getNextMorning(): Date {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    return tomorrow;
  }

  async start() {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log("[Scheduler] Starting agent scheduler...");

    for (const [id, task] of this.tasks) {
      if (task.enabled) {
        const intervalId = setInterval(async () => {
          await this.executeTask(id);
        }, task.interval);
        this.intervalIds.set(id, intervalId);
      }
    }

    await storage.createAgentLog({
      agentType: "system",
      agentName: "Scheduler",
      action: "Scheduler Started",
      details: `${this.tasks.size} tasks registered`,
      status: "completed"
    });
  }

  stop() {
    this.isRunning = false;
    for (const [id, intervalId] of this.intervalIds) {
      clearInterval(intervalId);
    }
    this.intervalIds.clear();
    console.log("[Scheduler] Scheduler stopped");
  }

  private async executeTask(taskId: string) {
    const task = this.tasks.get(taskId);
    if (!task) return;

    try {
      console.log(`[Scheduler] Running task: ${task.name}`);
      await task.handler();
      task.lastRun = new Date();
      task.nextRun = new Date(Date.now() + task.interval);
      
      await storage.createAgentLog({
        agentType: "system",
        agentName: "Scheduler",
        action: `Task Completed: ${task.name}`,
        details: `Next run: ${task.nextRun.toISOString()}`,
        status: "completed"
      });
    } catch (error) {
      console.error(`[Scheduler] Task failed: ${task.name}`, error);
      this.addAlert("warning", "Scheduler", `Task failed: ${task.name}`);
    }
  }

  async runExecutiveHealthCheck() {
    const statuses = await Promise.all([
      getCFOQuickStatus(),
      getCOOQuickStatus(),
      getCTOQuickStatus(),
      getCMOQuickStatus(),
      getCHROQuickStatus()
    ]);

    const criticalIssues = statuses.filter(s => 
      s.toLowerCase().includes("critical") || 
      s.toLowerCase().includes("alert")
    );

    if (criticalIssues.length > 0) {
      this.addAlert("critical", "Executive Health Check", 
        `${criticalIssues.length} executives reporting issues`
      );
    }
  }

  async runAlertScan() {
    const [divisions, incidents] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents()
    ]);

    const criticalIncidents = incidents.filter(i => 
      i.status === "open" && i.severity === "critical"
    );

    if (criticalIncidents.length > 0) {
      this.addAlert("critical", "Incident Monitor", 
        `${criticalIncidents.length} critical incidents need attention`
      );
    }

    const downDivisions = divisions.filter(d => d.status === "down");
    if (downDivisions.length > 0) {
      this.addAlert("critical", "Division Monitor",
        `${downDivisions.length} divisions are down: ${downDivisions.map(d => d.name).join(", ")}`
      );
    }
  }

  async runDailySummary() {
    const [divisions, incidents, subscribers, inquiries] = await Promise.all([
      storage.getDivisions(),
      storage.getIncidents(),
      storage.getSubscribers(),
      storage.getInquiries()
    ]);

    const summary = {
      totalDivisions: divisions.length,
      activeDivisions: divisions.filter(d => d.status === "live").length,
      openIncidents: incidents.filter(i => i.status === "open").length,
      newSubscribers: subscribers.length,
      newInquiries: inquiries.length
    };

    await storage.createAgentLog({
      agentType: "system",
      agentName: "Daily Summary",
      action: "Daily Report Generated",
      details: JSON.stringify(summary),
      status: "completed"
    });
  }

  async runDailyExecutiveBrief() {
    try {
      const brief = await generateDailyBrief();
      await storage.createAgentLog({
        agentType: "orchestrator",
        agentName: "Master Orchestrator",
        action: "Daily Executive Brief Generated",
        details: brief.executiveSummary?.substring(0, 200) || "Brief generated",
        status: "completed"
      });
    } catch (error) {
      console.error("[Scheduler] Daily Executive Brief failed:", error);
      this.addAlert("warning", "Orchestrator", "Daily Executive Brief generation failed");
    }
  }

  async runCrossBusinessScan() {
    try {
      const analysis = await analyzeCrossBusiness();
      await storage.createAgentLog({
        agentType: "orchestrator",
        agentName: "Master Orchestrator",
        action: "Cross-Business Synergy Scan Complete",
        details: analysis.summary?.substring(0, 200) || "Scan completed",
        status: "completed"
      });
    } catch (error) {
      console.error("[Scheduler] Cross-Business Scan failed:", error);
      this.addAlert("warning", "Orchestrator", "Cross-business synergy scan failed");
    }
  }

  async runDivisionDataCollection() {
    try {
      const results = await collectDivisionData();
      const failed = results.filter((r) => !r.success);
      if (failed.length > 0) {
        this.addAlert(
          failed.length >= 5 ? "critical" : "warning",
          "Division Collector",
          `${failed.length} division app(s) unreachable: ${failed.map((r) => r.divisionName).join(", ")}`
        );
      }
    } catch (error) {
      console.error("[Scheduler] Division data collection failed:", error);
      this.addAlert("warning", "Division Collector", "Division data collection failed");
    }
  }

  addAlert(type: Alert["type"], source: string, message: string) {
    const alert: Alert = {
      id: `alert_${Date.now()}`,
      type,
      source,
      message,
      createdAt: new Date(),
      resolved: false
    };
    this.alerts.unshift(alert);
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(0, 100);
    }
    console.log(`[Alert] ${type.toUpperCase()}: ${message}`);
  }

  getAlerts(includeResolved = false): Alert[] {
    if (includeResolved) return this.alerts;
    return this.alerts.filter(a => !a.resolved);
  }

  resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) alert.resolved = true;
  }

  getScheduledTasks(): ScheduledTask[] {
    return Array.from(this.tasks.values());
  }

  async runTaskNow(taskId: string) {
    await this.executeTask(taskId);
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      taskCount: this.tasks.size,
      activeAlerts: this.alerts.filter(a => !a.resolved).length,
      tasks: Array.from(this.tasks.values()).map(t => ({
        id: t.id,
        name: t.name,
        enabled: t.enabled,
        lastRun: t.lastRun,
        nextRun: t.nextRun
      }))
    };
  }
}

export const scheduler = new AgentScheduler();
