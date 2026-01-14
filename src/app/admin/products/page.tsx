import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { deleteProduct } from "@/actions/products";
import { Plus, Trash2, Edit } from "lucide-react";
import ProductStatusSelect from "@/components/admin/ProductStatusSelect";

// Force dynamic rendering to always show latest stock
export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventario</h1>
                    <p className="text-gray-500">Gestiona tus productos de pieza única</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus size={20} />
                    Nuevo Producto
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-gray-900">Producto</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Categoría</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Estado</th>
                                <th className="px-6 py-4 font-semibold text-gray-900">Precio</th>
                                <th className="px-6 py-4 font-semibold text-gray-900 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {product.images[0] ? (
                                                    <Image
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">
                                                        No img
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {product.size ? `Talla: ${product.size}` : ''}
                                                    {product.color ? ` • ${product.color}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            {product.category.name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <ProductStatusSelect
                                            productId={product.id}
                                            currentStatus={product.status as "AVAILABLE" | "RESERVED" | "SOLD"}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        ${Number(product.price).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <form action={deleteProduct.bind(null, product.id)}>
                                                <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors" title="Eliminar">
                                                    <Trash2 size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No hay productos en el inventario.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
