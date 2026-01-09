'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/shop?q=${encodeURIComponent(query)}`);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-0 left-0 right-0 h-full bg-white dark:bg-zinc-900 z-50 flex items-center px-4 md:px-8 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearch} className="w-full max-w-4xl mx-auto flex items-center gap-4">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Buscar productos por nombre, descripción..."
                    className="flex-1 bg-transparent border-none outline-none text-lg text-gray-900 dark:text-white placeholder-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>
            </form>
        </div>
    );
}
