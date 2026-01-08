'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null
    const categoryId = formData.get("categoryId") as string
    const stock = parseInt(formData.get("stock") as string, 10)
    const size = formData.get("size") as string
    const color = formData.get("color") as string
    const condition = formData.get("condition") as "NUEVO" | "EXCELENTE" | "BUENO" | "USADO"
    const image = formData.get("image") as string // In a real app we'd handle file upload here

    // New finance fields
    const cost = formData.get("cost") ? parseFloat(formData.get("cost") as string) : null
    const sellerProfit = formData.get("sellerProfit") ? parseFloat(formData.get("sellerProfit") as string) : null

    // Generate slug from name
    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now()

    await prisma.product.create({
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
            condition,
            cost,
            sellerProfit,
            images: image ? [image] : [],
            featured: false
        }
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const compareAtPrice = formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : null
    const categoryId = formData.get("categoryId") as string
    const stock = parseInt(formData.get("stock") as string, 10)
    const size = formData.get("size") as string
    const color = formData.get("color") as string
    const condition = formData.get("condition") as "NUEVO" | "EXCELENTE" | "BUENO" | "USADO"
    const image = formData.get("image") as string

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
            condition,
            images: image ? [image] : undefined // simple replace logic
        }
    })

    revalidatePath("/admin/products")
    revalidatePath("/")
    redirect("/admin/products")
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id }
    })
    revalidatePath("/admin/products")
    revalidatePath("/")
}
