"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface FilterBarProps {
    sizes: string[];
    currentSize?: string;
    baseUrl?: string; // e.g., '/shop' or '/category/tops'
}

export default function SizeFilterBar({ sizes, currentSize, baseUrl = '' }: FilterBarProps) {
    const searchParams = useSearchParams();

    // Helper to create Links preserving other params
    const createFilterUrl = (size: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (size) {
            params.set('size', size);
        } else {
            params.delete('size');
        }
        return `${baseUrl}?${params.toString()}`;
    };

    // Sorting logic (same as ShopPage)
    const shoeSizes = sizes
        .filter(s => !isNaN(parseFloat(s)) && isFinite(Number(s)) && Number(s) > 20)
        .sort((a, b) => parseFloat(a) - parseFloat(b));

    const clothingSizes = sizes
        .filter(s => isNaN(parseFloat(s)) || !isFinite(Number(s)) || Number(s) <= 20)
        .sort((a, b) => {
            const order = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
            const idxA = order.indexOf(a.toUpperCase());
            const idxB = order.indexOf(b.toUpperCase());
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });

    if (sizes.length === 0) return null;

    return (
        <div className="space-y-4 mb-8">
            {/* Clear Filter Button */}
            {currentSize && (
                <div className="mb-2">
                    <Link href={createFilterUrl(undefined)} className="text-sm text-red-600 hover:underline flex items-center gap-1">
                        ✕ Limpiar filtro de talla: <b>{currentSize}</b>
                    </Link>
                </div>
            )}

            {/* Clothing Row */}
            {clothingSizes.length > 0 && (
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 w-16">Ropa</span>
                    <div className="flex gap-2">
                        {clothingSizes.map((size) => (
                            <Link
                                key={size}
                                href={createFilterUrl(size)}
                                scroll={false}
                                className={`shrink-0 h-9 min-w-[36px] px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentSize === size
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

            {/* Shoe Row */}
            {shoeSizes.length > 0 && (
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 w-16">Calzado</span>
                    <div className="flex gap-2">
                        {shoeSizes.map((size) => (
                            <Link
                                key={size}
                                href={createFilterUrl(size)}
                                scroll={false}
                                className={`shrink-0 h-9 min-w-[36px] px-3 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${currentSize === size
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
    );
}
