
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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

        // 2. Update/Create "Abrigos"
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

        // 3. Update/Create "Monos"
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

        return NextResponse.json({
            success: true,
            message: 'Categories updated successfully',
            data: { ropa, abrigos, monos }
        });
    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack
        }, { status: 200 });
    }
}
