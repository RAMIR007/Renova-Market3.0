
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DATABASE_URL;

async function main() {
    console.log('Using standard Prisma Client (no adapter)...');

    // Initialize without adapter, passing URL explicitly
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
    });

    try {
        console.log('Connecting...');

        // 1. Ensure "Ropa"
        console.log('Upserting Ropa...');
        const ropa = await prisma.category.upsert({
            where: { name: 'Ropa' },
            update: {},
            create: {
                name: 'Ropa',
                slug: 'ropa',
                description: 'Categoría principal de ropa',
            },
        });
        console.log('Ropa ID:', ropa.id);

        // 2. Abrigos
        console.log('Upserting Abrigos...');
        const abrigos = await prisma.category.upsert({
            where: { name: 'Abrigos' },
            update: { parentId: ropa.id },
            create: {
                name: 'Abrigos',
                slug: 'abrigos',
                description: 'Abrigos y chaquetas',
                parentId: ropa.id,
            },
        });
        console.log('Abrigos updated.');

        // 3. Monos
        console.log('Upserting Monos...');
        const monos = await prisma.category.upsert({
            where: { name: 'Monos' },
            update: { parentId: ropa.id },
            create: {
                name: 'Monos',
                slug: 'monos',
                description: 'Monos y enterizos',
                parentId: ropa.id,
            },
        });
        console.log('Monos updated.');

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
