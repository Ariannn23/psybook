import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
const CLEANUP_INTERVAL_MS = 60_000;
let cleanupStarted = false;

function startCleanup() {
  if (cleanupStarted) return;
  cleanupStarted = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of Object.entries(store)) {
      if (now > data.resetTime) delete store[key];
    }
  }, CLEANUP_INTERVAL_MS).unref?.();
}

export const rateLimiter = (windowMs: number, max: number) => {
  startCleanup();
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      };
      res.setHeader("RateLimit-Limit", String(max));
      res.setHeader("RateLimit-Remaining", String(Math.max(0, max - 1)));
      res.setHeader("RateLimit-Reset", String(Math.ceil(store[ip].resetTime / 1000)));
      return next();
    }

    store[ip].count++;
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader(
      "RateLimit-Remaining",
      String(Math.max(0, max - store[ip].count)),
    );
    res.setHeader(
      "RateLimit-Reset",
      String(Math.ceil(store[ip].resetTime / 1000)),
    );

    if (store[ip].count > max) {
      res.setHeader(
        "Retry-After",
        String(Math.max(0, Math.ceil((store[ip].resetTime - now) / 1000))),
      );
      return res.status(429).json({
        success: false,
        message: "Demasiadas solicitudes. Por favor intente más tarde.",
      });
    }

    next();
  };
};
