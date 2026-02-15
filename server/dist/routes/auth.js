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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../db");
const types_1 = require("../types");
const zod_1 = require("zod");
function authRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.post('/auth/register', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = types_1.UserSchema.parse(request.body);
                const db = yield (0, db_1.getDb)();
                // Check existing
                const existing = yield db.get('SELECT * FROM users WHERE email = ? OR username = ?', body.email, body.username);
                if (existing) {
                    return reply.code(400).send({ error: 'User already exists' });
                }
                const hash = yield bcrypt_1.default.hash(body.password, 10);
                const result = yield db.run('INSERT INTO users (username, email, password_hash, region) VALUES (?, ?, ?, ?)', body.username, body.email, hash, body.region || 'India');
                const user = yield db.get('SELECT id, username, email, jam_tokens FROM users WHERE id = ?', result.lastID);
                const token = server.jwt.sign({ id: user.id, username: user.username });
                return { user, token };
            }
            catch (err) {
                if (err instanceof zod_1.z.ZodError) {
                    return reply.code(400).send({ error: err.issues });
                }
                server.log.error(err);
                return reply.code(500).send({ error: 'Internal Server Error' });
            }
        }));
        server.post('/auth/login', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = types_1.LoginSchema.parse(request.body);
                const db = yield (0, db_1.getDb)();
                const user = yield db.get('SELECT * FROM users WHERE email = ?', body.email);
                if (!user || !(yield bcrypt_1.default.compare(body.password, user.password_hash))) {
                    return reply.code(401).send({ error: 'Invalid credentials' });
                }
                const token = server.jwt.sign({ id: user.id, username: user.username });
                const { password_hash } = user, safeUser = __rest(user, ["password_hash"]);
                return { user: safeUser, token };
            }
            catch (err) {
                server.log.error(err);
                return reply.code(500).send({ error: 'Internal Server Error' });
            }
        }));
        server.get('/auth/me', {
            onRequest: [server.authenticate]
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            const user = request.user;
            const db = yield (0, db_1.getDb)();
            const dbUser = yield db.get('SELECT id, username, email, region, xp, jam_tokens FROM users WHERE id = ?', user.id);
            return dbUser;
        }));
    });
}
