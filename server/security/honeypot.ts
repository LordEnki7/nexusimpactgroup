import { Express, Request, Response } from "express";
import { logSecurityEvent } from "../agents/securityAgent";

interface ThreatEntry {
  ip: string;
  url: string;
  method: string;
  userAgent: string;
  timestamp: Date;
}

const threatLog: ThreatEntry[] = [];

const TRAP_URLS = [
  "/wp-admin", "/wp-admin/login", "/wp-login.php",
  "/admin/login", "/administrator", "/admin.php",
  "/.env", "/.env.local", "/.env.production", "/.env.backup",
  "/config.php", "/configuration.php", "/config.json", "/config.yml",
  "/phpMyAdmin", "/phpmyadmin", "/pma", "/mysql",
  "/api/v1/users/admin", "/api/config", "/api/debug", "/api/test",
  "/server-status", "/server-info",
  "/backup.zip", "/backup.sql", "/dump.sql", "/db.sql",
  "/install.php", "/setup.php", "/setup",
  "/.git/config", "/.git/HEAD",
  "/actuator", "/actuator/env", "/actuator/health",
  "/console", "/h2-console",
  "/swagger-ui.html", "/api-docs", "/swagger",
  "/debug", "/trace", "/heapdump",
  "/shell", "/cmd", "/exec",
  "/xmlrpc.php", "/wp-json/wp/v2/users",
  "/.DS_Store", "/robots.txt.bak",
  "/sitemap_index.xml.gz",
];

export function registerHoneypotRoutes(app: Express) {
  for (const url of TRAP_URLS) {
    app.all(url, (req: Request, res: Response) => {
      const ip = req.ip || req.socket?.remoteAddress || "unknown";
      const entry: ThreatEntry = {
        ip,
        url: req.originalUrl,
        method: req.method,
        userAgent: req.headers["user-agent"] || "unknown",
        timestamp: new Date(),
      };
      threatLog.push(entry);
      if (threatLog.length > 500) threatLog.shift();

      console.warn(`[HONEYPOT] ${entry.method} ${entry.url} from ${ip}`);

      logSecurityEvent({
        appName: "NIG Platform",
        eventType: "honeypot_hit",
        severity: "MEDIUM",
        source: ip,
        details: `Honeypot triggered: ${entry.method} ${entry.url}`,
        metadata: JSON.stringify({ userAgent: entry.userAgent, url: entry.url, method: entry.method }),
      }).catch(() => {});

      setTimeout(() => {
        res.status(200).send("<!-- WordPress 6.4.1 -->");
      }, 8000);
    });
  }
  console.log(`[HONEYPOT] ${TRAP_URLS.length} trap endpoints active`);
}

export function getThreatStats() {
  const ipCounts: Record<string, number> = {};
  for (const entry of threatLog) {
    ipCounts[entry.ip] = (ipCounts[entry.ip] || 0) + 1;
  }
  const topAttackers = Object.entries(ipCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));
  return {
    total: threatLog.length,
    last24h: threatLog.filter(e => Date.now() - e.timestamp.getTime() < 86_400_000).length,
    topAttackers,
    recentHits: [...threatLog].reverse().slice(0, 20),
  };
}
