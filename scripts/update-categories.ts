
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const connectionString = process.env.DATABASE_URL;

async function main() {
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
    }

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    console.log('Connected to database');

    try {
        // 1. Ensure "Ropa" category exists
        const ropa = await prisma.category.upsert({
            where: { name: 'Ropa' },
            update: {},
            create: {
                name: 'Ropa',
                slug: 'ropa',
                description: 'Categoría principal de ropa',
            },
        });
        console.log('Category "Ropa" ready:', ropa.id);

        // 2. Update/Create "Abrigos" as child of "Ropa"
        // First check if it exists to preserve potential existing data other than parentId
        const abrigos = await prisma.category.upsert({
            where: { name: 'Abrigos' },
            update: {
                parentId: ropa.id,
            },
            create: {
                name: 'Abrigos',
                slug: 'abrigos',
                description: 'Abrigos y chaquetas',
                parentId: ropa.id,
            },
        });
        console.log('Category "Abrigos" updated as child of "Ropa":', abrigos.id);

        // 3. Update/Create "Monos" as child of "Ropa"
        const monos = await prisma.category.upsert({
            where: { name: 'Monos' },
            update: {
                parentId: ropa.id,
            },
            create: {
                name: 'Monos',
                slug: 'monos',
                description: 'Monos y enterizos',
                parentId: ropa.id,
            },
        });
        console.log('Category "Monos" updated as child of "Ropa":', monos.id);

    } catch (error) {
        console.error('Error updating categories:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
