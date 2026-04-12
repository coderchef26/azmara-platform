import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rateLimit.js";

describe("createRateLimiter", () => {
  it("allows requests within the limit", () => {
    const limiter = createRateLimiter({ maxRequests: 3, windowMs: 1000 });
    const r1 = limiter.check("user-1");
    const r2 = limiter.check("user-1");
    const r3 = limiter.check("user-1");
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests over the limit", () => {
    const limiter = createRateLimiter({ maxRequests: 2, windowMs: 1000 });
    limiter.check("user-1");
    limiter.check("user-1");
    const r = limiter.check("user-1");
    expect(r.allowed).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it("tracks keys independently", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 1000 });
    const r1 = limiter.check("user-1");
    const r2 = limiter.check("user-2");
    expect(r1.allowed).toBe(true);
    expect(r2.allowed).toBe(true);
  });

  it("resets a specific key", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 1000 });
    limiter.check("user-1");
    limiter.reset("user-1");
    const r = limiter.check("user-1");
    expect(r.allowed).toBe(true);
  });

  it("resets all keys", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 1000 });
    limiter.check("user-1");
    limiter.check("user-2");
    limiter.resetAll();
    expect(limiter.check("user-1").allowed).toBe(true);
    expect(limiter.check("user-2").allowed).toBe(true);
  });

  it("provides a resetAt date", () => {
    const limiter = createRateLimiter({ maxRequests: 1, windowMs: 5000 });
    limiter.check("user-1");
    const r = limiter.check("user-1");
    expect(r.resetAt).toBeInstanceOf(Date);
    expect(r.resetAt.getTime()).toBeGreaterThan(Date.now());
  });
});
