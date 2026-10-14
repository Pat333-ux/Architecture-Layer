/** Fixed-window rate limiter keyed by IP or wallet (ADR-003). Uses an injectable server clock. */
export class RateLimiter {
  #hits = new Map();
  constructor({ limit = 10, windowMs = 60e3, clock = () => new Date() } = {}) {
    Object.assign(this, { limit, windowMs, clock });
  }
  check(key) {
    const now = this.clock().getTime();
    const h = (this.#hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (h.length >= this.limit) { this.#hits.set(key, h); return false; }
    h.push(now);
    this.#hits.set(key, h);
    return true;
  }
}
