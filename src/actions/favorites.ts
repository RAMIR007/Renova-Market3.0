'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function toggleFavorite(productId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
        return { error: "Debes iniciar sesión para usar la Lista de Deseos." };
    }

    try {
        const session = JSON.parse(sessionToken);
        const userId = session.id;

        const existing = await prisma.favorite.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        let isFavorite = false;

        if (existing) {
            await prisma.favorite.delete({
                where: { id: existing.id }
            });
            isFavorite = false;
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    productId
                }
            });
            isFavorite = true;
        }

        revalidatePath('/');
        return { success: true, isFavorite };
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { error: "Error de servidor al guardar favorito." };
    }
}

export async function getFavorites() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) return [];

    try {
        const session = JSON.parse(sessionToken);
        const userId = session.id;

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            select: { productId: true }
        });

        return favorites.map(f => f.productId);
    } catch (error) {
        return [];
    }
}

export async function getFavoriteProducts() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) return [];

    try {
        const session = JSON.parse(sessionToken);
        const userId = session.id;

        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                product: {
                    include: {
                        category: true // needed for card
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return favorites.map(f => f.product);
    } catch (error) {
        console.error("Error fetching favorite products:", error);
        return [];
    }
}
