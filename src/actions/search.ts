'use server';

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
    if (!query || query.length < 2) return [];

    try {
        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                    { category: { name: { contains: query, mode: 'insensitive' } } }
                ],
                stock: { gt: 0 } // Only show available products
            },
            select: {
                id: true,
                name: true,
                slug: true,
                price: true,
                images: true,
                category: {
                    select: { name: true }
                }
            },
            take: 5 // Limit suggestions
        });

        return products;
    } catch (error) {
        console.error("Search error:", error);
        return [];
    }
}
