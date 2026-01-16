'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
    try {
        return await prisma.category.findMany({
            orderBy: { name: 'asc' },
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

export async function createCategory(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const parentId = formData.get('parentId') as string;

    if (!name) return { success: false, error: "El nombre es obligatorio" };

    try {
        await prisma.category.create({
            data: {
                name,
                description,
                image: image || null,
                parentId: parentId || null,
                slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            }
        });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al crear categoría" };
    }
}

export async function updateCategory(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image = formData.get('image') as string;
    const parentId = formData.get('parentId') as string;

    if (!id || !name) return { success: false, error: "ID y nombre son obligatorios" };

    try {
        await prisma.category.update({
            where: { id },
            data: {
                name,
                description,
                image: image || null,
                parentId: parentId || null,
                slug: name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
            }
        });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al actualizar la categoría" };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({ where: { id } });
        revalidatePath('/admin/categories');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Error al eliminar" };
    }
}
