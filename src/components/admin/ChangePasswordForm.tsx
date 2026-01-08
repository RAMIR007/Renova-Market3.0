"use client";

import { changePassword } from "@/actions/settings";
import { useState } from "react";

export default function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        const res = await changePassword(formData);
        setLoading(false);

        if (res.success) {
            alert("Contraseña actualizada correctamente. Por favor, inicia sesión nuevamente si es necesario.");
        } else {
            alert("Error: " + res.error);
        }
    };

    return (
        <form action={handleSubmit} className="space-y-4 max-w-md">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                <input
                    type="password"
                    name="newPassword"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                <input
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
                {loading ? "Actualizando..." : "Cambiar Contraseña"}
            </button>
        </form>
    );
}
