'use server';

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-check";

export async function getDashboardStats() {
    await requireAdmin();
    try {
        // 1. Total Revenue (from non-cancelled orders)
        // Since sqlite/postgres differences in decimal aggregation can be tricky, we fetch and sum or use aggregate if supported
        // Using Prisma aggregate:
        const revenue = await prisma.order.aggregate({
            _sum: {
                total: true
            },
            where: {
                status: { not: 'CANCELLED' }
            }
        });

        // 2. Active Orders (Pending or Processing)
        const activeOrders = await prisma.order.count({
            where: {
                status: { in: ['PENDING', 'PROCESSING'] }
            }
        });

        // 3. New Customers (Total Users for now, ideally filtering by creation date)
        // Let's just track Total Users with role USER
        const totalCustomers = await prisma.user.count({
            where: { role: 'USER' }
        });

        // 4. Products Count
        const productsCount = await prisma.product.count({
            where: { stock: { gt: 0 } }
        });

        return {
            revenue: Number(revenue._sum.total || 0),
            activeOrders,
            totalCustomers,
            productsCount
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            revenue: 0,
            activeOrders: 0,
            totalCustomers: 0,
            productsCount: 0
        };
    }
}
