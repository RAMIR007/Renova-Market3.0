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
        // Transaction to handle stock updates if cancelling
        await prisma.$transaction(async (tx) => {
            // Update Order Status
            const order = await tx.order.update({
                where: { id: orderId },
                data: { status },
                include: { items: true }
            });

            // Logic for Cancelled Orders: Return Stock & Set Available
            if (status === 'CANCELLED') {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: { increment: item.quantity },
                            status: 'AVAILABLE'
                        }
                    });
                }
            }

            // Logic for Delivered (Sold) Orders: Mark as SOLD
            if (status === 'DELIVERED') {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: { status: 'SOLD' }
                    });
                }
            }
        });

        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al actualizar" };
    }
}
