import type { Express, RequestHandler } from "express";
import crypto from "crypto";

const PASSWORD_HASH = process.env.COMMAND_CENTER_PASSWORD_HASH || "";
const SALT = "nig-salt-2026";

function verifyPassword(input: string): boolean {
  if (!PASSWORD_HASH) return false;
  const inputHash = crypto.scryptSync(input, SALT, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(inputHash, "hex"), Buffer.from(PASSWORD_HASH, "hex"));
}

export function registerCommandCenterAuth(app: Express) {
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ success: false, message: "Password required" });
    }
    if (verifyPassword(password)) {
      (req.session as any).commandCenterAuth = true;
      return res.json({ success: true });
    }
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
