import test from "node:test";
import assert from "node:assert/strict";
import { Wallet } from "ethers";
import { SiweAuth } from "../src/siwe.js";
import { AuditLog } from "../src/audit.js";

const mk = (o = {}) => {
  const audit = new AuditLog();
  return { audit, auth: new SiweAuth({ domain: "beast.test", chainId: 1, audit, ...o }), w: Wallet.createRandom() };
};

test("login creates session and audit event", async () => {
  const { auth, audit, w } = mk();
  const msg = auth.buildMessage(w.address, auth.createNonce());
  const s = auth.login(msg, await w.signMessage(msg));
  assert.equal(s.address, w.address);
  assert.ok(auth.getSession(s.token));
  assert.equal(audit.list().at(-1).type, "auth.login");
  assert.ok(audit.verify());
});

test("nonce replay rejected", async () => {
  const { auth, w } = mk();
  const msg = auth.buildMessage(w.address, auth.createNonce());
  const sig = await w.signMessage(msg);
  auth.login(msg, sig);
  assert.throws(() => auth.login(msg, sig), /nonce_invalid_or_replayed/);
});

test("expired nonce and session use server clock", async () => {
  let t = 0;
  const { auth, w } = mk({ clock: () => new Date(t) });
  const msg = auth.buildMessage(w.address, auth.createNonce());
  t = 6 * 60e3;
  assert.throws(() => auth.login(msg, "0x"), /nonce_expired/);
  const m2 = auth.buildMessage(w.address, auth.createNonce());
  const s = auth.login(m2, await w.signMessage(m2));
  t += 61 * 60e3;
  assert.equal(auth.getSession(s.token), null);
});

test("wrong domain, chain, signer rejected and audited", async () => {
  const { auth, audit, w } = mk();
  const other = Wallet.createRandom();
  let m = auth.buildMessage(w.address, auth.createNonce()).replace("beast.test wants", "evil.test wants");
  assert.throws(() => auth.login(m, "0x"), /wrong_domain/);
  m = auth.buildMessage(w.address, auth.createNonce()).replace("Chain ID: 1", "Chain ID: 5");
  assert.throws(() => auth.login(m, "0x"), /wrong_chain/);
  m = auth.buildMessage(w.address, auth.createNonce());
  assert.throws(() => auth.login(m, await_free(other, m)), /signature_mismatch|bad_signature/);
  assert.equal(audit.list().filter((e) => e.type === "auth.login_rejected").length, 3);
});

function await_free(wallet, m) {
  return wallet.signMessageSync(m);
}
