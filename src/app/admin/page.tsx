import Link from 'next/link'
import {
    Users,
    DollarSign,
    ShoppingBag,
    Package,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import { getDashboardStats } from '@/actions/analytics/dashboard'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const statsData = await getDashboardStats();

    // Fetch recent orders directly
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    const stats = [
        {
            label: 'Ingresos Totales',
            value: `$${statsData.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            // change: '+0%', // Dynamic change calc requires fetching previous period. Omitted for MVP.
            icon: DollarSign,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50'
        },
        {
            label: 'Órdenes Activas',
            value: statsData.activeOrders.toString(),
            icon: ShoppingBag,
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        {
            label: 'Clientes',
            value: statsData.totalCustomers.toString(),
            icon: Users,
            color: 'text-violet-600',
            bg: 'bg-violet-50'
        },
        {
            label: 'Productos en Stock',
            value: statsData.productsCount.toString(),
            icon: Package,
            color: 'text-amber-600',
            bg: 'bg-amber-50'
        }
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Bienvenido de nuevo, aquí tienes el resumen de hoy.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/products"
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors flex items-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Productos
                    </Link>
                    <Link
                        href="/"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all hover:scale-[1.02]"
                    >
                        Ver Tienda
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className={stat.bg + " p-2.5 rounded-lg"}>
                                <stat.icon className={"w-6 h-6 " + stat.color} />
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Simplified Chart Area Placeholder - Dynamic Charting requires client lib like Recharts */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[400px] flex items-center justify-center text-gray-400">
                    <p>Gráfica de ventas (Próximamente)</p>
                    {/* Reimplementing the chart logic needs actual date-grouped data, which is complex for MVP step. Keeping placeholder. */}
                </div>

                {/* Recent Orders List */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-6">Órdenes Recientes</h3>
                    <div className="space-y-6">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-gray-500">No hay órdenes recientes.</p>
                        ) : (
                            recentOrders.map((order) => (
                                <Link key={order.id} href="/admin/orders" className="flex items-center gap-4 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs group-hover:bg-indigo-100 transition-colors">
                                        {order.customerName ? order.customerName.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {order.customerName || 'Cliente'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-emerald-600 whitespace-nowrap">
                                        ${Number(order.total).toFixed(2)}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                    <Link href="/admin/orders" className="block w-full mt-6 py-2 text-center text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                        Ver todas
                    </Link>
                </div>
            </div>
        </div>
    )
}
