"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db");
const SEED_STEMS = [
    {
        title: "Midnight Dhaba Vibes",
        artist: "trapproducer_mumbai", // Mock username, need to create user first or just string
        bpm: 140,
        key: "C-Minor",
        genre: "Sufi-Trap",
        likes: 2400,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=640&h=360&fit=crop"
    },
    {
        title: "Bollywood Phonk",
        artist: "desibeats_delhi",
        bpm: 95,
        key: "F-Major",
        genre: "Phonk",
        likes: 1800,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        coverUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=640&h=360&fit=crop"
    },
    {
        title: "Raga Digital Fusion",
        artist: "classicaltech_chennai",
        bpm: 128,
        key: "G-Minor",
        genre: "Fusion",
        likes: 3200,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=640&h=360&fit=crop"
    }
];
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, db_1.getDb)();
    // Create Dummy User
    try {
        yield db.run('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', 'admin', 'admin@dhunnexus.com', 'hash');
    }
    catch (e) {
        console.log('User likely exists');
    }
    // Insert Stems
    for (const stem of SEED_STEMS) {
        try {
            yield db.run('INSERT INTO stems (title, bpm, key_signature, genre, likes_count, audio_url, cover_url, owner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', stem.title, stem.bpm, stem.key, stem.genre, stem.likes, stem.audioUrl, stem.coverUrl, 1);
        }
        catch (e) {
            console.log('Stem error', e);
        }
    }
    console.log('Seeding complete');
});
seed();
