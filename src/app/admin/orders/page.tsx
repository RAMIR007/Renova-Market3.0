export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Órdenes</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Beta</span>
            </div>

            <div className="bg-white p-12 rounded-xl border border-dashed border-gray-300 text-center">
                <h3 className="text-lg font-medium text-gray-900">Listado de Órdenes</h3>
                <p className="text-gray-500 mt-2">Pronto podrás ver y gestionar todos los pedidos de tus clientes aquí.</p>
                <button className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium opacity-50 cursor-not-allowed">
                    Próximamente
                </button>
            </div>
        </div>
    );
}
