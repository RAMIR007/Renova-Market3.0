"use client";

import { createProduct } from "@/actions/products";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
// Import the new client component
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
    id: string;
    name: string;
}

interface NewProductFormProps {
    categories: Category[];
}

export default function NewProductForm({ categories }: NewProductFormProps) {
    // Local state to manage the image URL
    const [imageUrl, setImageUrl] = useState("");

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
            </div>

            <form action={createProduct} className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                    {/* Basic Info */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                placeholder="Ej. Vestido Zara Floral"
                            />
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea
                                name="description"
                                rows={4}
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                placeholder="Detalles sobre el material, estado, medidas..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio Comparación ($) <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input
                                type="number"
                                name="compareAtPrice"
                                step="0.01"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6"></div>

                    {/* Details */}
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select
                                name="categoryId"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white"
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                            <select
                                name="condition"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white"
                            >
                                <option value="EXCELENTE">Excelente</option>
                                <option value="NUEVO">Nuevo con etiqueta</option>
                                <option value="BUENO">Bueno</option>
                                <option value="USADO">Usado</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                            <input
                                type="text"
                                name="size"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="M, 38, Única"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <input
                                type="text"
                                name="color"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                placeholder="Rojo, Estampado..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                defaultValue="1"
                                min="0"
                                required
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                            />
                            <p className="text-xs text-gray-500 mt-1">Para productos únicos, mantener en 1.</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6"></div>

                    {/* Cloudinary Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
                        <ImageUpload
                            value={imageUrl ? [imageUrl] : []}
                            onChange={(url) => setImageUrl(url)}
                            onRemove={() => setImageUrl("")}
                        />
                        {/* Hidden input to ensure the URL is submitted with the form */}
                        <input type="hidden" name="image" value={imageUrl} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 sticky bottom-4">
                    <Link
                        href="/admin/products"
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 bg-white shadow-sm transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2.5 rounded-lg bg-black text-white font-medium hover:bg-gray-800 shadow-md transition-all flex items-center gap-2"
                    >
                        <Save size={18} />
                        Guardar Producto
                    </button>
                </div>
            </form>
        </div>
    );
}
