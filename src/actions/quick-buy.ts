'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

interface QuickBuyData {
    productId: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerEmail?: string;
}

export async function processQuickBuy(data: QuickBuyData) {
    // Validar datos básicos
    if (!data.productId || !data.customerName || !data.customerPhone || !data.customerAddress) {
        return { success: false, error: "Faltan datos requeridos: Nombre, Teléfono y Dirección son obligatorios." };
    }

    try {
        const order = await prisma.$transaction(async (tx) => {
            // 1. Verificar Stock
            const product = await tx.product.findUnique({
                where: { id: data.productId }
            });

            if (!product) throw new Error("Producto no encontrado");
            if (product.stock < 1) throw new Error("Lo sentimos, este producto ya no está disponible.");

            // 2. Decrementar Stock / Reservar
            // Usamos 'as any' para evitar conflictos de tipos temporales si 'status' es un enum estricto
            await tx.product.update({
                where: { id: data.productId },
                data: {
                    stock: { decrement: 1 },
                    status: 'RESERVED'
                } as any
            });

            // 3. Crear Orden
            const cookieStore = await cookies();
            const referralCode = cookieStore.get('referral_code')?.value;

            // Intentar enlazar usuario si existe el email
            let userId = null;
            if (data.customerEmail) {
                const existingUser = await tx.user.findUnique({
                    where: { email: data.customerEmail }
                });
                if (existingUser) userId = existingUser.id;
            }

            const newOrder = await tx.order.create({
                data: {
                    status: 'PENDING',
                    total: product.price, // Asumimos cantidad 1 para compra rápida
                    customerName: data.customerName,
                    customerPhone: data.customerPhone,
                    addressLine1: data.customerAddress,
                    customerEmail: data.customerEmail || null,
                    referralCode: referralCode,
                    userId: userId,
                    items: {
                        create: [{
                            productId: product.id,
                            quantity: 1,
                            price: product.price
                        }]
                    }
                }
            });

            return { order: newOrder, product };
        });

        // Revalidaciones
        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/admin/orders");

        return {
            success: true,
            orderId: order.order.id,
            productName: order.product.name,
            total: Number(order.order.total)
        };

    } catch (error: any) {
        console.error("Quick Buy Error:", error);
        return { success: false, error: error.message || "Error al procesar la compra rápida" };
    }
}
