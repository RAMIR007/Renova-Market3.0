'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth-check"

export async function createProduct(formData: FormData) {
    await requireAdmin();
    const name = formData.get("name") as string
    const description = formData.get("description") as string | null
    const price = parseFloat(formData.get("price") as string)
    const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null
    const categoryId = formData.get("categoryId") as string
    const stock = parseInt(formData.get("stock") as string, 10)
    const size = formData.get("size") as string
    const color = formData.get("color") as string
    const brand = formData.get("brand") as string
    const model = formData.get("model") as string
    const condition = formData.get("condition") as "NUEVO" | "EXCELENTE" | "BUENO" | "USADO"
    // Handle multiple images
    const images = formData.getAll("images") as string[];

    // New finance fields
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null
    const sellerProfit = formData.get("sellerProfit") ? parseFloat(formData.get("sellerProfit") as string) : null

    // Generate slug from name
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now()

    const product = await prisma.product.create({
        data: {
            name,
            slug,
            description,
            price,
            compareAtPrice,
            stock,
            categoryId,
            size,
            color,
            brand,
            model,
            condition,
            cost,
            sellerProfit,
            images: images,
            featured: false
        }
    })

    await import("@/lib/audit").then(m => m.createAuditLog(
        "CREATE_PRODUCT",
        "Product",
        product.id,
        { name, price, stock }
    ));

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
    await requireAdmin();
    const name = formData.get("name") as string
    const description = formData.get("description") as string | null
    const price = parseFloat(formData.get("price") as string)
    const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null
    const categoryId = formData.get("categoryId") as string
    const stock = parseInt(formData.get("stock") as string, 10)
    const size = formData.get("size") as string
    const color = formData.get("color") as string
    const brand = formData.get("brand") as string
    const model = formData.get("model") as string
    const condition = formData.get("condition") as "NUEVO" | "EXCELENTE" | "BUENO" | "USADO"
    // Handle multiple images
    const images = formData.getAll("images") as string[];

    // Note: We are NOT updating slug to preserve SEO URLs if name changes, 
    // unless explicitly requested, but usually safest to keep slug.

    // Logic to handle image update: 
    // If 'image' is empty string, it might mean no change or delete? 
    // For simplicity: If new image provided, replace. If not, keep existing? 
    // Wait, the client form will send the current URL if unchanged.

    // Prisma update
    await prisma.product.update({
        where: { id },
        data: {
            name,
            description,
            price,
            compareAtPrice,
            stock,
            categoryId,
            size,
            color,
            brand,
            model,
            condition,
            images: images // Replace all images with current list
        }
    })

    await import("@/lib/audit").then(m => m.createAuditLog(
        "UPDATE_PRODUCT",
        "Product",
        id,
        { name, price, stock }
    ));

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function deleteProduct(id: string) {
    await requireAdmin();
    await prisma.product.delete({
        where: { id }
    })

    await import("@/lib/audit").then(m => m.createAuditLog(
        "DELETE_PRODUCT",
        "Product",
        id,
        {}
    ));
    revalidatePath("/admin/products")
    revalidatePath("/")
}
