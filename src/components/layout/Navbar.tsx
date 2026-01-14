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
                    <Link href="/" className="flex-shrink-0 group">
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
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col space-y-4 animate-in slide-in-from-top-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-base font-medium px-4 py-2 rounded-lg hover:bg-gray-50 bg-opacity-50 ${link.highlight ? 'text-red-600' : 'text-gray-900'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="border-t border-gray-100 pt-4 mt-2">
                        <Link href="/login" className="block text-center w-full bg-black text-white px-4 py-3 rounded-xl font-medium">
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
