import { createHash } from "node:crypto";

/** Minimal append-only, hash-chained audit log (full system: Epic 3, ADR-006). */
export class AuditLog {
  #events = [];
  append(type, data, now = new Date()) {
    const prevHash = this.#events.length ? this.#events.at(-1).hash : "0".repeat(64);
    const body = { seq: this.#events.length, type, data, time: now.toISOString(), prevHash };
    const hash = createHash("sha256").update(JSON.stringify(body)).digest("hex");
    const event = Object.freeze({ ...body, hash });
    this.#events.push(event);
    return event;
  }
  list() { return [...this.#events]; }
  verify() {
    let prev = "0".repeat(64);
    return this.#events.every((e, i) => {
      const { hash, ...body } = e;
      const ok = e.seq === i && e.prevHash === prev &&
        createHash("sha256").update(JSON.stringify(body)).digest("hex") === hash;
      prev = hash;
      return ok;
    });
  }
}
