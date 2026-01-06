'use client';

import { getCustomers } from "@/actions/customers";
import { useEffect, useState } from "react";
import { User, Mail, Calendar, DollarSign, ShoppingBag } from "lucide-react";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCustomers().then(data => {
            setCustomers(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {customers.map((customer, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
                                {customer.name ? customer.name.charAt(0).toUpperCase() : <User />}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{customer.name || "Invitado"}</h3>
                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                    <Mail size={12} className="mr-1" />
                                    {customer.email}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                            <div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                    <ShoppingBag size={12} /> Órdenes
                                </div>
                                <div className="font-semibold">{customer.totalOrders}</div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
                                    <DollarSign size={12} /> Gastado
                                </div>
                                <div className="font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</div>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                <Calendar size={12} />
                                Última compra: {new Date(customer.lastOrderDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && customers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay clientes registrados aún.
                </div>
            )}
        </div>
    );
}
