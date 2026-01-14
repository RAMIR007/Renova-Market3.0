'use client';

import { updateProductStatus } from "@/actions/products";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

interface Props {
    productId: string;
    currentStatus: "AVAILABLE" | "RESERVED" | "SOLD";
}

export default function ProductStatusSelect({ productId, currentStatus }: Props) {
    const [status, setStatus] = useState(currentStatus);
    const [isPending, startTransition] = useTransition();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as "AVAILABLE" | "RESERVED" | "SOLD";
        // Optimistic update
        setStatus(newStatus);

        startTransition(async () => {
            try {
                await updateProductStatus(productId, newStatus);
            } catch (error) {
                // Revert on error
                setStatus(currentStatus);
                console.error("Failed to update status", error);
            }
        });
    };

    const getStatusStyles = (s: string) => {
        switch (s) {
            case 'AVAILABLE': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
            case 'RESERVED': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
            case 'SOLD': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    }

    return (
        <div className="relative flex items-center">
            <select
                disabled={isPending}
                value={status}
                onChange={handleChange}
                className={`
                appearance-none cursor-pointer rounded-full text-xs font-medium px-3 py-1 pr-7 border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 transition-colors
                ${getStatusStyles(status)}
                ${isPending ? 'opacity-70 cursor-wait' : ''}
            `}
            >
                <option value="AVAILABLE">Disponible</option>
                <option value="RESERVED">Reservado</option>
                <option value="SOLD">Vendido</option>
            </select>

            {/* Custom Arrow or Spinner */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70">
                {isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </div>
        </div>
    );
}
