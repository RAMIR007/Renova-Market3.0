import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";

export const revalidate = 3600;

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: Props) {
    const params = await searchParams;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;

    const query = typeof params.q === 'string' ? params.q : undefined;

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const where: any = {
        stock: { gt: 0 } // Default to showing available items
    };

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
        ];
    }

    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
            category: true
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {query ? `Busqueda: "${query}"` : 'Tienda Completa'}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {query ? `Resultados para su búsqueda` : 'Explora todas nuestras piezas únicas.'}
                        </p>
                    </div>

                    <div className="flex gap-2 text-sm">
                        <span className="text-gray-500 self-center">Ordenar por:</span>
                        <Link
                            href="/shop?sort=newest"
                            className={`px-3 py-1 rounded-full border ${!sort || sort === 'newest' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                            Lo Nuevo
                        </Link>
                        <Link
                            href="/shop?sort=price_asc"
                            className={`px-3 py-1 rounded-full border ${sort === 'price_asc' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300'}`}
                        >
                            Precio: Menor a Mayor
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-500">No hay productos disponibles por el momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
