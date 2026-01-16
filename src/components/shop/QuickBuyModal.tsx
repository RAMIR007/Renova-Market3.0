'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { AddToCartButton } from './AddToCartButton';
import Link from 'next/link';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number | string | any;
    images: string[];
    description?: string | null;
    size?: string | null;
    stock: number;
    color?: string | null;
    condition?: string | null;
}

interface QuickBuyModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export default function QuickBuyModal({ product, isOpen, onClose }: QuickBuyModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 grid grid-cols-1 md:grid-cols-2">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full transition-colors backdrop-blur-md"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Image Section */}
                <div className="relative h-64 md:h-full bg-gray-100 dark:bg-zinc-800">
                    {product.images[0] ? (
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <ShoppingBag size={48} />
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="p-6 md:p-8 flex flex-col h-full overflow-y-auto">
                    <div className="mb-6">
                        <Link href={`/product/${product.slug}`} className="hover:underline">
                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:to-gray-400 line-clamp-2">
                                {product.name}
                            </h2>
                        </Link>
                        <p className="text-2xl font-black mt-2 text-gray-900 dark:text-white">
                            ${Number(product.price).toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Talla</span>
                                <span className="font-bold">{product.size || 'N/A'}</span>
                            </div>
                            <div className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                <span className="block text-gray-500 text-xs uppercase tracking-wider mb-1">Condición</span>
                                <span className="font-bold capitalize">{product.condition?.toLowerCase() || 'N/A'}</span>
                            </div>
                        </div>

                        {product.description && (
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                                {product.description}
                            </p>
                        )}
                    </div>

                    <div className="space-y-3 mt-auto">
                        <AddToCartButton product={{
                            ...product,
                            price: Number(product.price)
                        }} />

                        <Link
                            href={`/product/${product.slug}`}
                            className="block w-full text-center py-3 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                        >
                            Ver todos los detalles
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
