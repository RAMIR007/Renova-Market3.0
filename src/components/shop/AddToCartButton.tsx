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
    );
}
