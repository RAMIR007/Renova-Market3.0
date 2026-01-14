'use server';

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-check";

export async function getDashboardStats() {
    await requireAdmin();
    try {
        // 1. Fetch data for Revenue and Profit calculation
        const orders = await prisma.order.findMany({
            where: { status: { not: 'CANCELLED' } },
            include: {
                items: {
                    include: {
                        product: {
                            select: { cost: true }
                        }
                    }
                }
            }
        });

        let revenue = 0;
        let totalCost = 0;

        orders.forEach(order => {
            revenue += Number(order.total);
            order.items.forEach(item => {
                const itemCost = item.product.cost ? Number(item.product.cost) : 0;
                totalCost += itemCost * item.quantity;
            });
        });

        const netProfit = revenue - totalCost;

        // 2. Active Orders
        const activeOrders = await prisma.order.count({
            where: {
                status: { in: ['PENDING', 'PROCESSING'] }
            }
        });

        // 3. Total Customers
        const totalCustomers = await prisma.user.count({
            where: { role: 'USER' }
        });

        // 4. Products Count
        const productsCount = await prisma.product.count({
            where: { stock: { gt: 0 } }
        });

        // 5. Visits (Page Views)
        const visitsAgg = await prisma.dailyStat.aggregate({
            _sum: { views: true }
        });
        const totalVisits = visitsAgg._sum.views || 0;

        // 6. Clicks
        const totalClicks = await prisma.analyticsEvent.count({
            where: {
                type: {
                    in: ['click', 'CLICK'] // Handle case variations
                }
            }
        });

        return {
            revenue,
            netProfit,
            activeOrders,
            totalCustomers,
            productsCount,
            totalVisits,
            totalClicks
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return {
            revenue: 0,
            netProfit: 0,
            activeOrders: 0,
            totalCustomers: 0,
            productsCount: 0,
            totalVisits: 0,
            totalClicks: 0
        };
    }
}
