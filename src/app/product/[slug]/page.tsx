import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import MobileStickyBar from "@/components/shop/MobileStickyBar";
import ShareButton from "@/components/shop/ShareButton";
import ProductGallery from "@/components/shop/ProductGallery";

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

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) return {};

    return {
        title: `${product.name} | Renova Market`,
        description: product.description?.slice(0, 160) || `Compra ${product.name} en Renova Market.`,
        openGraph: {
            title: product.name,
            description: product.description?.slice(0, 160),
            images: product.images[0] ? [{ url: product.images[0] }] : [],
        },
    };
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
                    <ProductGallery
                        images={product.images}
                        productName={product.name}
                        productSlug={product.slug}
                    />

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

                        {/* Urgency & Social Proof Triggers */}
                        <div className="flex flex-col gap-2">
                            {/* Simulated View Counter */}
                            <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                {Math.floor(Math.random() * 15) + 5} personas están viendo esta prenda ahora.
                            </div>

                            {/* Stock Warning */}
                            {product.stock === 1 && (
                                <div className="flex items-center gap-2 text-sm text-red-600 font-bold animate-pulse">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                                    ¡Solo queda 1 unidad! No la dejes escapar.
                                </div>
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
                                    <span className="block text-gray-500 mb-1">Condición</span>
                                    <div className="flex items-center gap-2">
                                        {['BUENO', 'EXCELENTE', 'NUEVO'].includes(product.condition || '') ? (
                                            <div className="flex gap-0.5" title={`Condición: ${product.condition}`}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-4 h-4 ${(product.condition === 'NUEVO' && star <= 5) ||
                                                            (product.condition === 'EXCELENTE' && star <= 4) ||
                                                            (product.condition === 'BUENO' && star <= 3)
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-gray-300 fill-gray-100"
                                                            }`}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                                                {product.condition?.toLowerCase() || 'Usado'}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400 font-medium capitalize">
                                            {product.condition?.toLowerCase()}
                                        </span>
                                    </div>
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
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <AddToCartButton product={{
                                ...product,
                                price: Number(product.price)
                            }} />
                            <ShareButton
                                title={`Mira este increíble hallazgo en Renova: ${product.name}`}
                                text={`He encontrado este ${product.name} genial. ¡Es pieza única!`}
                            />
                        </div>

                        <p className="text-xs text-center text-gray-500 mt-4">
                            Envío disponible a toda Cuba • Garantía de devolución
                        </p>
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-20 border-t border-gray-100 dark:border-zinc-800 pt-10">
                    <h2 className="text-2xl font-bold mb-6">Completa el Look</h2>
                    <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
                </div>

                {/* Mobile Actions */}
                <MobileStickyBar product={{
                    ...product,
                    price: Number(product.price)
                }} />
            </div>
        </div>
    );
}

// Component to fetch and display related products
async function RelatedProducts({ categoryId, currentProductId }: { categoryId: string, currentProductId: string }) {
    const related = await prisma.product.findMany({
        where: {
            categoryId,
            id: { not: currentProductId },
            stock: { gt: 0 }
        },
        take: 4,
        include: { category: true }
    });

    if (related.length === 0) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(p => (
                <div key={p.id} className="h-full">
                    {/* @ts-ignore */}
                    <Link href={`/product/${p.slug}`} className="group block h-full">
                        <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] mb-3">
                            {p.images[0] && (
                                <Image
                                    src={p.images[0]}
                                    alt={p.name}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                            )}
                        </div>
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{p.name}</h3>
                        <p className="font-bold text-sm text-gray-900">${Number(p.price).toFixed(2)}</p>
                    </Link>
                </div>
            ))}
        </div>
    );
}
