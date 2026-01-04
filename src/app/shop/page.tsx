import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export const revalidate = 3600;

interface Props {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ShopPage({ searchParams }: Props) {
    const params = await searchParams;
    const sort = typeof params.sort === 'string' ? params.sort : undefined;

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };

    const products = await prisma.product.findMany({
        where: {
            stock: { gt: 0 } // Default to showing available items
        },
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
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tienda Completa</h1>
                        <p className="text-gray-500 mt-2">Explora todas nuestras piezas únicas.</p>
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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(product => (
                        <div key={product.id} className="group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
                            <Link href={`/product/${product.slug}`} className="relative aspect-[4/5] bg-gray-200 dark:bg-zinc-700 block overflow-hidden">
                                {product.images[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        Sin Imagen
                                    </div>
                                )}
                            </Link>
                            <div className="p-4 flex flex-col flex-grow">
                                <Link href={`/category/${product.category.slug}`} className="text-xs text-gray-500 mb-1 hover:underline">
                                    {product.category.name}
                                </Link>
                                <Link href={`/product/${product.slug}`}>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <span className="font-bold text-lg">${Number(product.price).toFixed(2)}</span>
                                    {/* We could add the Quick Add but let's encourage visiting the product page for details */}
                                    <Link
                                        href={`/product/${product.slug}`}
                                        className="text-sm font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        Ver Detalles
                                    </Link>
                                </div>
                            </div>
                        </div>
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
