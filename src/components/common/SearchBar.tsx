'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ShoppingBag } from 'lucide-react';
import { searchProducts } from '@/actions/search';
import Image from 'next/image';
import Link from 'next/link';

export default function SearchBar({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        if (value.length >= 2) {
            setIsSearching(true);
            debounceTimeout.current = setTimeout(async () => {
                const products = await searchProducts(value);
                setResults(products);
                setIsSearching(false);
            }, 300);
        } else {
            setResults([]);
            setIsSearching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-sm z-50 animate-in fade-in duration-200">
            <div className="max-w-4xl mx-auto px-4 pt-4 md:pt-8">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                    <button
                        onClick={onClose}
                        className="p-2 bg-gray-100 dark:bg-zinc-800 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="relative mb-8">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Busca por nombre, categoría o estilo..."
                        className="w-full bg-transparent border-b-2 border-gray-200 dark:border-zinc-800 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-zinc-700 py-4 outline-none focus:border-black dark:focus:border-white transition-colors"
                        value={query}
                        onChange={handleSearchInput}
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                    >
                        {isSearching ? (
                            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        ) : (
                            <Search className="w-8 h-8 text-gray-900 dark:text-white" />
                        )}
                    </button>
                </form>

                {/* Results Area */}
                <div className="overflow-y-auto max-h-[60vh]">
                    {query.length >= 2 && results.length === 0 && !isSearching && (
                        <div className="text-center py-10 text-gray-400">
                            <p className="text-lg">No encontramos productos que coincidan.</p>
                            <p className="text-sm">Intenta con "Vestido", "Zapatos" o "Accesorio"</p>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Sugerencias</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors group"
                                    >
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            {product.images[0] ? (
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <ShoppingBag size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                                                {product.category?.name}
                                            </span>
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                                {product.name}
                                            </h4>
                                            <span className="text-gray-500 font-medium mt-1">
                                                ${Number(product.price).toFixed(2)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <div className="text-center pt-4 border-t border-gray-100 dark:border-zinc-800">
                                <Link
                                    href={`/shop?q=${encodeURIComponent(query)}`}
                                    onClick={onClose}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:underline"
                                >
                                    Ver todos los resultados <span className="text-lg">&rarr;</span>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Quick Links Suggestions (only when empty) */}
                    {query.length === 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Lo Nuevo', 'Ropa', 'Zapatos', 'Ofertas'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => {
                                        setQuery(tag);
                                        // Trigger search manually effectively
                                        handleSearchInput({ target: { value: tag } } as any);
                                    }}
                                    className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 hover:text-black transition-colors text-left"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
