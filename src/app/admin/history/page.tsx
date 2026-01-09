import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

export default async function AuditLogPage() {
    const logs = await prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 100,
        include: { user: true }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Historial de Cambios</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entidad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                            {log.user.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{log.user.name || log.user.email}</div>
                                            <div className="text-xs text-gray-500">{log.user.role}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${log.action.includes('CREATE') ? 'bg-green-100 text-green-800' :
                                            log.action.includes('UPDATE') ? 'bg-yellow-100 text-yellow-800' :
                                                log.action.includes('DELETE') ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {log.entity} <span className="text-xs text-gray-400">#{log.entityId?.slice(0, 8)}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <pre className="text-xs">{JSON.stringify(log.details, null, 2)}</pre>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true, locale: es })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
