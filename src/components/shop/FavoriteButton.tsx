'use client';

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/actions/favorites";
import { toast } from "sonner";

interface FavoriteButtonProps {
    productId: string;
    initialIsFavorite: boolean;
    className?: string; // Allow custom positioning
}

export default function FavoriteButton({ productId, initialIsFavorite, className }: FavoriteButtonProps) {
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [isPending, startTransition] = useTransition();

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const newState = !isFavorite;
        setIsFavorite(newState);

        if (newState) {
            toast.success("Añadido a tus deseos ❤️");
        } else {
            toast("Eliminado de deseos");
        }

        startTransition(async () => {
            const res = await toggleFavorite(productId);
            if (res.error) {
                // Revert if error
                setIsFavorite(!newState);
                toast.error(res.error);
                // Redirect to login if needed could be done via middleware/action but simple alert toast works for MVP
                if (res.error.includes("iniciar sesión")) {
                    window.location.href = "/login";
                }
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${isFavorite
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-white/80 text-gray-600 hover:text-black hover:bg-white"
                } ${className}`}
            title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
            <Heart
                size={20}
                className={isFavorite ? "fill-current" : ""}
                strokeWidth={isFavorite ? 0 : 2}
            />
        </button>
    );
}
