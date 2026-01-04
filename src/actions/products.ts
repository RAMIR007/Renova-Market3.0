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
            images: image ? [image] : [],
            featured: false
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
