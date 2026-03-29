import { storage } from "../storage";

const NIG_API_KEY = process.env.NIG_API_KEY || "";
const COLLECTION_TIMEOUT_MS = 10000;

export interface DivisionStatusResponse {
  division: string;
  status: "live" | "maintenance" | "degraded" | "offline";
  health: number;
  activeUsers?: number;
  revenue?: number;
  subscribers?: number;
  uptime?: number;
  metrics?: Record<string, number>;
  message?: string;
  timestamp: string;
}

export interface CollectionResult {
  divisionName: string;
  domain: string;
  success: boolean;
  data?: DivisionStatusResponse;
  error?: string;
  responseMs: number;
}

const DIVISION_ENDPOINTS: { name: string; domain: string }[] = [
  { name: "C.A.R.E.N.", domain: "carenalert.com" },
  { name: "My Life Assistant", domain: "mylifeassistant.vip" },
  { name: "The Remedy Club", domain: "theremedyclub.vip" },
  { name: "Rent-A-Buddy", domain: "rent-a-buddy.info" },
  { name: "Eternal Chase", domain: "eternalchase.stream" },
  { name: "Project DNA Music", domain: "projectdnamusic.info" },
  { name: "Zapp Marketing and Manufacturing", domain: "zapp-ecommerce.online" },
  { name: "Studio Artist Live", domain: "studioartistlive.com" },
  { name: "ClearSpace", domain: "clearspace.photos" },
  { name: "Global Trade Facilitators", domain: "globaltradefacilitators.us.com" },
];

async function fetchDivisionStatus(domain: string): Promise<{ data: DivisionStatusResponse; responseMs: number }> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), COLLECTION_TIMEOUT_MS);

  try {
    const res = await fetch(`https://${domain}/api/nig-status`, {
      headers: {
        "Authorization": `Bearer ${NIG_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const responseMs = Date.now() - start;

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data: DivisionStatusResponse = await res.json();
    return { data, responseMs };
  } catch (err: any) {
    clearTimeout(timeoutId);
    throw new Error(err.name === "AbortError" ? "Request timed out" : err.message);
  }
}

export async function collectDivisionData(): Promise<CollectionResult[]> {
  const results: CollectionResult[] = [];
  const divisions = await storage.getDivisions();

  console.log(`[DivisionCollector] Starting data collection from ${DIVISION_ENDPOINTS.length} division apps...`);

  for (const endpoint of DIVISION_ENDPOINTS) {
    const start = Date.now();
    try {
      const { data, responseMs } = await fetchDivisionStatus(endpoint.domain);

      const division = divisions.find(
        (d) => d.name.toLowerCase().includes(endpoint.name.toLowerCase().split(" ")[0].toLowerCase())
      );

      if (division) {
        // Update division status based on health data
        if (data.status) {
          await storage.updateDivisionStatus(division.id, data.status);
        }

        // Store active users metric
        if (data.activeUsers !== undefined) {
          await storage.createDivisionMetric({
            divisionId: division.id,
            metricKey: "active_users",
            metricLabel: "Active Users",
            value: String(data.activeUsers),
            unit: "users",
            trend: "stable",
            period: "current",
          });
        }

        // Store health score metric
        if (data.health !== undefined) {
          await storage.createDivisionMetric({
            divisionId: division.id,
            metricKey: "health_score",
            metricLabel: "Health Score",
            value: String(data.health),
            unit: "%",
            trend: data.health >= 90 ? "up" : data.health >= 70 ? "stable" : "down",
            period: "current",
          });
        }

        // Store uptime metric
        if (data.uptime !== undefined) {
          await storage.createDivisionMetric({
            divisionId: division.id,
            metricKey: "uptime",
            metricLabel: "Uptime",
            value: String(data.uptime),
            unit: "%",
            trend: "stable",
            period: "current",
          });
        }

        // Store financial snapshot
        if (data.revenue !== undefined || data.subscribers !== undefined) {
          await storage.createFinancialSnapshot({
            divisionId: division.id,
            period: new Date().toISOString().slice(0, 7),
            revenue: data.revenue !== undefined ? String(data.revenue) : "0",
            costs: "0",
            subscribers: data.subscribers || 0,
            activeUsers: data.activeUsers || 0,
          });
        }

        // Store any custom metrics
        if (data.metrics) {
          for (const [key, value] of Object.entries(data.metrics)) {
            await storage.createDivisionMetric({
              divisionId: division.id,
              metricKey: key,
              metricLabel: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
              value: String(value),
              unit: "",
              trend: "stable",
              period: "current",
            });
          }
        }
      }

      results.push({
        divisionName: endpoint.name,
        domain: endpoint.domain,
        success: true,
        data,
        responseMs,
      });

      console.log(`[DivisionCollector] ✓ ${endpoint.name} — status: ${data.status}, health: ${data.health}%`);
    } catch (err: any) {
      const responseMs = Date.now() - start;
      results.push({
        divisionName: endpoint.name,
        domain: endpoint.domain,
        success: false,
        error: err.message,
        responseMs,
      });
      console.warn(`[DivisionCollector] ✗ ${endpoint.name} (${endpoint.domain}) — ${err.message}`);
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  await storage.createAgentLog({
    agentType: "collector",
    agentName: "Division Data Collector",
    action: "Division Status Collection",
    details: `Collected from ${succeeded}/${DIVISION_ENDPOINTS.length} apps. ${failed} unreachable.`,
    status: failed === 0 ? "completed" : "warning",
  });

  console.log(`[DivisionCollector] Collection complete: ${succeeded} succeeded, ${failed} failed.`);
  return results;
}
