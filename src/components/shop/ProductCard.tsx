import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number | string | any; // Handle Decimal
        compareAtPrice?: number | string | any | null;
        images: string[];
        category?: { name: string };
        stock: number;
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const isOutOfStock = product.stock <= 0;
    const price = Number(product.price);
    const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
    const discount = comparePrice && comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    return (
        <Link href={`/product/${product.slug}`} className="group block h-full">
            <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] sm:aspect-square">
                {/* Image */}
                {product.images[0] ? (
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isOutOfStock ? 'opacity-70 grayscale' : ''}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        No Image
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {isOutOfStock && (
                        <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Agotado
                        </span>
                    )}
                    {!isOutOfStock && discount > 0 && (
                        <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
                            -{discount}%
                        </span>
                    )}
                </div>

                {/* Quick Action (Desktop) */}
                {!isOutOfStock && (
                    <div className="absolute bottom-4 right-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
                        <button className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors">
                            <ShoppingBag size={20} />
                        </button>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="mt-4 space-y-1">
                {product.category && (
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category.name}</p>
                )}
                <h3 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {product.name}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">${price.toFixed(2)}</span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-sm text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </Link>
    );
}
