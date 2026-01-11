'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getReferrralStats() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) return null;

    try {
        const session = JSON.parse(token);
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { referralCode: true, role: true }
        });

        if (!user || !user.referralCode) return null;

        // Fetch orders referred by this user
        const orders = await prisma.order.findMany({
            where: {
                referralCode: user.referralCode,
                status: { not: 'CANCELLED' } // Don't count cancelled orders
            },
            select: {
                id: true,
                total: true,
                createdAt: true,
                status: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalSales = orders.length;
        const totalRevenue = orders.reduce((acc, order) => acc + Number(order.total), 0);

        // Simple commission calculation (e.g., 10% - this could be dynamic later)
        const commissionRate = 0.10;
        const totalCommission = totalRevenue * commissionRate;

        // Recent sales (last 5)
        const recentSales = orders.slice(0, 5);

        return {
            totalSales,
            totalRevenue,
            totalCommission,
            recentSales
        };

    } catch (e) {
        console.error("Error fetching referral stats:", e);
        return null;
    }
}
