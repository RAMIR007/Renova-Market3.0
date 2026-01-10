'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { Resend } from 'resend';
// We use dynamic import for react-pdf to avoid some build-time server/client conflicts in certain setups, 
// though standard import works in many Next.js App Router cases.

export type CartItem = {
    productId: string;
    quantity: number;
    price: number;
}

export type CheckoutResponse = {
    success: boolean;
    orderId?: string;
    error?: string;
}

interface CreateOrderInput {
    items: CartItem[];
    name: string;
    email: string;
    phone: string;
    address: string;
    total: number;
}

export async function createOrder({
    items,
    name,
    email,
    phone,
    address
}: CreateOrderInput): Promise<CheckoutResponse> {

    // Construct customerDetails internally
    const customerDetails = { name, email, phone, address };

    try {
        // Store product details for the email/PDF later
        const purchasedItems: { name: string; quantity: number; price: number }[] = [];

        // Use an interactive transaction to handle concurrency and ensure atomic stock updates
        const order = await prisma.$transaction(async (tx) => {
            let total = 0;

            // 1. Validate stock and calculate total for ALL items first
            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                })

                if (!product) {
                    throw new Error(`Producto no encontrado: ${item.productId}`)
                }

                if (product.stock < item.quantity) {
                    throw new Error(`¡Lo sentimos! El producto "${product.name}" se acaba de agotar.`)
                }

                total += Number(product.price) * item.quantity;
                purchasedItems.push({
                    name: product.name,
                    quantity: item.quantity,
                    price: Number(product.price)
                });

                // 2. Reserve Product (Decrement stock AND set status)
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        status: 'RESERVED'
                    } as any
                })
            }

            // 3. Create the Order Record
            const newOrder = await tx.order.create({
                data: {
                    status: 'PENDING',
                    total: total,
                    customerName: customerDetails.name,
                    customerEmail: customerDetails.email,
                    customerPhone: customerDetails.phone,
                    addressLine1: customerDetails.address,
                    items: {
                        create: items.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price
                        }))
                    }
                }
            })

            return newOrder
        })

        // 4. Post-Sale Experience: Email & PDF (Async try-catch)
        // ... (Email logic kept simple/commented if dependencies are tricky, or restored)

        // Revalidate paths
        revalidatePath("/")
        revalidatePath("/shop")
        revalidatePath("/admin/products")

        return { success: true, orderId: order.id }

    } catch (e: any) {
        console.error("Checkout Error:", e)
        return { success: false, error: e.message }
    }
}
