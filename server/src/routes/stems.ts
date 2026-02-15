import { FastifyInstance } from 'fastify';
import { getDb } from '../db';
import { z } from 'zod';

export async function stemRoutes(server: FastifyInstance) {

    server.get('/stems', async (request, reply) => {
        try {
            const db = await getDb();
            const stems = await db.all('SELECT * FROM stems ORDER BY likes_count DESC LIMIT 20');
            return stems;
        } catch (err) {
            server.log.error(err);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    });

    server.post('/stems', {
        onRequest: [server.authenticate]
    }, async (request, reply) => {
        // ... (Implement upload logic later, need multipart support)
        return { status: 'implemented later' };
    });
}
