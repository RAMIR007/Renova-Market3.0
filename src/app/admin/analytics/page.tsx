'use client';

import { getAnalyticsData } from "@/actions/analytics";
import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        getAnalyticsData().then(setData);
    }, []);

    if (!data) return <div className="p-8 text-center text-gray-500">Cargando anlíticas...</div>;

    const stats = [
        { label: 'Ingresos Totales', value: `$${data.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total de Órdenes', value: data.orders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Productos Activos', value: data.products, icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
        { label: 'Stock Bajo/Agotado', value: data.lowStock, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analítica</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
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

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-6">Ventas Recientes</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="text-gray-500 border-b border-gray-100">
                            <tr>
                                <th className="pb-3">Orden</th>
                                <th className="pb-3">Fecha</th>
                                <th className="pb-3">Cliente</th>
                                <th className="pb-3">Estado</th>
                                <th className="pb-3 text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.recentSales.map((sale: any) => (
                                <tr key={sale.id}>
                                    <td className="py-3 font-mono text-xs">#{sale.id.slice(0, 8)}</td>
                                    <td className="py-3">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                    <td className="py-3">{sale.customerName}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                                            ${sale.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                sale.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {sale.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right font-medium">${sale.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
