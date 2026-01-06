'use server';

import { prisma } from "@/lib/prisma";

export async function getAnalyticsData() {
    try {
        const [totalRevenue, totalOrders, totalProducts, lowStockProducts] = await Promise.all([
            // Total Revenue
            prisma.order.aggregate({
                _sum: { total: true },
                where: { status: { not: 'CANCELLED' } }
            }),
            // Total Orders
            prisma.order.count(),
            // Total Products
            prisma.product.count(),
            // Low Stock Warning
            prisma.product.count({
                where: { stock: { lt: 2 } } // Assuming 1 is normal for unique, 0 is sold out
            })
        ]);

        // Recent Sales
        const recentSales = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                total: true,
                customerName: true,
                createdAt: true,
                status: true
            }
        });

        // Top Selling Categories (Simplified)
        // Prisma doesn't do deep relation aggregation easily in one query, so we might skip or do raw query
        // For MVP, returning key stats
        return {
            revenue: Number(totalRevenue._sum.total || 0),
            orders: totalOrders,
            products: totalProducts,
            lowStock: lowStockProducts,
            recentSales: recentSales.map(sale => ({ ...sale, total: Number(sale.total) }))
        };

    } catch (error) {
        console.error("Analytics Error:", error);
        return null;
    }
}
