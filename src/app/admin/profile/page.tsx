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
                <div>
                    <ReferralView referralCode={profile.referralCode} whatsapp={profile.whatsapp} />
                </div>
            )}
        </div>
    );
}
