'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-check";

export async function getSystemSettings() {
    try {
        const settings = await prisma.systemSetting.findMany();
        return settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        return {};
    }
}

export async function updateSystemSettings(formData: FormData) {
    await requireAdmin();
    const whatsapp = formData.get('whatsapp') as string;

    try {
        if (whatsapp) {
            await prisma.systemSetting.upsert({
                where: { key: 'STORE_WHATSAPP' },
                update: { value: whatsapp },
                create: { key: 'STORE_WHATSAPP', value: whatsapp }
            });
        }

        const deliveryPrice = formData.get('deliveryPricePerKm') as string;
        if (deliveryPrice) {
            await prisma.systemSetting.upsert({
                where: { key: 'DELIVERY_PRICE_PER_KM' },
                update: { value: deliveryPrice },
                create: { key: 'DELIVERY_PRICE_PER_KM', value: deliveryPrice }
            });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/'); // Revalidate home for the link
        return { success: true };
    } catch (error) {
        console.error("Settings error:", error);
        return { success: false, error: "Error al guardar configuración" };
    }
}

export async function changePassword(formData: FormData) {
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Get user from session cookie
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) return { success: false, error: "No autorizado" };

    // Validate inputs
    if (!newPassword || newPassword.length < 6) {
        return { success: false, error: "La contraseña debe tener al menos 6 caracteres." };
    }
    if (newPassword !== confirmPassword) {
        return { success: false, error: "Las contraseñas no coinciden." };
    }

    try {
        let userId = '';

        // Handle Token
        if (token === 'admin_token_secure') {
            // If user somehow still has this old token, tell them to relogin
            return { success: false, error: "Sesión antigua. Por favor cierra sesión y vuelve a entrar." };
        } else {
            const session = JSON.parse(token);
            userId = session.id;
        }

        // Hash the new password
        const bcrypt = (await import("bcryptjs")).default;
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });

        return { success: true };

    } catch (error) {
        console.error("Password change error:", error);
        return { success: false, error: "Error al cambiar la contraseña." };
    }
}
