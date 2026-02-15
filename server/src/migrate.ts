import fs from 'fs';
import path from 'path';
import { getDb } from './db';

export const migrate = async () => {
    try {
        const db = await getDb();
        const schemaPath = path.join(__dirname, '../init_sqlite.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        await db.exec(schema);
        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    migrate();
}
