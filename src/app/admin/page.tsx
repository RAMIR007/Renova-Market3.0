import Link from 'next/link'
import {
    Users,
    DollarSign,
    ShoppingBag,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'

// Dummy data for initial visualization
const stats = [
    {
        label: 'Ingresos Totales',
        value: '$45,231.89',
        change: '+20.1%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        label: 'Órdenes Activas',
        value: '+573',
        change: '+12.5%',
        trend: 'up',
        icon: ShoppingBag,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        label: 'Clientes Nuevos',
        value: '+2,300',
        change: '-2.4%',
        trend: 'down',
        icon: Users,
        color: 'text-violet-600',
        bg: 'bg-violet-50'
    },
    {
        label: 'Tasa de Conversión',
        value: '3.2%',
        change: '+4.1%',
        trend: 'up',
        icon: TrendingUp,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    }
]

export default function AdminDashboard() {
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
                            {stat.trend === 'up' ? (
                                <div className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full text-xs font-medium">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    {stat.change}
                                </div>
                            ) : (
                                <div className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium">
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                    {stat.change}
                                </div>
                            )}
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
                {/* Main Chart Area (Placeholder) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm block min-h-[400px]">
                    <h3 className="font-semibold text-gray-900 mb-6">Resumen de Ventas</h3>
                    <div className="h-[300px] w-full bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200 text-gray-400">
                        Gráfico de Ventas (Aquí iría un componente Recharts)
                    </div>
                </div>

                {/* Recent Orders List */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-900 mb-6">Órdenes Recientes</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4, 5].map((_, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                    OM
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">Orden #293{i}</p>
                                    <p className="text-xs text-gray-500">hace {i * 5 + 2} min</p>
                                </div>
                                <span className="text-sm font-medium text-emerald-600">+$120.00</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-sm text-indigo-600 font-medium hover:bg-indigo-50 rounded-lg transition-colors">
                        Ver todas
                    </button>
                </div>
            </div>
        </div>
    )
}
