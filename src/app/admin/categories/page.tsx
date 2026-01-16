'use client';

import { createCategory, deleteCategory, getCategories, updateCategory } from "@/actions/categories";
import { Plus, Trash2, FolderPlus, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface Category {
    id: string;
    name: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    _count: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const loadParams = () => {
        getCategories().then((data) => {
            setCategories(data as any);
            setLoading(false);
        });
    }

    useEffect(() => {
        loadParams();
    }, []);

    const handleSubmit = async (formData: FormData) => {
        let res;
        if (editingCategory) {
            formData.append('id', editingCategory.id);
            res = await updateCategory(formData);
        } else {
            res = await createCategory(formData);
        }

        if (res.success) {
            setIsCreating(false);
            setEditingCategory(null);
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
                    onClick={() => {
                        setEditingCategory(null);
                        setIsCreating(true);
                    }}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={18} /> Nueva Categoría
                </button>
            </div>

            {(isCreating || editingCategory) && (
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-4">{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nombre</label>
                                <input
                                    name="name"
                                    required
                                    defaultValue={editingCategory?.name}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                    placeholder="Ej. Zapatos"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">URL de Imagen</label>
                                <input
                                    name="image"
                                    defaultValue={editingCategory?.image || ''}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Categoría Padre (Opcional)</label>
                            <select
                                name="parentId"
                                defaultValue={editingCategory?.parentId || ''}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                            >
                                <option value="">Ninguna (Categoría Principal)</option>
                                {categories
                                    .filter(c => c.id !== editingCategory?.id) // Prevent self-parenting
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Descripción</label>
                            <textarea
                                name="description"
                                defaultValue={editingCategory?.description || ''}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300"
                                placeholder="Descripción opcional..."
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingCategory(null);
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
                            >
                                Cancelar
                            </button>
                            <button type="submit" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                                {editingCategory ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-black transition-colors relative overflow-hidden">
                        {category.image && (
                            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                                <img src={category.image} alt="" className="w-full h-full object-cover rounded-bl-3xl" />
                            </div>
                        )}
                        <div>
                            <div className="flex items-center justify-between mb-4 relative z-10">
                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    <FolderPlus size={20} />
                                </div>
                                <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                                    {category._count.products} productos
                                </span>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 relative z-10">{category.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2 relative z-10">{category.description || "Sin descripción"}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-2 relative z-10">
                            <button
                                onClick={() => {
                                    setEditingCategory(category);
                                    setIsCreating(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Pencil size={18} />
                            </button>
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
