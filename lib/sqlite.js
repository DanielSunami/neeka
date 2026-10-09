const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const dataDir = path.join(rootDir, 'data');
const dbPath = path.join(dataDir, 'neeka.sqlite');

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	firstname TEXT NOT NULL,
	lastname TEXT,
	website TEXT,
	email TEXT NOT NULL UNIQUE COLLATE NOCASE,
	password TEXT NOT NULL,
	birthday TEXT,
	permissions TEXT NOT NULL DEFAULT '[]',
	editor TEXT NOT NULL DEFAULT 'trix',
	created_on TEXT NOT NULL,
	last_update TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT,
	slug TEXT,
	preview TEXT,
	body TEXT,
	author_id INTEGER NOT NULL REFERENCES users(id),
	published INTEGER NOT NULL DEFAULT 0,
	keywords TEXT,
	description TEXT,
	created_on TEXT NOT NULL,
	last_update TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS posts_created_on ON posts(created_on);
CREATE INDEX IF NOT EXISTS posts_published ON posts(published);

CREATE TABLE IF NOT EXISTS tags (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL UNIQUE COLLATE NOCASE,
	created_on TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS post_tags (
	post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
	tag_id INTEGER NOT NULL REFERENCES tags(id),
	PRIMARY KEY (post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS forgots (
	id TEXT PRIMARY KEY,
	user_id INTEGER NOT NULL REFERENCES users(id),
	created_on TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
	id TEXT PRIMARY KEY,
	data TEXT NOT NULL,
	expires INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_expires ON sessions(expires);
`;

function now() {
	const d = new Date();
	return d.getFullYear() + '-' + zeroLeftMask(d.getMonth() + 1) + '-' + zeroLeftMask(d.getDate()) +
		'T' + zeroLeftMask(d.getHours()) + ':' + zeroLeftMask(d.getMinutes()) + ':' + zeroLeftMask(d.getSeconds());
}

function open() {
	if (global.db) return global.db;
	fs.mkdirSync(dataDir, { recursive: true });
	const db = new Database(dbPath);
	db.pragma('journal_mode = WAL');
	db.pragma('busy_timeout = 5000');
	db.pragma('foreign_keys = ON');
	db.exec(SCHEMA);
	global.db = db;
	return db;
}

function close() {
	if (global.db) {
		global.db.close();
		global.db = null;
	}
}

module.exports = { open, close, now, dbPath };
