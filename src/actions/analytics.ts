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
                where: { stock: { lt: 2 } }
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

        // Traffic Stats (Last 30 Days)
        const dailyTraffic = await prisma.dailyStat.findMany({
            take: 30,
            orderBy: { date: 'asc' }
        });

        // Interaction Stats
        const totalClicks = await (prisma as any).analyticsEvent.count({
            where: { type: 'CLICK' }
        });

        const topActions = await (prisma as any).analyticsEvent.groupBy({
            by: ['target'],
            where: { type: 'CLICK' },
            _count: { target: true },
            orderBy: { _count: { target: 'desc' } },
            take: 5
        });

        return {
            revenue: Number(totalRevenue._sum.total || 0),
            orders: totalOrders,
            products: totalProducts,
            lowStock: lowStockProducts,
            recentSales: recentSales.map(sale => ({ ...sale, total: Number(sale.total) })),
            traffic: dailyTraffic.map(d => ({
                date: d.date.toISOString().split('T')[0],
                views: d.views
            })),
            totalClicks,
            topActions: topActions.map(({ target, _count }: { target: string, _count: { target: number } }) => ({
                target: target,
                count: _count.target
            }))
        };

    } catch (error) {
        console.error("Analytics Error:", error);
        return null;
    }
}
