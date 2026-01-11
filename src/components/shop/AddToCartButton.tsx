'use client';

import { useCart, CartItem } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: {
        id: string;
        name: string;
        price: number | string; // Handle potential Decimal from Prisma
        images: string[];
        slug: string;
        stock: number;
        size?: string | null;
        color?: string | null;
    };
}

export function AddToCartButton({ product }: Props) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        const item: CartItem = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images[0] || '',
            quantity: 1,
            slug: product.slug,
            size: product.size || undefined,
            color: product.color || undefined,
        };

        addItem(item);
        setIsAdded(true);

        // Reset "Added" state after 2 seconds
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (product.stock <= 0) {
        return (
            <button
                disabled
                className="w-full py-4 px-8 rounded-full font-bold text-lg bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
            >
                Agotado
            </button>
        );
    }

    return (
        <div className="flex flex-col gap-3 w-full">
            <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`w-full py-4 px-8 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${isAdded
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-black text-white hover:bg-gray-800'
                    }`}
            >
                {isAdded ? (
                    <>
                        <Check size={24} /> Añadido
                    </>
                ) : (
                    <>
                        <ShoppingCart size={24} /> Añadir al Carrito
                    </>
                )}
            </button>

            <button
                onClick={() => {
                    const message = encodeURIComponent(`Hola! Quiero comprar este artículo: ${product.name} - $${Number(product.price).toFixed(2)}. (Ref: ${product.slug})`);
                    window.open(`https://wa.me/5350000000?text=${message}`, '_blank');
                }}
                className="w-full py-3 px-8 rounded-full font-bold text-lg border-2 border-green-600 text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="css-i6dzq1"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Comprar Vía WhatsApp
            </button>
        </div>
    );
}
