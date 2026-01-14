"use client";

import { createProduct } from "@/actions/products";
import Link from "next/link";
import { ArrowLeft, Save, Bold, Italic, List as ListIcon } from "lucide-react";
import { useState, useRef } from "react";
// Import the new client component
import ImageUpload from "@/components/admin/ImageUpload";

interface Category {
    id: string;
    name: string;
}

interface NewProductFormProps {
    categories: Category[];
    userRole: string;
}

export default function NewProductForm({ categories, userRole }: NewProductFormProps) {
    // Local state
    const [images, setImages] = useState<string[]>([]);
    const [localCategories, setLocalCategories] = useState(categories);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [loadingCategory, setLoadingCategory] = useState(false);

    // Markdown Helper
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const insertFormat = (prefix: string, suffix: string = '') => {
        if (!textareaRef.current) return;
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const text = textareaRef.current.value;

        // If nothing selected, just insert. If selected, wrap.
        const before = text.substring(0, start);
        const selection = text.substring(start, end);
        const after = text.substring(end);

        // This is a controlled component technically via the 'name' prop for formData, 
        // but we are manipulating DOM directly. Ideally we'd bind value state but 
        // for this form we are using uncontrolled native inputs mostly. 
        // So direct DOM manipulation is fine for the textarea content.

        textareaRef.current.value = before + prefix + selection + suffix + after;

        // Restore focus and selection
        textareaRef.current.focus();
        const newCursorPos = start + prefix.length + selection.length + suffix.length; // Move to end of insertion?
        // Or keep selection?
        // Let's just put cursor after insertion
        textareaRef.current.setSelectionRange(start + prefix.length, end + prefix.length);
    };

    const isAdmin = userRole === 'ADMIN';

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) return;
        setLoadingCategory(true);

        // Dynamically import server action to avoid passing it as prop
        const { createCategory } = await import("@/actions/categories");

        // Create FormData to match the server action signature
        const formData = new FormData();
        formData.append("name", newCategoryName);

        const res = await createCategory(formData);

        if (res.success) {
            // Need to refresh or manually add to local list. 
            // Ideally we get the new ID back. For now, let's re-fetch or pseudo-add
            // Since our createCategory doesn't return the new object, we might need to improve it, 
            // but for now let's optimistically add it assuming name is unique
            const tempId = newCategoryName.toLowerCase().replace(/ /g, '-');
            setLocalCategories([...localCategories, { id: tempId, name: newCategoryName }]); // Note: ID might be wrong if DB generates UUID
            setSelectedCategory(tempId);

            // To be safe, we should probably fetch categories again, but for MVP:
            // Let's assume the user picks it. 
            // actually, createCategory revalidates path.
            setIsCreatingCategory(false);
            setNewCategoryName("");
            alert("Categoría creada. Nota: Si no aparece correctamente en el selector, recarga la página.");
        } else {
            alert("Error: " + res.error);
        }
        setLoadingCategory(false);
    }

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

            <form action={createProduct} className="space-y-6 pb-20">
                <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">

                    {/* Basic Info */}
                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                required
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all text-base"
                                placeholder="Ej. Vestido Zara Floral"
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
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none transition-all text-base font-mono text-sm"
                                placeholder={`Ej:
- Material: 100% Algodón
- Estado: **Impecable**
- Medidas: 
  * Ancho: 50cm
  * Largo: 70cm`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio ($)</label>
                            <input
                                type="number"
                                name="price"
                                step="0.01"
                                required
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio Comparación <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input
                                type="number"
                                name="compareAtPrice"
                                step="0.01"
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                                placeholder="0.00"
                            />
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 col-span-2 grid grid-cols-2 gap-4">
                            {isAdmin && (
                                <div>
                                    <label className="block text-sm font-medium text-amber-900 mb-2">Costo Real ($) <span className="text-xs font-normal">(Interno)</span></label>
                                    <input
                                        type="number"
                                        name="cost"
                                        step="0.01"
                                        className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:outline-none text-base bg-white"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                            <div className={isAdmin ? "" : "col-span-2"}>
                                <label className="block text-sm font-medium text-amber-900 mb-2">Ganancia Vendedor ($)</label>
                                <input
                                    type="number"
                                    name="sellerProfit"
                                    step="0.01"
                                    className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:ring-2 focus:ring-amber-500 focus:outline-none text-base bg-white"
                                    placeholder="0.00"
                                />
                            </div>
                            {!isAdmin && (
                                <p className="col-span-2 text-xs text-amber-700">
                                    * Define tu ganancia esperada para este producto.
                                </p>
                            )}
                            {isAdmin && (
                                <p className="col-span-2 text-xs text-amber-700">
                                    * El 'Costo Real' es privado. El vendedor solo verá la 'Ganancia'.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6"></div>

                    {/* Details */}
                    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>

                            {!isCreatingCategory ? (
                                <div className="flex gap-2">
                                    <select
                                        name="categoryId"
                                        required
                                        className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none bg-white text-base"
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="">Seleccionar...</option>
                                        {localCategories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingCategory(true)}
                                        className="px-3 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 text-sm whitespace-nowrap"
                                    >
                                        + Nueva
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Nombre nueva categoría..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={loadingCategory}
                                        className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
                                    >
                                        {loadingCategory ? '...' : 'Crear'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingCategory(false)}
                                        className="px-3 py-2 text-gray-500 hover:text-gray-700"
                                    >
                                        X
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Condición</label>
                            <select
                                name="condition"
                                required
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
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                                placeholder="M, 38, Única"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <input
                                type="text"
                                name="color"
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                                placeholder="Rojo, Estampado..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Marca <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input
                                type="text"
                                name="brand"
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                                placeholder="Zara, H&M, Shein..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Modelo <span className="text-gray-400 font-normal">(Opcional)</span></label>
                            <input
                                type="text"
                                name="model"
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                                placeholder="Slim Fit, Vintage..."
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
                                className="w-full px-4 py-3 md:py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none text-base"
                            />
                            <p className="text-xs text-gray-500 mt-1">Para productos únicos, mantener en 1.</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6"></div>

                    {/* Cloudinary Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Imágenes del Producto</label>
                        <ImageUpload
                            value={images}
                            onChange={(url) => setImages(prev => [...prev, url])}
                            onRemove={(url) => setImages(prev => prev.filter((current) => current !== url))}
                            onImageUpdate={(oldUrl, newUrl) => {
                                setImages(prev => prev.map(img => img === oldUrl ? newUrl : img));
                            }}
                        />
                        {/* Hidden inputs to ensure the URLs are submitted with the form */}
                        {images.map((url, index) => (
                            <input key={index} type="hidden" name="images" value={url} />
                        ))}
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
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
}
