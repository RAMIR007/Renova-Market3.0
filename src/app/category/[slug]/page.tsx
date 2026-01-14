import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import SizeFilterBar from "@/components/shop/SizeFilterBar";

export const revalidate = 3600;

interface Props {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ size?: string }>;
}

export async function generateStaticParams() {
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });

    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { slug } = await params;

    // We await searchParams, but remember it's a promise in Next 15+ or typed so above. 
    // Actually in the latest Next.js 15 types, searchParams is indeed a Promise.
    const { size } = await searchParams;

    // 1. Fetch category with filtered products
    const productWhere: any = { stock: { gt: 0 } };
    if (size) {
        productWhere.size = size;
    }

    const category = await prisma.category.findUnique({
        where: { slug },
        include: {
            products: {
                where: productWhere,
                include: { category: true }
            }
        }
    });

    if (!category) {
        notFound();
    }

    // 2. Fetch ALL available sizes for this category (ignoring current filter) to populate filter bar
    // We need a separate query because 'category.products' above is already filtered.
    const sizesQuery = await prisma.product.findMany({
        where: {
            categoryId: category.id,
            stock: { gt: 0 },
            size: { not: null }
        },
        select: { size: true },
        distinct: ['size']
    });

    // Create a unique list of sizes
    const availableSizes = sizesQuery.map(p => p.size!).filter(Boolean);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 capitalize">
                        {category.name} <span className="text-gray-400 text-2xl font-normal">({category.products.length})</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Explora nuestra colección selecta de {category.name.toLowerCase()}.
                    </p>
                </div>

                {/* Filter Bar */}
                {availableSizes.length > 0 && (
                    <div className="max-w-4xl mx-auto mb-12">
                        <SizeFilterBar
                            sizes={availableSizes}
                            currentSize={size}
                            baseUrl={`/category/${slug}`}
                        />
                    </div>
                )}

                {/* Product Grid */}
                {category.products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
                        {category.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
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
