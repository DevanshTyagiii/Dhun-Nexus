/// <reference path="./types/fastify.d.ts" />
import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth';
import { stemRoutes } from './routes/stems';
import { migrate } from './migrate';

dotenv.config();

const server = fastify({ logger: true });

// Register Plugins
server.register(cors, {
    origin: '*', // Allow all for now, lock down in prod
});

server.register(jwt, {
    secret: process.env.JWT_SECRET || 'supersecret',
});

// Decorator for Auth
server.decorate('authenticate', async function (request: any, reply: any) {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

server.register(authRoutes);
server.register(stemRoutes);

// Health Check
server.get('/ping', async (request, reply) => {
    return { pong: 'it works' };
});

// Start Server
const start = async () => {
    try {
        // Run Migration
        await migrate();

        const port = parseInt(process.env.PORT || '3001');
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on port ${port}`);

        console.log('DB Connected via SQLite (Async)');

    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
