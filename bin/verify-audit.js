#!/usr/bin/env node
// Offline audit verification: node bin/verify-audit.js <export.json> [expectedSignerAddress]
import { readFileSync } from "node:fs";
import { verifyExport } from "../src/audit.js";

const [file, signer] = process.argv.slice(2);
if (!file) { console.error("usage: verify-audit <export.json> [signer]"); process.exit(2); }
const res = verifyExport(JSON.parse(readFileSync(file, "utf8")), signer);
console.log(res.ok ? `PASS: ${res.count} events, signer ${res.signer}` : `FAIL: ${res.error}`);
process.exit(res.ok ? 0 : 1);
