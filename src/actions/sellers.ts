'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSeller(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const referralCode = formData.get('referralCode') as string;
    const role = (formData.get('role') as 'SELLER' | 'ADMIN') || 'SELLER';

    if (!name || !email) {
        return { success: false, error: 'Faltan campos requeridos' };
    }
    // referralCode mandatory only for sellers? Let's keep it generally consistent or optional for admins.
    // For now, mandating it as unique identifier/username extension isn't bad.

    try {
        console.log("Creating user:", { name, email, role });
        await prisma.user.create({
            data: {
                name,
                email,
                password: 'temp_password_123', // In a real app, send invite email
                role: role,
                whatsapp: phone,
                referralCode: referralCode?.toUpperCase() || null, // Optional for Admin potentially
            }
        });

        revalidatePath('/admin/sellers');
        return { success: true };
    } catch (error: any) {
        console.error("Error creating seller:", error);
        if (error.code === 'P2002') { // Unique constraint violation
            return { success: false, error: 'El email o código de referido ya existe.' };
        }
        return { success: false, error: 'Error al crear vendedor: ' + (error.message || error) };
    }
}

export async function getSellers() {
    try {
        return await prisma.user.findMany({
            where: { role: { in: ['ADMIN', 'SELLER'] } },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    // @ts-ignore
                    select: { products: true }
                }
            }
        });
    } catch (error) {
        return [];
    }
}
