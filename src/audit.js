import { createHash } from "node:crypto";
import { verifyMessage } from "ethers";
import { openDb } from "./db.js";

const GENESIS = "0".repeat(64);
const sha = (body) => createHash("sha256").update(JSON.stringify(body)).digest("hex");
const bodyOf = (e) => ({ seq: e.seq, type: e.type, data: e.data, time: e.time, prevHash: e.prevHash });

/** Verify a hash-chained event list; returns { ok, error? }. Pure, no live system needed. */
export function verifyChain(events) {
  let prev = GENESIS;
  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    if (e.seq !== i) return { ok: false, error: `missing or reordered event at position ${i}` };
    if (e.prevHash !== prev) return { ok: false, error: `broken chain at seq ${i}` };
    if (sha(bodyOf(e)) !== e.hash) return { ok: false, error: `tampered event at seq ${i}` };
    prev = e.hash;
  }
  return { ok: true };
}

const exportPayload = (count, headHash) => `BEAST3-AUDIT-EXPORT\ncount:${count}\nhead:${headHash}`;

/**
 * Verify a signed export fully offline. If expectedSigner is given the signer must match.
 * Truncation is detected because the signature covers event count and head hash.
 */
export function verifyExport(exp, expectedSigner) {
  try {
    const chain = verifyChain(exp.events);
    if (!chain.ok) return chain;
    const head = exp.events.length ? exp.events.at(-1).hash : GENESIS;
    if (exp.count !== exp.events.length || exp.headHash !== head) return { ok: false, error: "export metadata mismatch" };
    const signer = verifyMessage(exportPayload(exp.count, exp.headHash), exp.signature);
    if (signer !== exp.signer) return { ok: false, error: "signature does not match declared signer" };
    if (expectedSigner && signer.toLowerCase() !== expectedSigner.toLowerCase()) return { ok: false, error: "unexpected signer" };
    return { ok: true, signer, count: exp.count };
  } catch (err) {
    return { ok: false, error: `invalid export: ${err.message}` };
  }
}

/** Append-only, hash-chained audit log persisted in SQLite (ADR-006). */
export class AuditLog {
  #db;
  #signer;
  constructor({ db = openDb(), signer } = {}) {
    this.#db = db;
    this.#signer = signer; // ethers Wallet used to sign exports
  }

  append(type, data, now = new Date()) {
    const last = this.#db.prepare("SELECT seq, hash FROM audit ORDER BY seq DESC LIMIT 1").get();
    const body = { seq: last ? last.seq + 1 : 0, type, data, time: now.toISOString(), prevHash: last ? last.hash : GENESIS };
    const event = { ...body, hash: sha(body) };
    this.#db.prepare("INSERT INTO audit (seq,type,data,time,prev_hash,hash) VALUES (?,?,?,?,?,?)")
      .run(event.seq, type, JSON.stringify(data), event.time, body.prevHash, event.hash);
    return Object.freeze(event);
  }

  list() {
    return this.#db.prepare("SELECT * FROM audit ORDER BY seq").all().map((r) => ({
      seq: r.seq, type: r.type, data: JSON.parse(r.data), time: r.time, prevHash: r.prev_hash, hash: r.hash,
    }));
  }

  verify() { return verifyChain(this.list()).ok; }

  async export() {
    if (!this.#signer) throw new Error("no signer configured");
    const events = this.list();
    const headHash = events.length ? events.at(-1).hash : GENESIS;
    const signature = await this.#signer.signMessage(exportPayload(events.length, headHash));
    return { version: 1, signer: this.#signer.address, count: events.length, headHash, events, signature };
  }

  verifyExport(exp, expectedSigner) { return verifyExport(exp, expectedSigner); }
}
