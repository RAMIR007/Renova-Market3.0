'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

import SearchBar from '@/components/common/SearchBar';
import InstallPrompt from '@/components/common/InstallPrompt';
import { LogoWithText } from '@/components/common/Logo';

import { User } from 'lucide-react';

interface NavbarProps {
    currentUser?: {
        name: string | null;
        role: string;
    } | null;
}

export function Navbar({ currentUser }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const pathname = usePathname();
    const router = useRouter();
    const { cartCount } = useCart();

    // Handle scroll effect for glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Tienda', href: '/shop' },
        { name: 'Liquidación', href: '/shop?sort=price_asc', highlight: true },
        { name: 'Deseos ❤️', href: '/wishlist' },
        { name: 'Pedidos', href: '/orders' },
        { name: 'Nosotros', href: '/about' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200/50 py-1'
                : 'bg-gradient-to-b from-black/60 to-transparent py-3'
                }`}
        >
            <InstallPrompt />
            <SearchBar isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${isSearchOpen ? 'invisible' : ''}`}>
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 group z-50 relative">
                        <LogoWithText
                            variant={isScrolled ? 'dark' : 'gold'}
                            className="transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm tracking-wide transition-all duration-200 ${link.highlight
                                    ? 'text-red-600 font-extrabold hover:text-red-700 hover:scale-105'
                                    : isScrolled
                                        ? 'text-stone-800 font-bold hover:text-stone-500' // Scrolled: Dark & Bold
                                        : 'text-white font-bold drop-shadow-sm hover:text-amber-300' // Transparent: White & Shadow
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">

                        {/* Desktop Search Bar - Always visible */}
                        <form onSubmit={handleSearch} className="hidden md:flex items-center relative group">
                            <input
                                type="text"
                                placeholder="Buscar..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`
                                    pl-4 pr-10 py-2 rounded-full text-sm transition-all duration-300 outline-none font-medium
                                    ${isScrolled
                                        ? 'bg-stone-100 focus:bg-white border border-transparent focus:border-stone-400 text-stone-900 placeholder-stone-500 w-40 lg:w-48 focus:w-64'
                                        : 'bg-black/20 hover:bg-black/40 focus:bg-black/50 text-white placeholder-white/80 border border-white/30 focus:border-white/70 w-40 lg:w-48 focus:w-64 backdrop-blur-md'
                                    }
                                `}
                            />
                            <button type="submit" className={`absolute right-3 transition-opacity ${isScrolled ? 'text-stone-500 hover:text-stone-900' : 'text-white hover:text-amber-300 drop-shadow-md'}`}>
                                <Search className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Mobile Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`md:hidden p-2 rounded-full hover:bg-black/5 transition-colors ${isScrolled ? 'text-stone-900' : 'text-white drop-shadow-md'}`}
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <Link href="/cart" className={`relative p-2 rounded-full hover:bg-black/5 transition-colors ${isScrolled ? 'text-stone-900' : 'text-white drop-shadow-md'}`}>
                            <ShoppingBag className={`w-5 h-5 ${!isScrolled && 'hover:text-amber-300 transition-colors'}`} />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden p-2 rounded-md ${isScrolled ? 'text-stone-900' : 'text-white drop-shadow-md'}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        {/* User Profile (Desktop) */}
                        {currentUser ? (
                            <Link
                                href="/admin/profile"
                                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all backdrop-blur-sm ${isScrolled
                                    ? 'bg-stone-100 text-stone-900 hover:bg-stone-200 border border-stone-200'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/30 drop-shadow-md'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                <span>{currentUser.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold transition-all backdrop-blur-sm ${isScrolled
                                    ? 'bg-stone-900 text-white hover:bg-stone-800 shadow-md'
                                    : 'bg-white text-stone-900 hover:bg-stone-100 shadow-lg border-white/50'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-[60] bg-white dark:bg-zinc-950 animate-in slide-in-from-right-full duration-300 flex flex-col h-screen">
                    {/* Header relative to overlay */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">Menú</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-2xl font-bold py-4 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between group ${link.highlight ? 'text-red-600' : 'text-gray-900 dark:text-white'
                                    }`}
                            >
                                {link.name}
                                <span className={`text-lg opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${link.highlight ? 'text-red-400' : 'text-gray-300'
                                    }`}>
                                    &rarr;
                                </span>
                            </Link>
                        ))}

                        {!currentUser && (
                            <Link
                                href="/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-8 bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl text-center font-bold text-lg shadow-lg"
                            >
                                Iniciar Sesión / Registrarse
                            </Link>
                        )}

                        {currentUser && (
                            <Link
                                href="/admin/profile"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-8 bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white py-4 rounded-xl text-center font-bold text-lg flex items-center justify-center gap-2 shadow-sm"
                            >
                                <User className="w-5 h-5" />
                                Mi Perfil
                            </Link>
                        )}
                    </nav>

                    <div className="p-6 border-t border-gray-100 dark:border-zinc-800 text-center text-sm text-gray-400">
                        <p>© 2026 Renova Market</p>
                    </div>
                </div>
            )}
        </header>
    );
}
