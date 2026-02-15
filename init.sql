-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    region VARCHAR(50),
    xp INTEGER DEFAULT 0,
    jam_tokens INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stems Table
CREATE TABLE IF NOT EXISTS stems (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    bpm INTEGER,
    key_signature VARCHAR(20),
    genre VARCHAR(50),
    mood VARCHAR(50),
    audio_url VARCHAR(255) NOT NULL,
    cover_url VARCHAR(255),
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Layers Table
CREATE TABLE IF NOT EXISTS layers (
    id SERIAL PRIMARY KEY,
    parent_stem_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    audio_url VARCHAR(255) NOT NULL,
    type VARCHAR(20), -- 'vocal', 'instrument', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ForkTree Table (Graph structure for forks)
CREATE TABLE IF NOT EXISTS fork_tree (
    id SERIAL PRIMARY KEY,
    parent_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    child_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    depth INTEGER DEFAULT 0
);

-- Bounties Table
CREATE TABLE IF NOT EXISTS bounties (
    id SERIAL PRIMARY KEY,
    stem_id INTEGER REFERENCES stems(id) ON DELETE CASCADE,
    creator_id INTEGER REFERENCES users(id),
    reward_amount INTEGER NOT NULL,
    role_required VARCHAR(50),
    deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed', 'awarded'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- JamRooms Table
CREATE TABLE IF NOT EXISTS jam_rooms (
    id SERIAL PRIMARY KEY,
    host_id INTEGER REFERENCES users(id),
    name VARCHAR(100),
    active_users INTEGER DEFAULT 0,
    is_live BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
