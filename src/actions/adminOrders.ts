'use server';

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-check";

export async function getAdminOrders() {
    await requireAdmin();
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
    await requireAdmin();
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
