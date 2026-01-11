'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    BarChart,
    Settings,
    LogOut,
    Layers,
    User
} from 'lucide-react'
import { cn } from '@/lib/utils'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Package, label: 'Productos', href: '/admin/products' },
    { icon: Layers, label: 'Categorías', href: '/admin/categories' },
    { icon: ShoppingBag, label: 'Órdenes', href: '/admin/orders' },
    { icon: Users, label: 'Clientes', href: '/admin/customers' },
    { icon: BarChart, label: 'Analíticas', href: '/admin/analytics' },
    { icon: User, label: 'Perfil', href: '/admin/profile' },
    { icon: Settings, label: 'Configuración', href: '/admin/settings' },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                    Renova Admin
                </span>
            </div>

            <nav className="flex-1 py-6 px-3 space-y-1">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                isActive
                                    ? "bg-indigo-50 text-indigo-700 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"
                                )}
                            />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                </button>
            </div>
        </aside>
    )
}
