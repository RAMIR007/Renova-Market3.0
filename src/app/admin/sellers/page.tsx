'use client';

import { createSeller, getSellers } from "@/actions/sellers";
import { Plus, Users } from "lucide-react";
import { useEffect, useState } from "react";
// Using a simpler client-side fetching for now since server actions inside useEffect can be tricky without useTransition
// But ideally, we'd pass initial data from a server component. Due to the client-component refactoring, I'll fetch on mount.
// Update: To avoid complexity, I will make this a Client Component that calls the server action wrapped in useEffect.

interface Seller {
    id: string;
    name: string;
    email: string;
    referralCode: string;
    whatsapp: string;
}

export default function AdminSellersPage() {
    const [sellers, setSellers] = useState<Seller[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSellers().then((data) => {
            setSellers(data as any);
            setLoading(false);
        });
    }, []);

    const handleCreate = async (formData: FormData) => {
        const res = await createSeller(null, formData);
        if (res.success) {
            setIsCreating(false);
            // Refresh list
            getSellers().then((data) => setSellers(data as any));
            alert("Vendedor creado con éxito");
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Equipo</h1>
                    <p className="text-gray-500 mt-1">Gestiona administradores, vendedores y códigos.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} /> Nuevo Usuario
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 animate-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4">Registrar Nuevo Usuario</h3>
                    <form action={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="name"
                            required
                            placeholder="Nombre Completo"
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        />
                        <input
                            name="email"
                            required
                            type="email"
                            placeholder="Correo Electrónico"
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        />
                        <input
                            name="phone"
                            required
                            placeholder="WhatsApp (Ej. 51234567)"
                            className="px-4 py-2 rounded-lg border border-gray-300"
                        />
                        <input
                            name="referralCode"
                            required
                            placeholder="Código Único (Ej. MARIA2024)"
                            className="px-4 py-2 rounded-lg border border-gray-300 uppercase"
                        />
                        <select
                            name="role"
                            className="px-4 py-2 rounded-lg border border-gray-300 bg-white"
                        >
                            <option value="SELLER">Vendedor</option>
                            <option value="ADMIN">Administrador</option>
                        </select>
                        <div className="md:col-span-2 flex justify-end gap-2 mt-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Código</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">WhatsApp</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Productos</th>
                            <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sellers.map((seller: any) => (
                            <tr key={seller.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                            {seller.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                {seller.name}
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${seller.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                                    }`}>
                                                    {seller.role === 'ADMIN' ? 'ADMIN' : 'VENDEDOR'}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500">{seller.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-700">
                                    {seller.referralCode || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {seller.whatsapp || '-'}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {seller._count?.products || 0} items
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        Activo
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {sellers.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    No hay vendedores registrados aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
