
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function testConfig(name: string, config: any) {
    console.log(`\n--- Testing ${name} ---`);
    const pool = new Pool({ connectionString, ...config });
    try {
        const client = await pool.connect();
        console.log(`${name}: Connected!`);
        const res = await client.query('SELECT 1');
        console.log(`${name}: Query success!`);
        client.release();
    } catch (e: any) {
        console.log(`${name}: Failed - ${e.message}`);
    } finally {
        await pool.end();
    }
}

async function main() {
    if (!connectionString) {
        console.log('No Connection String');
        return;
    }

    // Test 1: Implicit (from URL)
    await testConfig('Implicit SSL', {});

    // Test 2: Explicit ssl: true
    await testConfig('Explicit ssl: true', { ssl: true });

    // Test 3: Explicit ssl: rejectUnauthorized: false
    await testConfig('Explicit lax SSL', { ssl: { rejectUnauthorized: false } });
}

main();
