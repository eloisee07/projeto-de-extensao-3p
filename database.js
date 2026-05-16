import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3Package from "sqlite3";

const sqlite3 = sqlite3Package.verbose();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      mensagem TEXT NOT NULL,
      avaliacao INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS player_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_id TEXT NOT NULL UNIQUE,
      player_name TEXT,
      nivel INTEGER NOT NULL DEFAULT 1,
      pontos INTEGER NOT NULL DEFAULT 0,
      data TEXT,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

export default db;