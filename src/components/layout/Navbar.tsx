'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
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
    const pathname = usePathname();
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

    const navLinks = [
        { name: 'Inicio', href: '/' },
        { name: 'Tienda', href: '/shop' },
        { name: 'Liquidación', href: '/shop?sort=price_asc', highlight: true },
        { name: 'Deseos ❤️', href: '/wishlist' }, // Added Wishlist
        { name: 'Pedidos', href: '/orders' },
        { name: 'Nosotros', href: '/about' },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20'
                : 'bg-transparent'
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
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-500 ${link.highlight
                                    ? 'text-red-500 hover:text-red-600'
                                    : isScrolled ? 'text-gray-700' : 'text-gray-200 hover:text-white'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={`p-2 rounded-full hover:bg-black/5 transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-700 md:text-white'}`}
                        >
                            <Search className="w-5 h-5" />
                        </button>
                        <Link href="/cart" className={`relative p-2 rounded-full hover:bg-black/5 transition-colors ${isScrolled ? 'text-gray-700' : 'text-gray-700 md:text-white'}`}>
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-blue-600 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Button */}
                        <button
                            className={`md:hidden p-2 rounded-md ${isScrolled ? 'text-gray-700' : 'text-gray-900'}`}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        {/* User Profile (Desktop) */}
                        {currentUser ? (
                            <Link
                                href="/admin/profile"
                                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors backdrop-blur-sm ${isScrolled
                                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    : 'bg-black/30 text-white hover:bg-black/40 border border-white/20'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                <span>{currentUser.name?.split(' ')[0]}</span>
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors backdrop-blur-sm ${isScrolled
                                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                                    : 'bg-white text-gray-900 hover:bg-gray-100'
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
