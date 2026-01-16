'use client';

import { useCart } from '@/context/CartContext';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { isCartOpen, closeCart, items, removeItem, cartTotal } = useCart();

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className="absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
                {/* Header */}
                <div className="p-5 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 z-10">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        <h2 className="text-lg font-bold">Tu Carrito ({items.length})</h2>
                    </div>
                    <button
                        onClick={closeCart}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-8 h-8 opacity-50" />
                            </div>
                            <p className="text-lg font-medium">Tu carrito está vacío</p>
                            <button
                                onClick={closeCart}
                                className="text-sm font-bold text-blue-600 hover:text-blue-700 underline"
                            >
                                Seguir comprando
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 animate-in slide-in-from-bottom-2 duration-500">
                                <div className="relative w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <div className="flex justify-between items-start gap-2">
                                            <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {item.size && `Talla: ${item.size}`}
                                            {item.size && item.color && ' • '}
                                            {item.color && `Color: ${item.color}`}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
                                        <p className="font-bold text-gray-900 dark:text-white">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900/50">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500">Subtotal</span>
                            <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-4 text-center">
                            Gastos de envío e impuestos calculados en el checkout.
                        </p>
                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                        >
                            Proceder al Pago <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
