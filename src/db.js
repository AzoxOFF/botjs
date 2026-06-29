const path = require('node:path');
const Database = require('better-sqlite3');

const db = new Database(path.join(__dirname, '..', 'data.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS ticket_configs (
    guild_id TEXT PRIMARY KEY,
    category_id TEXT,
    support_role_id TEXT NOT NULL,
    log_channel_id TEXT
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    channel_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    topic TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    assigned_to TEXT,
    created_at TEXT NOT NULL,
    closed_at TEXT
  );
`);

module.exports = db;
