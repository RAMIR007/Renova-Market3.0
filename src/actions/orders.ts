'use server';

import { prisma } from "@/lib/prisma";

export async function getOrdersByEmail(email: string) {
    if (!email) return { success: false, error: "Email requerido" };

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                orders: {
                    include: {
                        items: {
                            include: {
                                product: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!user) {
            return { success: false, error: "No se encontraron órdenes para este correo." };
        }

        return { success: true, orders: user.orders };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return { success: false, error: "Error al buscar las órdenes." };
    }
}


export async function getOrderById(orderId: string) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        return order;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
}
