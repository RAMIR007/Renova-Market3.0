export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Configuración</h1>
            <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                <h3 className="text-lg font-medium text-gray-900">Ajustes de la Tienda</h3>
                <p className="text-gray-500 mt-2">Configura pagos, envíos, notificaciones y más.</p>
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                    Próximamente
                </button>
            </div>
        </div>
    );
}
