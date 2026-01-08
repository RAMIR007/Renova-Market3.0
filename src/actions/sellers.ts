'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createSeller(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const referralCode = formData.get('referralCode') as string;

    if (!name || !email || !referralCode) {
        return { success: false, error: 'Faltan campos requeridos' };
    }

    try {
        console.log("Creating seller:", { name, email, phone, referralCode });
        await prisma.user.create({
            data: {
                name,
                email,
                password: 'temp_password_123', // In a real app, send invite email
                role: 'SELLER', // Make sure this enum exists in DB
                whatsapp: phone,
                referralCode: referralCode.toUpperCase(),
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
            where: { role: 'SELLER' },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
    } catch (error) {
        return [];
    }
}
