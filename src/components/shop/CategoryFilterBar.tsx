"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface CategoryFilterBarProps {
    categories: { id: string, name: string, slug: string }[];
    currentCategory?: string;
    baseUrl?: string;
}

export default function CategoryFilterBar({ categories, currentCategory, baseUrl = '/shop' }: CategoryFilterBarProps) {
    const searchParams = useSearchParams();

    const createFilterUrl = (slug: string | undefined) => {
        const params = new URLSearchParams(searchParams.toString());
        if (slug) {
            params.set('category', slug);
        } else {
            params.delete('category');
        }
        return `${baseUrl}?${params.toString()}`;
    };

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
            {/* All Option */}
            <Link
                href={createFilterUrl(undefined)}
                scroll={false}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!currentCategory
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-black'
                    }`}
            >
                Todo
            </Link>

            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    href={createFilterUrl(cat.slug)}
                    scroll={false}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${currentCategory === cat.slug
                        ? 'bg-black text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-black'
                        }`}
                >
                    {cat.name}
                </Link>
            ))}
        </div>
    );
}
