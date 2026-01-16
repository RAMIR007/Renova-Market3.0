'use server';

import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function getSalesChartData() {
    // Get last 30 days
    const end = new Date();
    const start = subDays(startOfDay(end), 30);

    const orders = await prisma.order.findMany({
        where: {
            createdAt: {
                gte: start
            },
            status: { in: ['COMPLETED', 'DELIVERED', 'PAID', 'PENDING'] } // Include PENDING for now as sales, adjust if needed
        },
        select: {
            createdAt: true,
            total: true
        }
    });

    // Group by day
    const groupedData = new Map<string, number>();

    // Initialize all days with 0
    for (let i = 0; i <= 30; i++) {
        const date = subDays(end, i);
        const key = format(date, 'MMM dd'); // e.g., "Jan 15"
        if (!groupedData.has(key)) {
            groupedData.set(key, 0);
        }
    }

    // Sum totals
    orders.forEach(order => {
        const key = format(order.createdAt, 'MMM dd');
        const current = groupedData.get(key) || 0;
        groupedData.set(key, current + Number(order.total));
    });

    // Convert to array and reverse (oldest to newest)
    const data = Array.from(groupedData.entries())
        .map(([date, sales]) => ({ date, sales }))
        .reverse();

    return data;
}
