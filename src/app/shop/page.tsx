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
    const sizeParam = typeof params.size === 'string' ? params.size : undefined;

    // Build orderBy clause
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const where: any = {};

    if (query) {
        where.OR = [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { size: { contains: query, mode: 'insensitive' } }
        ];
    }

    // Filter by Size
    if (sizeParam) {
        where.size = sizeParam;
    }

    // Fetch products
    const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
            category: true
        }
    });

    // Fetch unique sizes for filter
    const uniqueSizes = await prisma.product.findMany({
        select: { size: true },
        where: {
            size: { not: null },
            stock: { gt: 0 } // Only show sizes for in-stock items
        },
        distinct: ['size'],
        orderBy: { size: 'asc' }
    });

    const allSizes = uniqueSizes.map(p => p.size).filter(Boolean) as string[];

    // Group sizes logic
    const shoeSizes = allSizes
        .filter(s => !isNaN(Number(s)) && Number(s) > 20) // Assume sizes > 20 are numeric shoe sizes usually? Or just use isNaN.
        // Actually, some sizes might be "34", which is small clothing or shoes.
        // But contextually for this store: 
        // 35-46 are likely shoes. 
        // 0-20? Maybe "US sizes" for dress?
        // Let's stick to simple isNumeric check for now.
        .filter(s => !isNaN(parseFloat(s)) && isFinite(Number(s)))
        .sort((a, b) => parseFloat(a) - parseFloat(b));

    const clothingSizes = allSizes
        .filter(s => isNaN(parseFloat(s)) || !isFinite(Number(s)))
        // Optional: Custom sort for S/M/L logic could be added here, but alphabetical is default fallback.
        // Let's at least try basic XS, S, M, L, XL order if present.
        .sort((a, b) => {
            const order = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            const idxA = order.indexOf(a.toUpperCase());
            const idxB = order.indexOf(b.toUpperCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-8 px-4 sm:px-6 lg:px-8">
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
                        <span className="text-gray-500 self-center hidden sm:block">Ordenar:</span>
                        <Link
                            href={{ query: { ...params, sort: 'newest' } }}
                            className={`px-3 py-1 rounded-full border transition-colors ${!sort || sort === 'newest' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                        >
                            Lo Nuevo
                        </Link>
                        <Link
                            href={{ query: { ...params, sort: 'price_asc' } }}
                            className={`px-3 py-1 rounded-full border transition-colors ${sort === 'price_asc' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'}`}
                        >
                            Precio: Low
                        </Link>
                    </div>
                </div>

                {/* Filters Section */}
                <div className="space-y-4 mb-8">
                    {/* Clear Filter Button (only if active) */}
                    {sizeParam && (
                        <div className="mb-2">
                            <Link href={{ query: { ...params, size: undefined } }} className="text-sm text-red-600 hover:underline flex items-center gap-1">
                                ✕ Limpiar filtro de talla: <b>{sizeParam}</b>
                            </Link>
                        </div>
                    )}

                    {/* Clothing Sizes Row */}
                    {clothingSizes.length > 0 && (
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 w-16">Ropa</span>
                            <div className="flex gap-2">
                                {clothingSizes.map((size) => (
                                    <Link
                                        key={size}
                                        href={{ query: { ...params, size: size } }}
                                        className={`shrink-0 h-9 min-w-[36px] px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${sizeParam === size
                                                ? 'bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        {size}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Shoe/Numeric Sizes Row */}
                    {shoeSizes.length > 0 && (
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 w-16">Calzado</span>
                            <div className="flex gap-2">
                                {shoeSizes.map((size) => (
                                    <Link
                                        key={size}
                                        href={{ query: { ...params, size: size } }}
                                        className={`shrink-0 h-9 min-w-[36px] px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${sizeParam === size
                                                ? 'bg-gray-900 text-white shadow-md ring-2 ring-gray-900 ring-offset-2'
                                                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        {size}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <div className="max-w-md mx-auto">
                            <p className="text-xl font-medium text-gray-900 mb-2">No encontramos resultados</p>
                            <p className="text-gray-500 mb-6">Intenta con otra talla o quita los filtros.</p>
                            <Link
                                href="/shop"
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                            >
                                Limpiar Filtros
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
