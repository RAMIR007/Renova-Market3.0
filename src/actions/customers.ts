'use server';

import { prisma } from "@/lib/prisma";

export async function getCustomers() {
    try {
        // We get customers from unique emails in Orders since we allow guest checkout
        const orders = await prisma.order.findMany({
            select: {
                customerEmail: true,
                customerName: true,
                createdAt: true,
                total: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const customersMap = new Map();

        orders.forEach(order => {
            if (order.customerEmail) {
                if (!customersMap.has(order.customerEmail)) {
                    customersMap.set(order.customerEmail, {
                        email: order.customerEmail,
                        name: order.customerName,
                        totalOrders: 0,
                        totalSpent: 0,
                        lastOrderDate: order.createdAt
                    });
                }
                const customer = customersMap.get(order.customerEmail);
                customer.totalOrders += 1;
                customer.totalSpent += Number(order.total);
            }
        });

        // Also fetch registered users
        const registeredUsers = await prisma.user.findMany({
            where: { role: 'USER' }
        });

        // Merge strategies (simplified): Just list guest customer profiles for now as that's where the data is
        return Array.from(customersMap.values());
    } catch (error) {
        return [];
    }
}
