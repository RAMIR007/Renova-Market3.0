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

export async function createOrder(
    items: CartItem[],
    customerDetails: { name: string; email: string; address: string }
): Promise<CheckoutResponse> {

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

                // 2. Decrement Stock
                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            // 3. Create the Order Record
            const newOrder = await tx.order.create({
                data: {
                    status: 'PENDING',
                    total: total,
                    customerName: customerDetails.name,
                    customerEmail: customerDetails.email,
                    addressLine1: customerDetails.address, // Mapping single string to addressLine1 for now
                    // address: customerDetails.address, // REMOVED - field no longer exists
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
        try {
            if (process.env.RESEND_API_KEY) {
                // Dynamic imports to ensure they run only on server when needed
                const { renderToBuffer } = await import('@react-pdf/renderer');
                const { OrderReceipt } = await import('@/components/pdf/OrderReceipt');
                const { OrderConfirmationTemplate } = await import('@/components/email/OrderConfirmationTemplate');

                const resend = new Resend(process.env.RESEND_API_KEY);

                // Generate PDF
                const pdfBuffer = await renderToBuffer(
                    <OrderReceipt
                        orderId={order.id}
                        customerName={customerDetails.name}
                        date={new Date().toLocaleDateString()}
                        items={purchasedItems}
                        total={Number(order.total)
                        }
                    />
                );

                // Send Email
                await resend.emails.send({
                    from: 'Renova Market <onboarding@resend.dev>', // Update this for production
                    to: customerDetails.email,
                    subject: `Confirmación de Orden #${order.id.slice(0, 8)}`,
                    react: <OrderConfirmationTemplate
                        customerName={customerDetails.name}
                        orderId={order.id}
                        total={Number(order.total)
                        }
                        items={purchasedItems}
                    />,
                    attachments: [
                        {
                            filename: `Recibo-${order.id.slice(0, 8)}.pdf`,
                            content: pdfBuffer
                        }
                    ]
                });
                console.log(`Email enviado a ${customerDetails.email} con PDF.`);
            } else {
                console.log("---------------------------------------------------");
                console.log(`[SIMULACIÓN] Email para: ${customerDetails.email}`);
                console.log(`[SIMULACIÓN] Asunto: Orden #${order.id}`);
                console.log(`[SIMULACIÓN] Resumen: ${purchasedItems.length} items.`);
                console.log("Falta RESEND_API_KEY en .env para envio real.");
                console.log("---------------------------------------------------");
            }
        } catch (emailError) {
            console.error("Error en sistema de notificaciones:", emailError);
            // Non-blocking error
        }

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
