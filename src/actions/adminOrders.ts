'use server';

import { prisma } from "@/lib/prisma";

export async function getAdminOrders() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: { product: true }
                }
            }
        });
        return orders;
    } catch (error) {
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED') {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status }
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al actualizar" };
    }
}
