import { prisma } from "@/lib/prisma";
import NewOrderForm from "./order-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function NewOrderPage() {
    // Fetch products that have stock > 0
    // We fetch logic here so the client component starts with data
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            name: true,
            price: true,
            images: true,
            stock: true,
        }
    });

    // Convert Decimals to numbers for client component serialization
    const safeProducts = products.map(p => ({
        ...p,
        price: Number(p.price)
    }));

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/orders"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nueva Orden Manual</h1>
                    <p className="text-gray-500">Crea una orden para un cliente en tienda o por teléfono.</p>
                </div>
            </div>

            <NewOrderForm products={safeProducts} />
        </div>
    );
}
