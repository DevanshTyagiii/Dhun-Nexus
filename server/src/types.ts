import { z } from 'zod';

export const UserSchema = z.object({
    id: z.number().optional(),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6),
    region: z.string().optional(),
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginSchema>;
