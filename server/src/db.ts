import * as sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

let dbInstance: Database | null = null;

export const getDb = async () => {
    if (dbInstance) return dbInstance;

    const dbPath = process.env.DB_PATH || path.join(__dirname, '../dhunnexus.sqlite');

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    return dbInstance;
};
