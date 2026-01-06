import { prisma } from "@/lib/prisma";
import EditProductForm from "./edit-form";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id: id }
    });

    if (!product) {
        notFound();
    }

    const categories = await prisma.category.findMany({
        select: { id: true, name: true }
    });

    return <EditProductForm product={product as any} categories={categories} />;
}
