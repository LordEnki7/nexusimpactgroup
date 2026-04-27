import { storage } from "../storage";

const NIG_API_KEY = process.env.NIG_API_KEY || "";
const COLLECTION_TIMEOUT_MS = 10000;

export interface HealthCheckResult {
  name: string;
  domain: string;
  reachable: boolean;
  hasHealthEndpoint: boolean;
  httpStatus: number | null;
  responseMs: number;
  data: Record<string, any> | null;
  checkedAt: string;
}

export async function checkDivisionHealth(): Promise<HealthCheckResult[]> {
  const results = await Promise.all(
    DIVISION_ENDPOINTS.map(async (ep): Promise<HealthCheckResult> => {
      const checkedAt = new Date().toISOString();
      const start = Date.now();

      // Try /api/health first, then /health
      for (const path of ["/api/health", "/health"]) {
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 8000);
          const res = await fetch(`https://${ep.domain}${path}`, {
            method: "GET",
            signal: controller.signal,
            headers: { "x-nig-key": NIG_API_KEY || "nig-monitor" },
          });
          clearTimeout(tid);
          const responseMs = Date.now() - start;

          if (res.ok) {
            let data: Record<string, any> | null = null;
            const ct = res.headers.get("content-type") || "";
            if (ct.includes("json")) {
              try { data = await res.json(); } catch {}
            }
            return { name: ep.name, domain: ep.domain, reachable: true, hasHealthEndpoint: true, httpStatus: res.status, responseMs, data, checkedAt };
          }
          // Non-ok but reachable
          return { name: ep.name, domain: ep.domain, reachable: true, hasHealthEndpoint: false, httpStatus: res.status, responseMs, data: null, checkedAt };
        } catch {}
      }

      // Fall back to basic ping
      const pingStart = Date.now();
      try {
        const c = new AbortController();
        const t = setTimeout(() => c.abort(), 8000);
        const r = await fetch(`https://${ep.domain}`, { method: "HEAD", signal: c.signal });
        clearTimeout(t);
        return { name: ep.name, domain: ep.domain, reachable: r.ok || r.status < 500, hasHealthEndpoint: false, httpStatus: r.status, responseMs: Date.now() - pingStart, data: null, checkedAt };
      } catch {
        return { name: ep.name, domain: ep.domain, reachable: false, hasHealthEndpoint: false, httpStatus: null, responseMs: Date.now() - pingStart, data: null, checkedAt };
      }
    })
  );
  return results;
}

export interface PingResult {
  name: string;
  domain: string;
  status: "live" | "degraded" | "offline";
  httpStatus: number | null;
  responseMs: number;
  checkedAt: string;
  method: "nig-api" | "ping";
}

async function pingDivisionSite(domain: string): Promise<{ httpStatus: number; responseMs: number }> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), COLLECTION_TIMEOUT_MS);
  try {
    const res = await fetch(`https://${domain}`, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timeoutId);
    return { httpStatus: res.status, responseMs: Date.now() - start };
  } catch {
    clearTimeout(timeoutId);
    // Try GET as fallback (some servers reject HEAD)
    try {
      const controller2 = new AbortController();
      const t2 = setTimeout(() => controller2.abort(), COLLECTION_TIMEOUT_MS);
      const res2 = await fetch(`https://${domain}`, { method: "GET", signal: controller2.signal });
      clearTimeout(t2);
      return { httpStatus: res2.status, responseMs: Date.now() - start };
    } catch {
      return { httpStatus: 0, responseMs: Date.now() - start };
    }
  }
}

export async function pingAllDivisions(): Promise<PingResult[]> {
  const results = await Promise.all(
    DIVISION_ENDPOINTS.map(async (endpoint): Promise<PingResult> => {
      const checkedAt = new Date().toISOString();

      // First try the NIG status API
      try {
        const start = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(`https://${endpoint.domain}/api/nig-status`, {
          headers: { "Authorization": `Bearer ${NIG_API_KEY}`, "Content-Type": "application/json" },
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        const responseMs = Date.now() - start;
        if (res.ok) {
          const data = await res.json();
          return {
            name: endpoint.name, domain: endpoint.domain,
            status: data.status === "live" ? "live" : data.status === "maintenance" ? "degraded" : "offline",
            httpStatus: res.status, responseMs, checkedAt, method: "nig-api",
          };
        }
        // Fall through to ping
      } catch { /* fall through */ }

      // Fallback: simple ping
      const { httpStatus, responseMs } = await pingDivisionSite(endpoint.domain);
      const status: PingResult["status"] =
        httpStatus >= 200 && httpStatus < 400 ? "live" :
        httpStatus >= 400 && httpStatus < 500 ? "degraded" : "offline";

      return { name: endpoint.name, domain: endpoint.domain, status, httpStatus, responseMs, checkedAt, method: "ping" };
    })
  );
  return results;
}

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

interface DivisionEndpoint {
  name: string;
  domain: string;
  /** Custom auth header value — overrides the default Bearer token */
  hubToken?: string;
  /** If true, fetch /api/csrf-token before any write operations */
  requiresCsrf?: boolean;
}

const DIVISION_ENDPOINTS: DivisionEndpoint[] = [
  { name: "C.A.R.E.N.", domain: "carenalert.com" },
  { name: "Real Pulse Verifier", domain: "realpulseverifier.com" },
  { name: "My Life Assistant", domain: "mylifeassistant.vip" },
  { name: "The Remedy Club", domain: "theremedyclub.vip" },
  { name: "Rent-A-Buddy", domain: "rent-a-buddy.info" },
  { name: "Eternal Chase", domain: "eternalchase.stream" },
  { name: "Project DNA Music", domain: "projectdnamusic.info" },
  { name: "Zapp Marketing and Manufacturing", domain: "zapp-ecommerce.online" },
  { name: "Studio Artist Live", domain: "studioartistlive.com" },
  { name: "ClearSpace", domain: "clearspace.photos" },
  { name: "Global Trade Facilitators", domain: "globaltradefacilitators.us.com" },
  {
    name: "YaPide",
    domain: "yapide.app",
    hubToken: process.env.YAPIDE_HUB_TOKEN,
    requiresCsrf: true,
  },
];

/** Fetch the CSRF token from a yapide-style app before write operations */
export async function fetchCsrfToken(domain: string, hubToken?: string): Promise<string | null> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (hubToken) headers["X-Hub-Token"] = hubToken;
    const res = await fetch(`https://${domain}/api/csrf-token`, { method: "GET", headers });
    if (res.ok) {
      const data = await res.json();
      return data.token || data.csrfToken || null;
    }
  } catch {}
  return null;
}

/** Build auth headers for a given endpoint */
function buildAuthHeaders(ep: DivisionEndpoint): Record<string, string> {
  if (ep.hubToken) {
    return { "X-Hub-Token": ep.hubToken, "Content-Type": "application/json" };
  }
  return { "Authorization": `Bearer ${NIG_API_KEY}`, "Content-Type": "application/json" };
}

async function fetchDivisionStatus(domain: string, ep?: DivisionEndpoint): Promise<{ data: DivisionStatusResponse; responseMs: number }> {
  const start = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), COLLECTION_TIMEOUT_MS);
  const headers = ep ? buildAuthHeaders(ep) : { "Authorization": `Bearer ${NIG_API_KEY}`, "Content-Type": "application/json" };

  try {
    const res = await fetch(`https://${domain}/api/nig-status`, {
      headers,
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
      const { data, responseMs } = await fetchDivisionStatus(endpoint.domain, endpoint);

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
