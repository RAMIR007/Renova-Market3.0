'use client';

import { getUsers, deleteUser, updateUserRole } from "@/actions/users";
import { useEffect, useState } from "react";
import { User as UserIcon, Mail, Shield, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            const res = await deleteUser(id);
            if (res.success) {
                toast.success('Usuario eliminado');
                loadUsers();
            } else {
                toast.error(res.error);
            }
        }
    };

    const handleRoleChange = async (id: string, newRole: string) => {
        const res = await updateUserRole(id, newRole as any);
        if (res.success) {
            toast.success('Rol actualizado');
            loadUsers();
        } else {
            toast.error(res.error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Usuarios del Sistema</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referidos</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Registro</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                <UserIcon size={20} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{user.name || 'Sin nombre'}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black"
                                        >
                                            <option value="USER">Usuario</option>
                                            <option value="SELLER">Vendedor</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.referralCode || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {!loading && users.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay usuarios registrados.
                </div>
            )}
        </div>
    );
}
