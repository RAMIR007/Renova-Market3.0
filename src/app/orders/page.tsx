'use client';

import { useState } from 'react';
import { getOrdersByEmail } from '@/actions/orders';
import { Search, Package, Calendar, MapPin } from 'lucide-react';
import Image from 'next/image';

// Define minimal types for the partial data we'll display
interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: {
        name: string;
        images: string[];
        slug: string;
    };
}

interface Order {
    id: string;
    total: any; // Decimal
    status: string;
    createdAt: Date;
    addressLine1: string;
    items: OrderItem[];
}

export default function OrdersPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[] | null>(null);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrders(null);
        setHasSearched(true);

        try {
            const result = await getOrdersByEmail(email);
            if (result.success && result.orders) {
                setOrders(result.orders as any); // Type assertion for simple MVP
            } else {
                setError(result.error || "No encontrado");
            }
        } catch (err) {
            setError("Ocurrió un error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header & Search */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Mis Pedidos</h1>
                    <p className="text-gray-500">Ingresa tu correo electrónico para ver tu historial de compras.</p>

                    <form onSubmit={handleSearch} className="max-w-md mx-auto relative flex items-center">
                        <Search className="absolute left-4 text-gray-400 w-5 h-5" />
                        <input
                            type="email"
                            required
                            placeholder="tu@correo.com"
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none shadow-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 bg-black text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Buscando...' : 'Buscar'}
                        </button>
                    </form>
                </div>

                {/* Results */}
                <div className="space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
                            {error}
                        </div>
                    )}

                    {hasSearched && orders && orders.length === 0 && !error && (
                        <div className="text-center text-gray-500 py-10">
                            No se encontraron pedidos con ese correo.
                        </div>
                    )}

                    {orders && orders.map((order) => (
                        <div key={order.id} className="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-700 overflow-hidden">
                            {/* Order Header */}
                            <div className="bg-gray-50 dark:bg-zinc-800/80 px-6 py-4 border-b border-gray-100 dark:border-zinc-700 flex flex-wrap gap-4 justify-between items-center">
                                <div className="flex gap-4 text-sm">
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wider">Fecha</span>
                                        <span className="font-medium flex items-center gap-1">
                                            <Calendar size={14} className="text-gray-400" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wider">Total</span>
                                        <span className="font-medium">${Number(order.total).toFixed(2)}</span>
                                    </div>
                                    <div>
                                        <span className="block text-gray-500 text-xs uppercase tracking-wider">Estado</span>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {order.status === 'PENDING' ? 'Pendiente / Pago Contra Entrega' : order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    ID: {order.id.slice(-8)}
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={item.product.images[0] || '/images/placeholder.jpg'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 dark:text-white">{item.product.name}</h4>
                                                <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                                            </div>
                                            <div className="font-medium">
                                                ${Number(item.price).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Info */}
                                <div className="mt-6 pt-4 border-t border-gray-100 dark:border-zinc-700 flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">Dirección de Entrega</p>
                                        <p className="text-sm text-gray-500">{order.addressLine1}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
