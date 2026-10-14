import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { Wallet } from "ethers";
import { SiweAuth } from "../src/siwe.js";
import { AuditLog, verifyExport } from "../src/audit.js";
import { openDb } from "../src/db.js";
import { RateLimiter } from "../src/rate-limit.js";

const cfg = { domain: "beast.test", chainId: 1 };

test("sessions, nonces and audit chain survive restart", async () => {
  const path = join(mkdtempSync(join(tmpdir(), "beast-")), "pilot.db");
  const w = Wallet.createRandom();
  let db = openDb(path);
  let audit = new AuditLog({ db });
  let auth = new SiweAuth({ ...cfg, audit, db });
  const pending = auth.createNonce("ip1");
  const msg = auth.buildMessage(w.address, auth.createNonce("ip1"));
  const { token } = auth.login(msg, await w.signMessage(msg));
  db.close();

  db = openDb(path);
  audit = new AuditLog({ db });
  auth = new SiweAuth({ ...cfg, audit, db });
  assert.ok(auth.getSession(token));
  assert.ok(audit.verify());
  assert.equal(audit.list().length, 1);
  const m2 = auth.buildMessage(w.address, pending);
  assert.ok(auth.login(m2, await w.signMessage(m2)));
  assert.equal(audit.list().length, 2);
});

test("nonce requests are rate limited per key and audited", () => {
  const audit = new AuditLog();
  const auth = new SiweAuth({ ...cfg, audit, rateLimiter: new RateLimiter({ limit: 2 }) });
  auth.createNonce("a"); auth.createNonce("a");
  assert.throws(() => auth.createNonce("a"), /rate_limited/);
  assert.ok(auth.createNonce("b"));
  assert.equal(audit.list().at(-1).type, "auth.rate_limited");
});

test("signed export verifies offline and detects tampering, truncation, reorder", async () => {
  const signer = Wallet.createRandom();
  const audit = new AuditLog({ signer });
  for (let i = 0; i < 4; i++) audit.append("evt", { i });
  const exp = await audit.export();
  assert.deepEqual(verifyExport(exp, signer.address).ok, true);

  const clone = () => structuredClone(exp);
  let t = clone(); t.events[1].data.i = 99;
  assert.equal(verifyExport(t).ok, false);
  t = clone(); t.events.pop();
  assert.equal(verifyExport(t).ok, false);
  t = clone(); [t.events[1], t.events[2]] = [t.events[2], t.events[1]];
  assert.equal(verifyExport(t).ok, false);
  assert.equal(verifyExport(exp, Wallet.createRandom().address).ok, false);

  const dir = mkdtempSync(join(tmpdir(), "beast-"));
  const f = join(dir, "e.json");
  writeFileSync(f, JSON.stringify(exp));
  assert.equal(spawnSync("node", ["bin/verify-audit.js", f]).status, 0);
  t = clone(); t.events[0].type = "x";
  writeFileSync(f, JSON.stringify(t));
  assert.equal(spawnSync("node", ["bin/verify-audit.js", f]).status, 1);
});
