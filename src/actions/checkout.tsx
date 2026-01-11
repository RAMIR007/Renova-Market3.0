'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
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

// ... imports
import bcrypt from "bcryptjs";

// ... types
interface CreateOrderInput {
    items: CartItem[];
    name: string;
    email: string;
    phone: string;
    address: string;
    total: number;
    password?: string;
    shouldRegister?: boolean;
}

export async function createOrder({
    items,
    name,
    email,
    phone,
    address,
    password,
    shouldRegister
}: CreateOrderInput): Promise<CheckoutResponse> {

    // Construct customerDetails internally
    const customerDetails = { name, email, phone, address };

    try {
        // Handle User Registration / Linking
        let userId: string | null = null;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            userId = existingUser.id;
            // Note: We don't auto-login existing users here for security (password not verified against existing), 
            // but we link the order.
        } else if (shouldRegister && password) {
            // Create new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword,
                    role: 'USER',
                    marketingOptIn: true // Default opt-in
                }
            });
            userId = newUser.id;

            // Auto-login new user
            const cookieStore = await cookies();
            cookieStore.set('session_token', JSON.stringify({
                id: newUser.id,
                role: newUser.role,
                name: newUser.name
            }), { httpOnly: true, path: '/' });
        }

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
            const cookieStore = await cookies();
            const referralCode = cookieStore.get('referral_code')?.value;

            const newOrder = await tx.order.create({
                data: {
                    status: 'PENDING',
                    total: total,
                    customerName: customerDetails.name,
                    customerEmail: customerDetails.email,
                    customerPhone: customerDetails.phone,
                    addressLine1: customerDetails.address,
                    referralCode: referralCode,
                    userId: userId, // Link to user if found/created
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
        // ... (Email logic kept simple/commented)

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
