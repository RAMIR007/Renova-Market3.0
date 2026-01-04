'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
    id: string; // Product ID
    name: string;
    price: number;
    image: string;
    size?: string;
    color?: string;
    quantity: number;
    slug: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('renova_cart');
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load cart", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('renova_cart', JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (newItem: CartItem) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((i) => i.id === newItem.id);

            // For unique items (fashion), usually quantity is restricted to 1, 
            // but let's handle general logic just in case.
            if (existingItem) {
                return currentItems.map((i) =>
                    i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i
                );
            }
            return [...currentItems, newItem];
        });
    };

    const removeItem = (id: string) => {
        setItems((currentItems) => currentItems.filter((i) => i.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const cartCount = items.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
