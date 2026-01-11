import { getMyProfile } from "@/actions/profile";
import { ReferralView } from "@/components/admin/ReferralView";
import { User, MessageCircle, Hash, Mail } from "lucide-react";

export default async function ProfilePage() {
    const profile = await getMyProfile();

    if (!profile) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No se pudo cargar la información del perfil.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mi Perfil</h1>
                <p className="text-gray-500 mt-1">Administra tu información personal y enlaces de venta.</p>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600"></div>
                <div className="px-8 pb-8">
                    <div className="relative flex items-end -mt-12 mb-6">
                        <div className="w-24 h-24 bg-white rounded-xl p-1 shadow-lg ring-1 ring-gray-100">
                            <div className="w-full h-full bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                <User className="w-10 h-10" />
                            </div>
                        </div>
                        <div className="ml-6 mb-1">
                            <h2 className="text-2xl font-bold text-gray-900">{profile.name || "Usuario"}</h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {profile.role}
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium">{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <MessageCircle className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium">{profile.whatsapp || "Sin WhatsApp configurado"}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Hash className="w-5 h-5 text-gray-400" />
                                <span className="text-sm font-medium">
                                    Código: <span className="text-gray-900 font-bold">{profile.referralCode || "N/A"}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Referral Section */}
            {(profile.role === 'SELLER' || profile.role === 'ADMIN') && (
                <div className="space-y-8">
                    <ReferralDashboard />
                    <ReferralView referralCode={profile.referralCode} whatsapp={profile.whatsapp} />
                </div>
            )}
        </div>
    );
}

import { getReferrralStats } from "@/actions/referral-stats";
import { DollarSign, ShoppingBag, TrendingUp, Calendar } from "lucide-react";

async function ReferralDashboard() {
    const stats = await getReferrralStats();

    if (!stats) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
                Panel de Rendimiento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Comisión Estimada</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalCommission.toFixed(2)}</p>
                            <p className="text-xs text-emerald-600 font-medium mt-1">10% de ventas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Ventas Totales</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalSales}</p>
                            <p className="text-xs text-gray-400 mt-1">órdenes completadas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-100 rounded-lg text-violet-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Volumen Generado</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
                            <p className="text-xs text-gray-400 mt-1">Total vendido</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Sales List */}
            {stats.recentSales.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                        <h4 className="font-semibold text-gray-700">Ventas Recientes</h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {stats.recentSales.map((sale) => (
                            <div key={sale.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-full text-gray-500">
                                        <ShoppingBag className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Orden #{sale.id.slice(0, 8)}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(sale.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">${Number(sale.total).toFixed(2)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sale.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                            sale.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {sale.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
