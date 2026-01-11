import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

async function getRecentProducts() {
    try {
        return await prisma.product.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                slug: true,
                images: true,
                name: true
            }
        });
    } catch (error) {
        return [];
    }
}

export async function Stories() {
    const products = await getRecentProducts();

    if (!products.length) return null;

    return (
        <section className="py-8 bg-white dark:bg-zinc-800 border-b border-gray-100 dark:border-zinc-700 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-sm font-bold text-gray-500 mb-4 px-1 uppercase tracking-wide">Novedades</h3>

                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {/* Your Story - Static for now */}
                    <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer snap-start">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-800 overflow-hidden relative bg-black">
                                <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs text-center leading-none">
                                    REN<br />OVA
                                </span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-16 md:w-20 text-center">
                            Renova
                        </span>
                    </div>

                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="flex flex-col items-center gap-2 flex-shrink-0 snap-start group"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 to-violet-500 group-hover:scale-105 transition-transform duration-300">
                                <div className="w-full h-full rounded-full border-2 border-white dark:border-zinc-800 overflow-hidden relative bg-gray-100">
                                    {product.images[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="80px"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200" />
                                    )}
                                </div>
                            </div>
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate w-16 md:w-20 text-center">
                                {product.name.split(' ')[0]}...
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
