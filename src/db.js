import { DatabaseSync } from "node:sqlite";

export function openDb(path = ":memory:") {
  const db = new DatabaseSync(path);
  db.exec(`
    CREATE TABLE IF NOT EXISTS nonces (nonce TEXT PRIMARY KEY, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, address TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit (
      seq INTEGER PRIMARY KEY, type TEXT NOT NULL, data TEXT NOT NULL,
      time TEXT NOT NULL, prev_hash TEXT NOT NULL, hash TEXT NOT NULL);
  `);
  return db;
}
