"use client";

import { updateProduct } from "@/actions/products";
import Link from "next/link";
import { ArrowLeft, Save, Bold, Italic, List as ListIcon } from "lucide-react";
import { useState, useRef } from "react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number | object; // Prisma decimal might be object-like on client boundary if not careful, but usually string/number
    compareAtPrice: number | object | null;
    stock: number;
    size: string | null;
    color: string | null;
    condition: "NUEVO" | "EXCELENTE" | "BUENO" | "USADO" | null; // Match Prisma enum
    categoryId: string;
    images: string[];
}

interface EditProductFormProps {
    product: Product;
    categories: Category[];
}

export default function EditProductForm({ product, categories }: EditProductFormProps) {
    // Initialize with existing product images
    const [images, setImages] = useState<string[]>(product.images || []);
    const updateWithId = updateProduct.bind(null, product.id);

    // Markdown Helper
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const insertFormat = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value;

        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        textareaRef.current.value = before + prefix + selection + suffix + after;
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
    };

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
            </div>

            <form action={updateWithId} className="space-y-6 pb-20">
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                defaultValue={product.name}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all text-base"
                            />
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Descripción <span className="text-gray-400 font-normal">(Opcional)</span>
                                </label>
                                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('**', '**')}
                                        className="p-1.5 hover:bg-white rounded shadow-sm text-gray-700"
                                        title="Negrita"
                                    >
                                        <Bold size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('*', '*')}
                                        className="p-1.5 hover:bg-white rounded shadow-sm text-gray-700"
                                        title="Cursiva"
                                    >
                                        <Italic size={16} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => insertFormat('\n- ', '')}
                                        className="p-1.5 hover:bg-white rounded shadow-sm text-gray-700"
                                        title="Lista"
                                    >
                                        <ListIcon size={16} />
                                    </button>
                                </div>
                            </div>
                            <textarea
                                ref={textareaRef}
                                name="description"
                                rows={6}
                                defaultValue={product.description || ""}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all text-base font-mono text-sm"
                                placeholder={`Ej:
- **Estado**: Nuevo
- *Material*: Seda
- Envío incluido 📦`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                defaultValue={Number(product.price)}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio Comparación ($)</label>
                            <input
                                type="number"
                                name="compareAtPrice"
                                step="0.01"
                                defaultValue={product.compareAtPrice ? Number(product.compareAtPrice) : ''}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6"></div>

                    {/* Details */}
                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <select
                                name="categoryId"
                                required
                                defaultValue={product.categoryId}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-base"
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
                                defaultValue={product.condition || "EXCELENTE"}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-base"
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
                                defaultValue={product.size || ''}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <input
                                type="text"
                                name="color"
                                defaultValue={product.color || ''}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input
                                type="number"
                                name="stock"
                                min="0"
                                required
                                defaultValue={product.stock}
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                            />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6"></div>

                    {/* Cloudinary Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
                        <ImageUpload
                            value={images}
                            onChange={(url) => setImages([...images, url])}
                            onRemove={(url) => setImages(images.filter((current) => current !== url))}
                            onImageUpdate={(oldUrl, newUrl) => {
                                setImages(images.map(img => img === oldUrl ? newUrl : img));
                            }}
                        />
                        {/* Hidden inputs to ensure ALL images are submitted */}
                        {images.map((url, index) => (
                            <input key={index} type="hidden" name="images" value={url} />
                        ))}
                        {/* Fallback to ensure 'images' is defined even if empty (though getAll handles empty fine) */}
                        {images.length === 0 && <input type="hidden" name="images" value="" disabled />}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 sticky bottom-4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-gray-200 shadow-lg z-10">
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
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
}
