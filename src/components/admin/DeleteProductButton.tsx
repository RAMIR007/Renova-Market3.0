'use client';

import { deleteProduct } from "@/actions/products";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

interface DeleteProductButtonProps {
    productId: string;
}

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            startTransition(async () => {
                try {
                    await deleteProduct(productId);
                    toast.success('Producto eliminado correctamente');
                } catch (error) {
                    toast.error('Error al eliminar el producto');
                    console.error(error);
                }
            });
        }
    };

    return (
        <form onSubmit={handleDelete}>
            <button
                type="submit"
                disabled={isPending}
                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                title="Eliminar"
            >
                <Trash2 size={18} />
            </button>
        </form>
    );
}
