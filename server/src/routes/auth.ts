import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { getDb } from '../db';
import { UserSchema, LoginSchema, User } from '../types';
import { z } from 'zod';

export async function authRoutes(server: FastifyInstance) {

    server.post('/auth/register', async (request, reply) => {
        try {
            const body = UserSchema.parse(request.body);
            const db = await getDb();

            // Check existing
            const existing = await db.get('SELECT * FROM users WHERE email = ? OR username = ?', body.email, body.username);
            if (existing) {
                return reply.code(400).send({ error: 'User already exists' });
            }

            const hash = await bcrypt.hash(body.password, 10);

            const result = await db.run(
                'INSERT INTO users (username, email, password_hash, region) VALUES (?, ?, ?, ?)',
                body.username, body.email, hash, body.region || 'India'
            );

            const user = await db.get('SELECT id, username, email, jam_tokens FROM users WHERE id = ?', result.lastID);

            const token = server.jwt.sign({ id: user.id, username: user.username });

            return { user, token };

        } catch (err) {
            if (err instanceof z.ZodError) {
                return reply.code(400).send({ error: err.issues });
            }
            server.log.error(err);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    });

    server.post('/auth/login', async (request, reply) => {
        try {
            const body = LoginSchema.parse(request.body);
            const db = await getDb();

            const user = await db.get('SELECT * FROM users WHERE email = ?', body.email);

            if (!user || !(await bcrypt.compare(body.password, user.password_hash))) {
                return reply.code(401).send({ error: 'Invalid credentials' });
            }

            const token = server.jwt.sign({ id: user.id, username: user.username });

            const { password_hash, ...safeUser } = user;

            return { user: safeUser, token };

        } catch (err) {
            server.log.error(err);
            return reply.code(500).send({ error: 'Internal Server Error' });
        }
    });

    server.get('/auth/me', {
        onRequest: [server.authenticate]
    }, async (request, reply) => {
        const user = request.user as any;
        const db = await getDb();
        const dbUser = await db.get('SELECT id, username, email, region, xp, jam_tokens FROM users WHERE id = ?', user.id);
        return dbUser;
    });
}
