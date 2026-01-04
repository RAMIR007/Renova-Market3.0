'use client';

import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { createOrder } from '@/actions/checkout';
import { loadStripe } from '@stripe/stripe-js';

// Placeholder for Stripe (not fully implemented yet, focusing on cash first as per request)
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
    const { items, removeItem, clearCart, cartTotal } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: 'La Habana', // Defaulting to Havana
        phone: '',
    });
    const [orderStatus, setOrderStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [lastOrderId, setLastOrderId] = useState<string | null>(null);

    const handleCreateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setOrderStatus('loading');

        const result = await createOrder({
            email: formData.email,
            name: formData.name,
            address: `${formData.address}, ${formData.city}`,
            items: items.map(item => ({ productId: item.id, quantity: item.quantity })),
            total: cartTotal,
        });

        if (result.success && result.orderId) {
            setOrderStatus('success');
            setLastOrderId(result.orderId);
            clearCart();
        } else {
            setOrderStatus('error');
            alert(result.error || "Ocurrió un error al crear la orden.");
        }
    };

    if (items.length === 0 && orderStatus !== 'success') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
                <p className="text-gray-500 mb-8">Parece que aún no has añadido nada.</p>
                <Link
                    href="/shop"
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Ir a la Tienda
                </Link>
            </div>
        );
    }

    if (orderStatus === 'success') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h1 className="text-3xl font-bold mb-4">¡Orden Confirmada!</h1>
                <p className="text-gray-600 mb-8">
                    Gracias por tu compra, {formData.name}. Hemos enviado un correo de confirmación a <strong>{formData.email}</strong> con tu recibo PDF.
                </p>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800 mb-8">
                    <p className="font-semibold mb-1">Pago en Efectivo</p>
                    <p>Recuerda tener el efectivo listo al momento de la entrega en {formData.city}.</p>
                </div>
                <Link
                    href="/"
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    Volver al Inicio
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Tu Carrito</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {items.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-white shadow-sm">
                            <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                    src={item.image || '/images/placeholder.jpg'}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex-grow flex flex-col justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {item.size && <span className="mr-3">Talla: {item.size}</span>}
                                        {item.color && <span>Color: {item.color}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <span className="font-bold text-lg">${Number(item.price).toFixed(2)}</span>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary & Checkout Form */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-2xl sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Resumen de Orden</h2>
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-gray-600">
                            <span>Envío</span>
                            <span className="text-green-600 font-medium font-mono">GRATIS</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center mb-8">
                            <span className="text-xl font-bold">Total</span>
                            <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                        </div>

                        {!isCheckingOut ? (
                            <button
                                onClick={() => setIsCheckingOut(true)}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Proceder al Pago <ArrowRight size={20} />
                            </button>
                        ) : (
                            <form onSubmit={handleCreateOrder} className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                                    <input
                                        required
                                        type="email"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Dirección de Entrega</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        placeholder="Calle, Número, Apto"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Municipio</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option>La Habana</option>
                                        <option>Playa</option>
                                        <option>Plaza</option>
                                        <option>Centro Habana</option>
                                        <option>Habana Vieja</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsCheckingOut(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-300 font-medium hover:bg-white transition-colors"
                                    >
                                        Volver
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={orderStatus === 'loading'}
                                        className="flex-[2] bg-black text-white px-4 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {orderStatus === 'loading' ? 'Procesando...' : 'Confirmar Orden'}
                                    </button>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Se enviará un recibo PDF a tu correo. Pago contra entrega.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
