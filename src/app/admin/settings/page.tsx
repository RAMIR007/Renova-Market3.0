'use client';

import { updateSystemSettings } from "@/actions/settings";
import { Save, Phone } from "lucide-react";
import { useState } from "react";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        await updateSystemSettings(formData);
        setLoading(false);
        alert("Configuración guardada");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuración</h1>
                <p className="text-gray-500 mt-2">Gestiona los ajustes generales de tu tienda.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <Phone size={20} className="text-green-600" />
                    Contacto Directo
                </h2>

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Número de WhatsApp de la Tienda
                        </label>
                        <div className="flex gap-2">
                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                                +53
                            </span>
                            <input
                                type="text"
                                name="whatsapp"
                                placeholder="5xxxxxxx"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-300 focus:ring-black focus:border-black sm:text-sm"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Este número se usará para el botón flotante de contacto en la tienda.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </form>
            </div>

            {/* Change Password Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-6">Seguridad de la Cuenta</h2>
                <ChangePasswordForm />
            </div>
        </div>
    );
}
