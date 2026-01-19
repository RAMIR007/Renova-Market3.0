'use client';

import Link from "next/link";
import Image from "next/image";
import { Eye, ShoppingBag } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import { useState } from "react";
import QuickBuyModal from "./QuickBuyModal";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        price: number | string | any;
        compareAtPrice?: number | string | any | null;
        images: string[];
        category?: { name: string };
        description?: string | null; // Added for modal
        stock: number;
        // New fields
        size?: string | null;
        condition?: string | null;
        status?: string; // AVAILABLE, RESERVED, SOLD
        color?: string | null; // Added for modal logic if needed
    };
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const isOutOfStock = product.stock <= 0;
    const price = Number(product.price);
    const comparePrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
    const discount = comparePrice && comparePrice > price
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        e.stopPropagation();
        setIsQuickViewOpen(true);
    };

    return (
        <>
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
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50 dark:bg-zinc-800">
                            <ShoppingBag className="w-12 h-12 mb-2 opacity-50" />
                            <span className="text-xs font-medium">Sin Foto</span>
                        </div>
                    )}

                    {/* Badges - Adjusted Layout */}
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1.5 max-w-[80%] z-10">
                        {/* Status Badges */}
                        {product.status === 'SOLD' && (
                            <span className="bg-red-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Vendido
                            </span>
                        )}
                        {product.status === 'RESERVED' && (
                            <span className="bg-orange-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Reservado
                            </span>
                        )}
                        {product.status === 'AVAILABLE' && isOutOfStock && (
                            <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                Agotado
                            </span>
                        )}

                        {/* Scarcity Badge for Unique Items */}
                        {product.status === 'AVAILABLE' && product.stock === 1 && (
                            <span className="bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                                ¡Pieza Única!
                            </span>
                        )}

                        {/* Discount Badge */}
                        {product.status === 'AVAILABLE' && !isOutOfStock && discount > 0 && (
                            <span className="bg-rose-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Favorite Button */}
                    <div className="absolute top-3 right-3 z-10">
                        <FavoriteButton productId={product.id} initialIsFavorite={false} />
                    </div>

                    {/* Quick Action (Desktop) */}
                    {!isOutOfStock && (
                        <div className="absolute bottom-4 right-4 translate-y-20 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden sm:block">
                            <button
                                onClick={handleQuickView}
                                className="bg-white text-black p-3 rounded-full shadow-lg hover:bg-black hover:text-white transition-colors"
                            >
                                <Eye size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="mt-4 flex flex-col gap-2.5">
                    <div>
                        {product.category && (
                            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1 opacity-80">{product.category.name}</p>
                        )}
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                            {product.name}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="font-extrabold text-lg text-gray-900">${price.toFixed(2)}</span>
                                {comparePrice && comparePrice > price && (
                                    <span className="text-xs text-gray-400 line-through">${comparePrice.toFixed(2)}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer: Size & Condition */}
                    <div className="flex flex-wrap gap-2 items-center text-xs font-medium text-gray-700">
                        {product.size && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200">
                                Talla: {product.size}
                            </span>
                        )}
                        {product.condition && (
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md border border-transparent ${product.condition.toLowerCase() === 'nuevo' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                {product.condition}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <QuickBuyModal
                product={product}
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
            />
        </>
    );
}
