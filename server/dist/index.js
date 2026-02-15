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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = require("./routes/auth");
const stems_1 = require("./routes/stems");
const migrate_1 = require("./migrate");
dotenv_1.default.config();
const server = (0, fastify_1.default)({ logger: true });
// Register Plugins
server.register(cors_1.default, {
    origin: '*', // Allow all for now, lock down in prod
});
server.register(jwt_1.default, {
    secret: process.env.JWT_SECRET || 'supersecret',
});
// Decorator for Auth
server.decorate('authenticate', function (request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield request.jwtVerify();
        }
        catch (err) {
            reply.send(err);
        }
    });
});
server.register(auth_1.authRoutes);
server.register(stems_1.stemRoutes);
// Health Check
server.get('/ping', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { pong: 'it works' };
}));
// Start Server
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Run Migration
        yield (0, migrate_1.migrate)();
        const port = parseInt(process.env.PORT || '3001');
        yield server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);
        console.log('DB Connected via SQLite (Async)');
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
