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
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-[95%] max-w-md animate-in slide-in-from-top-4">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-xl p-3 flex items-center justify-between gap-3 backdrop-blur-sm bg-opacity-95">
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-indigo-100 font-medium truncate">
                        Navegando como: <span className="text-white font-bold">{userName}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-black/20 px-2 py-0.5 rounded font-mono truncate max-w-[150px]">
                            {referralLink}
                        </code>
                        <button
                            onClick={handleCopy}
                            className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors flex items-center gap-1 flex-shrink-0"
                        >
                            {copied ? "Copiado!" : <><Copy size={12} /> Copiar Link</>}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-1 border-l border-white/20 pl-3">
                    <Link
                        href="/admin/profile"
                        className="text-xs text-center bg-white text-indigo-600 px-3 py-1.5 rounded font-bold hover:bg-indigo-50 transition-colors"
                    >
                        Ver Panel
                    </Link>
                </div>

                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 shadow-md hover:bg-black transition-colors"
                >
                    <X size={12} />
                </button>
            </div>
        </div>
    );
}
