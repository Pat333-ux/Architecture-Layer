import { randomBytes } from "node:crypto";
import { verifyMessage, getAddress } from "ethers";
import { openDb } from "./db.js";
import { RateLimiter } from "./rate-limit.js";

/**
 * SIWE login: nonce -> signature verification -> session -> audit record.
 * Per ADR-003/ADR-007: single-use expiring nonces, domain/chain checks,
 * server-side time only, server-side session state.
 */
export class SiweAuth {
  #db;
  constructor({ domain, chainId, audit, db = openDb(), rateLimiter, clock = () => new Date(), nonceTtlMs = 5 * 60e3, sessionTtlMs = 60 * 60e3 }) {
    Object.assign(this, { domain, chainId, audit, clock, nonceTtlMs, sessionTtlMs });
    this.#db = db;
    this.rateLimiter = rateLimiter ?? new RateLimiter({ clock });
  }

  /** key: client IP or wallet address, used for throttling. */
  createNonce(key = "anonymous") {
    if (!this.rateLimiter.check(key)) {
      this.audit.append("auth.rate_limited", { key }, this.clock());
      throw new Error("rate_limited");
    }
    const nonce = randomBytes(16).toString("hex");
    this.#db.prepare("INSERT INTO nonces (nonce, expires) VALUES (?, ?)").run(nonce, this.clock().getTime() + this.nonceTtlMs);
    return nonce;
  }

  buildMessage(address, nonce) {
    return [
      `${this.domain} wants you to sign in with your Ethereum account:`,
      getAddress(address), "", "Sign in to BEAST 3.0", "",
      `URI: https://${this.domain}`, "Version: 1", `Chain ID: ${this.chainId}`,
      `Nonce: ${nonce}`, `Issued At: ${this.clock().toISOString()}`,
    ].join("\n");
  }

  #reject(reason, address) {
    this.audit.append("auth.login_rejected", { reason, address }, this.clock());
    throw new Error(reason);
  }

  login(message, signature) {
    const f = (re) => message.match(re)?.[1];
    const address = message.split("\n")[1];
    const nonce = f(/^Nonce: (\w+)$/m);
    if (f(/^(\S+) wants you to sign in/) !== this.domain) this.#reject("wrong_domain", address);
    if (Number(f(/^Chain ID: (\d+)$/m)) !== this.chainId) this.#reject("wrong_chain", address);
    const row = this.#db.prepare("SELECT expires FROM nonces WHERE nonce = ?").get(nonce ?? "");
    this.#db.prepare("DELETE FROM nonces WHERE nonce = ?").run(nonce ?? ""); // single use, even on failure
    const expires = row?.expires;
    if (expires === undefined) this.#reject("nonce_invalid_or_replayed", address);
    if (this.clock().getTime() > expires) this.#reject("nonce_expired", address);
    let signer;
    try { signer = verifyMessage(message, signature); } catch { this.#reject("bad_signature", address); }
    if (signer !== address) this.#reject("signature_mismatch", address);

    const token = randomBytes(32).toString("hex");
    const expiresAt = this.clock().getTime() + this.sessionTtlMs;
    this.#db.prepare("INSERT INTO sessions (token, address, expires_at) VALUES (?, ?, ?)").run(token, signer, expiresAt);
    this.audit.append("auth.login", { address: signer }, this.clock());
    return { token, address: signer, expiresAt };
  }

  getSession(token) {
    const s = this.#db.prepare("SELECT address, expires_at FROM sessions WHERE token = ?").get(token ?? "");
    if (!s) return null;
    if (this.clock().getTime() > s.expires_at) { this.#db.prepare("DELETE FROM sessions WHERE token = ?").run(token); return null; }
    return { address: s.address, expiresAt: s.expires_at };
  }
}
