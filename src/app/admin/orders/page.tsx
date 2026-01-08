'use client';

import { getAdminOrders, updateOrderStatus } from "@/actions/adminOrders";
import { useEffect, useState } from "react";
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = () => {
        getAdminOrders().then(data => {
            setOrders(data);
            setLoading(false);
        });
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateOrderStatus(id, newStatus as any);
        loadOrders();
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"><Clock size={12} /> Pendiente</span>;
            case 'PROCESSING': return <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"><Package size={12} /> Procesando</span>;
            case 'SHIPPED': return <span className="flex items-center gap-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium"><Truck size={12} /> Enviado</span>;
            case 'DELIVERED': return <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle size={12} /> Entregado</span>;
            case 'CANCELLED': return <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"><XCircle size={12} /> Cancelado</span>;
            default: return status;
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Órdenes</h1>
                <a href="/admin/orders/new" className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
                    <Package size={16} /> Nueva Orden
                </a>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-600">ID / Fecha</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Cliente</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Items</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Total</th>
                                <th className="px-6 py-4 font-semibold text-gray-600">Estado</th>
                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-xs text-gray-500">#{order.id.slice(0, 8)}</div>
                                        <div className="text-gray-900 text-xs mt-1">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{order.customerName}</div>
                                        <div className="text-gray-500 text-xs">{order.customerEmail}</div>
                                        <div className="text-gray-400 text-xs mt-0.5">{order.addressLine1}, {order.city}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-600 max-w-[200px] truncate">
                                            {order.items.map((item: any) => `${item.quantity}x ${item.product.name}`).join(', ')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        ${Number(order.total).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Simple status toggle for now */}
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className="text-xs border border-gray-300 rounded-md p-1 bg-white"
                                        >
                                            <option value="PENDING">Pendiente</option>
                                            <option value="PROCESSING">Procesando</option>
                                            <option value="SHIPPED">Enviado</option>
                                            <option value="DELIVERED">Entregado</option>
                                            <option value="CANCELLED">Cancelado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">
                                        No hay órdenes registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
