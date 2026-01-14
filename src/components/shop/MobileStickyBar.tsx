'use client';

import { useCart, CartItem } from '@/context/CartContext';
import { ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import QuickBuyModal from './QuickBuyModal';
import { getSellerPhoneByCode } from '@/actions/referral';

interface Props {
    product: {
        id: string;
        name: string;
        price: number | string;
        images: string[];
        slug: string;
        stock: number;
    };
}

export default function MobileStickyBar({ product }: Props) {
    const { addItem } = useCart();
    const [isAdded, setIsAdded] = useState(false);
    const [showQuickBuy, setShowQuickBuy] = useState(false);
    const [sellerPhone, setSellerPhone] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchSellerPhone = async () => {
            const params = new URLSearchParams(window.location.search);
            let refCode = params.get('ref');

            if (!refCode) {
                const match = document.cookie.match(new RegExp('(^| )referral_code=([^;]+)'));
                if (match) refCode = match[2];
            }

            if (refCode) {
                const phone = await getSellerPhoneByCode(refCode);
                if (phone) setSellerPhone(phone);
            }
        };
        fetchSellerPhone();
    }, []);

    const handleAddToCart = () => {
        const item: CartItem = {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.images[0] || '',
            quantity: 1,
            slug: product.slug,
        };

        addItem(item);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    if (product.stock <= 0) return null;

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 p-3 px-4 md:hidden shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] pb-safe-area">
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowQuickBuy(true)}
                        className="flex-1 bg-green-50 text-green-700 border border-green-200 py-3 rounded-full font-bold text-sm"
                    >
                        WhatsApp
                    </button>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        className={`flex-[2] py-3 rounded-full font-bold text-sm text-white shadow-md transition-all ${isAdded ? 'bg-gray-800' : 'bg-black'}`}
                    >
                        {isAdded ? '¡Añadido!' : `Comprar • $${Number(product.price).toFixed(2)}`}
                    </button>
                </div>
            </div>

            <QuickBuyModal
                isOpen={showQuickBuy}
                onClose={() => setShowQuickBuy(false)}
                product={{
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    slug: product.slug
                }}
                sellerPhone={sellerPhone}
            />
        </>
    );
}
