'use server';

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-check";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    await requireAdmin();
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

export async function deleteUser(userId: string) {
    await requireAdmin();
    try {
        await prisma.user.delete({
            where: { id: userId }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error deleting user' };
    }
}

export async function updateUserRole(userId: string, newRole: 'USER' | 'ADMIN' | 'SELLER') {
    await requireAdmin();
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { role: newRole }
        });
        revalidatePath('/admin/users');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Error updating user role' };
    }
}
