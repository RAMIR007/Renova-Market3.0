"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Search, Save } from "lucide-react";
import { createOrder } from "@/actions/checkout";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    price: number; // Decimal in Prisma is string/number-like, ensure we handle it
    images: string[];
    stock: number;
}

export default function NewOrderForm({ products }: { products: Product[] }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [loading, setLoading] = useState(false);

    // Customer Details
    const [customer, setCustomer] = useState({
        name: "",
        email: "", // Optional for manual orders? ideally yes, but let's make it optional if possible or dummy
        phone: "",
        address: "" // Address might be pickup
    });

    // Filter products
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        p.stock > 0
    );

    const addToCart = (product: Product) => {
        const existing = cart.find(item => item.product.id === product.id);
        if (existing) {
            if (existing.quantity < product.stock) {
                setCart(cart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                alert("No hay más stock disponible de este producto.");
            }
        } else {
            setCart([...cart, { product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(cart.map(item => {
            if (item.product.id === productId) {
                const newQty = item.quantity + delta;
                if (newQty > 0 && newQty <= item.product.stock) {
                    return { ...item, quantity: newQty };
                }
            }
            return item;
        }));
    };

    const calculateTotal = () => {
        return cart.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) {
            alert("El carrito está vacío.");
            return;
        }

        setLoading(true);

        // Prepare data for server action
        const orderData = {
            items: cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: Number(item.product.price)
            })),
            name: customer.name,
            email: customer.email || "no-email@renova.store", // Fallback for manual orders if not provided
            address: customer.address || "Recogida en Tienda",
            total: calculateTotal()
        };

        const res = await createOrder(orderData);

        if (res.success) {
            alert("Orden creada exitosamente.");
            router.push("/admin/orders");
            router.refresh();
        } else {
            alert("Error al crear la orden: " + res.error);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col: Product Selector */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Seleccionar Productos</h2>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Product List */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto p-1">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow bg-white flex flex-col">
                                <div className="relative aspect-square mb-2 bg-gray-100 rounded-md overflow-hidden">
                                    {product.images[0] ? (
                                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                                    )}
                                </div>
                                <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
                                <div className="mt-auto flex items-center justify-between">
                                    <span className="font-bold text-gray-900">${Number(product.price).toFixed(2)}</span>
                                    <button
                                        type="button"
                                        onClick={() => addToCart(product)}
                                        className="p-1.5 bg-black text-white rounded-full hover:bg-gray-800"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">Stock: {product.stock}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Col: Order Summary & Customer Info */}
            <div className="space-y-6">
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
                    <h2 className="text-lg font-semibold mb-6">Resumen de Orden</h2>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto mb-6 space-y-4 max-h-[300px]">
                        {cart.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 text-sm">Carrito vacío</div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product.id} className="flex gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                                        {item.product.images[0] && (
                                            <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium text-sm truncate pr-2">{item.product.name}</h4>
                                            <button type="button" onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <div className="text-xs text-gray-500">
                                                ${Number(item.product.price).toFixed(2)} x {item.quantity}
                                            </div>
                                            <div className="font-semibold text-sm">
                                                ${(Number(item.product.price) * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-6">
                        <div className="flex justify-between items-center text-lg font-bold">
                            <span>Total</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Customer Fields */}
                    <h3 className="font-medium text-gray-900 mb-3">Datos del Cliente</h3>
                    <div className="space-y-3 mb-6">
                        <input
                            type="text"
                            placeholder="Nombre Cliente *"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email (Opcional)"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            value={customer.email}
                            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Teléfono (Opcional)"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            value={customer.phone}
                            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Dirección / Nota"
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || cart.length === 0}
                        className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Procesando...' : (
                            <>
                                <Save size={18} />
                                Crear Orden
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
