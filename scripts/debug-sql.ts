
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
    if (!connectionString) {
        console.error('DATABASE_URL missing');
        process.exit(1);
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
    });

    try {
        const client = await pool.connect();
        console.log('Connected via pg directly!');

        // List tables
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Tables:', res.rows.map(r => r.table_name));

        // Check Category table content basics
        // Note: Prisma usually uses TitleCase for models, so table name might be "Category"
        try {
            const catRes = await client.query('SELECT id, name, slug, "parentId" FROM "Category" LIMIT 5');
            console.log('Categories sample:', catRes.rows);
        } catch (e) {
            console.log('Could not query "Category" (quoted). Trying lower case...');
            try {
                const catRes2 = await client.query('SELECT id, name, slug, "parentId" FROM category LIMIT 5');
                console.log('Categories sample (lowercase):', catRes2.rows);
            } catch (e2) {
                console.log('Could not query category table.');
            }
        }

        client.release();
    } catch (err) {
        console.error('PG Connect Error:', err);
    } finally {
        await pool.end();
    }
}

main();
