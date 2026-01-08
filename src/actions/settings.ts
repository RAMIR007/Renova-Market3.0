'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    const whatsapp = formData.get('whatsapp') as string;

    try {
        if (whatsapp) {
            await prisma.systemSetting.upsert({
                where: { key: 'STORE_WHATSAPP' },
                update: { value: whatsapp },
                create: { key: 'STORE_WHATSAPP', value: whatsapp }
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

        // Handle Hardcoded Admin vs DB User
        if (token === 'admin_token_secure') {
            // Hardcoded admin cannot verify change via DB unless we insert the hardcoded admin INTO the DB first.
            // For now, let's block hardcoded admin from changing pass via UI, or prompt them to migrate.
            // Better approach: Find the admin by email 'admin@renova.cu' and update if exists.
            const adminUser = await prisma.user.findUnique({ where: { email: 'admin@renova.cu' } });
            if (adminUser) {
                userId = adminUser.id;
            } else {
                return { success: false, error: "El usuario Administrador inicial no puede cambiar su contraseña aquí. Crea un usuario admin real." };
            }
        } else {
            const session = JSON.parse(token);
            userId = session.id;
        }

        await prisma.user.update({
            where: { id: userId },
            data: { password: newPassword } // TODO: Hash this in production!
        });

        return { success: true };

    } catch (error) {
        console.error("Password change error:", error);
        return { success: false, error: "Error al cambiar la contraseña." };
    }
}
