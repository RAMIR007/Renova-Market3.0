import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export const revalidate = 3600; // ISR: Revalidate every hour
export const dynamicParams = true; // Allow generating new pages on demand

interface Props {
    params: Promise<{ slug: string }>;
}

// Pre-generate paths for existing products
export async function generateStaticParams() {
    const products = await prisma.product.findMany({
        select: { slug: true },
    });

    return products.map((product) => ({
        slug: product.slug,
    }));
}

async function getProduct(slug: string) {
    return await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    });
}

export default async function ProductPage({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Image Gallery */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 group">
                        {product.images[0] ? (
                            <>
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    priority
                                />
                                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a
                                        href={product.images[0]}
                                        download={`renova-${product.slug}.jpg`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/90 backdrop-blur text-gray-800 p-2 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                                        title="Descargar Foto"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                    </a>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Sin Imagen
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <Link href={`/category/${product.category.slug}`} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline mb-2 inline-block">
                                {product.category.name}
                            </Link>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white capitalize">
                                {product.name}
                            </h1>
                        </div>

                        <div className="flex items-baseline space-x-4">
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                ${Number(product.price).toFixed(2)}
                            </p>
                            {product.compareAtPrice && (
                                <p className="text-xl text-gray-500 line-through">
                                    ${Number(product.compareAtPrice).toFixed(2)}
                                </p>
                            )}
                        </div>

                        {/* Unique Piece Details */}
                        <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-xl border border-gray-100 dark:border-zinc-700 space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Detalles de la Pieza Única</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="block text-gray-500">Talla</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{product.size || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Color</span>
                                    <span className="font-medium text-gray-900 dark:text-white">{product.color || 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Condición</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                        {product.condition ? product.condition.toLowerCase() : 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-gray-500">Stock</span>
                                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? 'Disponible' : 'Agotado'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Descripción</h3>
                            <p>{product.description}</p>
                        </div>

                        <AddToCartButton product={{
                            ...product,
                            price: Number(product.price)
                        }} />

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Envío disponible a toda Cuba • Garantía de devolución
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
