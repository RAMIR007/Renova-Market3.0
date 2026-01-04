import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Update every hour

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });

    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export default async function CategoryPage({ params }: Props) {
    const { slug } = await params;

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                where: { stock: { gt: 0 } }, // Only show available products initially
                include: { category: true }
            }
        }
    });

    if (!category) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                        {category.name} ({category.products.length})
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explora nuestra colección selecta de {category.name.toLowerCase()}.
                    </p>
                </div>

                {/* Product Grid */}
                {category.products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {category.products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className="group bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative aspect-[4/5] bg-gray-200 dark:bg-zinc-700">
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
                                    {product.stock <= 0 && (
                                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                            <span className="bg-black text-white px-3 py-1 rounded-full text-sm font-bold">Agotado</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white truncate mb-1">{product.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-bold text-lg text-gray-900 dark:text-white">${Number(product.price).toFixed(2)}</span>
                                            {product.compareAtPrice && (
                                                <span className="text-sm text-gray-500 line-through ml-2">${Number(product.compareAtPrice).toFixed(2)}</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-500 border border-gray-200 rounded-md px-2 py-1">
                                            {product.size || 'Única'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-zinc-800 rounded-2xl border border-dashed border-gray-300 dark:border-zinc-700">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No hay productos disponibles</h3>
                        <p className="text-gray-500 mb-6">Parece que aún no hemos subido {category.name.toLowerCase()}. ¡Vuelve pronto!</p>
                        <Link href="/" className="text-blue-600 hover:underline">
                            Volver al inicio
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
