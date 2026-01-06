'use client';

import { createCategory, deleteCategory, getCategories } from "@/actions/categories";
import { Plus, Trash2, FolderPlus } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
    id: string;
    name: string;
    description: string | null;
    _count: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const loadParams = () => {
        getCategories().then((data) => {
            setCategories(data as any);
            setLoading(false);
        });
    }

    useEffect(() => {
        loadParams();
    }, []);

    const handleCreate = async (formData: FormData) => {
        const res = await createCategory(formData);
        if (res.success) {
            setIsCreating(false);
            loadParams();
        } else {
            alert(res.error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Seguro que quieres borrar esta categoría?")) {
            await deleteCategory(id);
            loadParams();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Categorías</h1>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} /> Nueva Categoría
                </button>
            </div>

            {isCreating && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4">Nueva Categoría</h3>
                    <form action={handleCreate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nombre</label>
                            <input name="name" required className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="Ej. Zapatos" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción</label>
                            <textarea name="description" className="w-full px-4 py-2 rounded-lg border border-gray-300" placeholder="Descripción opcional..." />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Cancelar</button>
                            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">Guardar</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-black transition-colors">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    <FolderPlus size={20} />
                                </div>
                                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                    {category._count.products} productos
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description || "Sin descripción"}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => handleDelete(category.id)}
                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {!loading && categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No hay categorías aún. Crea la primera para empezar.
                </div>
            )}
        </div>
    );
}
