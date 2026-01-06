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
