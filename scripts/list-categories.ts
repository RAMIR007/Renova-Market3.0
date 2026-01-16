
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
    console.log('Starting script...');
    if (!connectionString) {
        console.error('DATABASE_URL is missing!');
        process.exit(1);
    }

    try {
        const url = new URL(connectionString);
        console.log(`DATABASE_URL protocol: ${url.protocol}`);
    } catch (e) {
        console.error('Invalid DATABASE_URL format');
    }

    try {
        const pool = new Pool({
            connectionString,
            ssl: true, // Matching src/lib/prisma.ts
        });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        console.log('Attempting to connect...');
        // Try a simple count
        const count = await prisma.category.count();
        console.log(`Counted ${count} categories.`);

        const categories = await prisma.category.findMany();
        console.log('Categories:', JSON.stringify(categories, null, 2));

        await prisma.$disconnect();
        await pool.end();
    } catch (error) {
        console.error('FATAL ERROR details:', error);
        process.exit(1);
    }
}

main();
