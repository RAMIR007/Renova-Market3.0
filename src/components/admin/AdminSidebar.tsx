'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    BarChart3,
    Package,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Don't show sidebar on login page
    if (pathname === '/admin/login') return null;

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Productos', href: '/admin/products', icon: Package },
        { name: 'Categorías', href: '/admin/categories', icon: ShoppingBag },
        { name: 'Órdenes', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Vendedores', href: '/admin/sellers', icon: Users },
        { name: 'Clientes', href: '/admin/customers', icon: Users },
        { name: 'Analítica', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Configuración', href: '/admin/settings', icon: Settings },
    ];

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-black text-white rounded-full shadow-xl hover:bg-gray-800 transition-colors"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center px-6 border-b border-gray-200">
                        <Link href="/admin" className="text-xl font-bold tracking-tight">
                            Renova<span className="text-blue-600">Admin</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={closeMenu}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive
                                            ? 'bg-black text-white'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                  `}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Info / Logout Placeholder */}
                    <div className="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                AD
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Admin</p>
                                <p className="text-xs text-gray-500">admin@renova.cu</p>
                            </div>
                        </div>
                        <button
                            onClick={async () => {
                                const { logout } = await import('@/actions/auth');
                                await logout();
                            }}
                            className="text-xs text-red-500 hover:underline mt-1"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={closeMenu}
                />
            )}
        </>
    );
}
