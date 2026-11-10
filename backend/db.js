const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'wedding.db');
const db = new DatabaseSync(dbPath);

// Initialize Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS wishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    initial TEXT NOT NULL,
    avatar_bg TEXT NOT NULL,
    category TEXT NOT NULL,
    attendance TEXT NOT NULL,
    pax TEXT DEFAULT '1 Orang',
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_name TEXT NOT NULL,
    bank_target TEXT NOT NULL,
    amount REAL DEFAULT 0,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Pre-seed initial sample wishes if table is empty - DISABLED: no dummy data
// Data nyata akan diisi oleh tamu yang mengisi form ucapan
const countQuery = db.prepare('SELECT COUNT(*) as count FROM wishes');
const { count } = countQuery.get();

// Hanya log, tidak ada seed dummy data
if (count === 0) {
  console.log('[DB] Database kosong, siap menerima ucapan dari tamu undangan.');
}

module.exports = db;

