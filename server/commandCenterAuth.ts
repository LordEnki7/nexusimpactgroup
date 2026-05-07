import type { Express, RequestHandler } from "express";
import crypto from "crypto";
import { logSecurityEvent } from "./agents/securityAgent";

const PASSWORD_HASH = process.env.COMMAND_CENTER_PASSWORD_HASH || "";
const SALT = "nig-salt-2026";

interface FailEntry { count: number; lastAt: Date; }
const failLog: Record<string, FailEntry> = {};

function verifyPassword(input: string): boolean {
  if (!PASSWORD_HASH) return false;
  const inputHash = crypto.scryptSync(input, SALT, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(inputHash, "hex"), Buffer.from(PASSWORD_HASH, "hex"));
}

export function registerCommandCenterAuth(app: Express) {
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body || {};
    const ip = req.ip || "unknown";
    const ua = req.headers["user-agent"] || "unknown";

    if (!password) {
      return res.status(400).json({ success: false, message: "Password required" });
    }

    if (verifyPassword(password)) {
      delete failLog[ip];
      logSecurityEvent({
        appName: "NIG Command Center",
        eventType: "login_success",
        severity: "INFO",
        source: ip,
        details: `Successful login from ${ip}`,
        metadata: JSON.stringify({ userAgent: ua }),
      }).catch(() => {});
      (req.session as any).commandCenterAuth = true;
      return res.json({ success: true });
    }

    if (!failLog[ip]) failLog[ip] = { count: 0, lastAt: new Date() };
    failLog[ip].count++;
    failLog[ip].lastAt = new Date();

    const severity = failLog[ip].count >= 10 ? "HIGH" : failLog[ip].count >= 5 ? "MEDIUM" : "LOW";
    console.warn(`[SECURITY] Failed login from ${ip} — attempt #${failLog[ip].count}`);

    logSecurityEvent({
      appName: "NIG Command Center",
      eventType: "login_failed",
      severity,
      source: ip,
      details: `Failed login attempt #${failLog[ip].count} from ${ip}`,
      metadata: JSON.stringify({ userAgent: ua, totalAttempts: failLog[ip].count }),
    }).catch(() => {});

    return res.status(401).json({ success: false, message: "Invalid password" });
  });

  app.post("/api/auth/logout", (req, res) => {
    (req.session as any).commandCenterAuth = false;
    req.session.destroy(() => {});
    res.json({ success: true });
  });

  app.get("/api/auth/status", (req, res) => {
    const authenticated = !!(req.session as any)?.commandCenterAuth;
    res.json({ authenticated });
  });
}

export const requireCommandCenterAuth: RequestHandler = (req, res, next) => {
  if ((req.session as any)?.commandCenterAuth) return next();
  res.status(401).json({ success: false, message: "Unauthorized" });
};

export function getFailedLoginAttempts() {
  return Object.entries(failLog).map(([ip, data]) => ({
    ip,
    count: data.count,
    lastAt: data.lastAt,
  })).sort((a, b) => b.count - a.count);
}
