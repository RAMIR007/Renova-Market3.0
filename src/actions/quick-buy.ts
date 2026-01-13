'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import bcrypt from 'bcryptjs';

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
        const result = await prisma.$transaction(async (tx) => {
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

            // 3. User Handling (Auto-Registration)
            let userId = null;
            let tempPassword = null;
            let isNewUser = false;

            if (data.customerEmail) {
                const existingUser = await tx.user.findUnique({
                    where: { email: data.customerEmail }
                });

                if (existingUser) {
                    userId = existingUser.id;
                } else {
                    // Create new user automatically
                    // Password = digits of phone number or fallback
                    tempPassword = data.customerPhone.replace(/\D/g, '');
                    if (tempPassword.length < 6) tempPassword = "renova-market";

                    const hashedPassword = await bcrypt.hash(tempPassword, 10);

                    const newUser = await tx.user.create({
                        data: {
                            email: data.customerEmail,
                            name: data.customerName,
                            password: hashedPassword,
                            role: 'USER',
                            marketingOptIn: true
                        }
                    });
                    userId = newUser.id;
                    isNewUser = true;

                    // Also create the address record for them
                    await tx.address.create({
                        data: {
                            userId: newUser.id,
                            street: data.customerAddress,
                            city: "La Habana",
                            province: "La Habana",
                            phone: data.customerPhone,
                            country: "Cuba",
                            isDefault: true
                        }
                    });
                }
            }

            // 4. Crear Orden
            const cookieStore = await cookies();
            const referralCode = cookieStore.get('referral_code')?.value;

            const newOrder = await tx.order.create({
                data: {
                    status: 'PENDING',
                    total: product.price,
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

            return { order: newOrder, product, userId, isNewUser, tempPassword };
        });

        // Auto-login logic (outside transaction)
        if (result.userId) {
            const cookieStore = await cookies();
            cookieStore.set('session_token', JSON.stringify({
                id: result.userId,
                role: 'USER',
                name: data.customerName
            }), { httpOnly: true, path: '/' });
        }

        // Revalidaciones
        revalidatePath("/");
        revalidatePath("/shop");
        revalidatePath("/admin/orders");

        return {
            success: true,
            orderId: result.order.id,
            productName: result.product.name,
            total: Number(result.order.total),
            isNewUser: result.isNewUser,
            tempPassword: result.tempPassword
        };

    } catch (error: any) {
        console.error("Quick Buy Error:", error);
        return { success: false, error: error.message || "Error al procesar la compra rápida" };
    }
}
