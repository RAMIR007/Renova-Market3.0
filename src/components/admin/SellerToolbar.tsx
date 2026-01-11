'use client';

import { useState, useEffect } from "react";
import { Copy, X, Store } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SellerToolbarProps {
    referralCode: string;
    userName: string;
}

export default function SellerToolbar({ referralCode, userName }: SellerToolbarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState("");
    const pathname = usePathname();

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    // Don't show on admin pages
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-40 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
                title="Herramientas de Vendedor"
            >
                <Store size={24} />
            </button>
        );
    }

    const referralLink = `${baseUrl}/?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-lg animate-in slide-in-from-top-4">
            <div className="bg-gray-900 border border-gray-800 text-white rounded-xl shadow-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 font-medium truncate mb-1">
                        Hola, <span className="text-white font-bold">{userName}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-lg px-3 py-1.5 flex items-center justify-between group cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700" onClick={handleCopy}>
                            <code className="text-xs font-mono text-indigo-400 truncate mr-2">
                                {referralCode}
                            </code>
                            <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                                {copied ? "Copiado" : "Copiar"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
                    <Link
                        href="/admin/profile"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-all hover:scale-105 shadow-lg shadow-indigo-900/20 whitespace-nowrap"
                    >
                        Mi Panel
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-3 -right-3 bg-white text-gray-900 rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors border-2 border-gray-900"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
