-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    region TEXT,
    xp INTEGER DEFAULT 0,
    jam_tokens INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Stems Table
CREATE TABLE IF NOT EXISTS stems (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    bpm INTEGER,
    key_signature TEXT,
    genre TEXT,
    mood TEXT,
    audio_url TEXT NOT NULL,
    cover_url TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Layers Table
CREATE TABLE IF NOT EXISTS layers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_stem_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    audio_url TEXT NOT NULL,
    type TEXT, -- 'vocal', 'instrument', etc.
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ForkTree Table
CREATE TABLE IF NOT EXISTS fork_tree (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    parent_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    child_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    depth INTEGER DEFAULT 0
);

-- Bounties Table
CREATE TABLE IF NOT EXISTS bounties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    stem_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    creator_id INTEGER REFERENCES users(id),
    reward_amount INTEGER NOT NULL,
    role_required TEXT,
    deadline DATETIME,
    status TEXT DEFAULT 'open', -- 'open', 'closed', 'awarded'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- JamRooms Table
CREATE TABLE IF NOT EXISTS jam_rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    host_id INTEGER REFERENCES users(id),
    name TEXT,
    active_users INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
