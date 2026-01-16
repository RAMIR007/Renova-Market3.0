
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const categories = await prisma.category.findMany({
        where: {
            name: {
                in: ['Ropa', 'ropa', 'Abrigos', 'abrigos', 'Monos', 'monos'],
                mode: 'insensitive',
            },
        },
    });

    console.log('Existing categories:', categories);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
