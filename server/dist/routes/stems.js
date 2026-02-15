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
exports.stemRoutes = stemRoutes;
const db_1 = require("../db");
function stemRoutes(server) {
    return __awaiter(this, void 0, void 0, function* () {
        server.get('/stems', (request, reply) => __awaiter(this, void 0, void 0, function* () {
            try {
                const db = yield (0, db_1.getDb)();
                const stems = yield db.all('SELECT * FROM stems ORDER BY likes_count DESC LIMIT 20');
                return stems;
            }
            catch (err) {
                server.log.error(err);
                return reply.code(500).send({ error: 'Internal Server Error' });
            }
        }));
        server.post('/stems', {
            onRequest: [server.authenticate]
        }, (request, reply) => __awaiter(this, void 0, void 0, function* () {
            // ... (Implement upload logic later, need multipart support)
            return { status: 'implemented later' };
        }));
    });
}
