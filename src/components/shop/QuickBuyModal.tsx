'use client';

import { useState } from 'react';
import { X, MessageCircle } from 'lucide-react';
import { processQuickBuy } from '@/actions/quick-buy';
import { toast } from 'sonner';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: string;
        name: string;
        price: number;
        slug: string;
    };
    sellerPhone?: string; // Optional phone number to direct message to
}

export default function QuickBuyModal({ isOpen, onClose, product, sellerPhone = '54143078' }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        email: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await processQuickBuy({
            productId: product.id,
            customerName: formData.name,
            customerPhone: formData.phone,
            customerAddress: formData.address,
            customerEmail: formData.email
        });

        if (result.success) {
            if (result.isNewUser) {
                toast.success(
                    <div className="flex flex-col gap-1">
                        <span className="font-bold">¡Cuenta Creada!</span>
                        <span className="text-sm">Se ha creado una cuenta. Tu contraseña temporal son los dígitos de tu teléfono.</span>
                    </div>,
                    { duration: 6000 }
                );
            } else {
                toast.success("¡Producto reservado con éxito!");
            }

            // Automatización: Links Inteligentes para el Vendedor
            const origin = window.location.origin;
            const productLink = `${origin}/product/${product.slug}`;
            const adminOrderLink = `${origin}/admin/orders/${result.orderId}`;

            // Construir mensaje de WhatsApp optimizado para gestión
            const t = {
                header: `🚀 *NUEVA ORDEN RÁPIDA* #${result.orderId?.slice(0, 8)}`,
                prodInfo: `📦 *Producto:* ${product.name}\n💰 *Precio:* $${product.price}`,
                prodLink: `🔗 *Ver Producto:* ${productLink}`,

                clientHeader: `👤 *Datos del Cliente:*`,
                clientData: `Nombre: ${formData.name}\nTel: ${formData.phone}\nDir: ${formData.address}` + (formData.email ? `\nEmail: ${formData.email}` : ''),

                adminSection: `🛠️ *PANEL DE VENDEDOR:*\nGestione esta orden aquí:\n${adminOrderLink}`
            };

            const fullMessage = [
                t.header,
                "",
                t.prodInfo,
                t.prodLink,
                "",
                t.clientHeader,
                t.clientData,
                "",
                "------------------",
                t.adminSection
            ].join('\n');

            console.log("WhatsApp Message:", fullMessage);

            const encodedMessage = encodeURIComponent(fullMessage);

            // Usar '53' como prefijo para Cuba si no viene incluido, asumir formato local
            const targetPhone = sellerPhone.replace(/\D/g, '');
            const finalPhone = targetPhone.length === 8 ? `53${targetPhone}` : targetPhone;

            // Detectar si es dispositivo móvil para usar api.whatsapp o web.whatsapp
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const baseUrl = isMobile ? 'https://api.whatsapp.com/send' : 'https://web.whatsapp.com/send';

            const whatsappUrl = `${baseUrl}?phone=${finalPhone}&text=${encodedMessage}`;
            console.log("Opening URL:", whatsappUrl);

            window.open(whatsappUrl, '_blank');
            onClose();
        } else {
            toast.error(result.error || "Error al procesar la compra");
        }
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MessageCircle className="text-green-500" />
                        Compra Rápida
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Reserva "{product.name}" al instante y coordina por WhatsApp.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo *</label>
                        <input
                            required
                            type="text"
                            placeholder="Tu nombre"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono / WhatsApp *</label>
                        <input
                            required
                            type="tel"
                            placeholder="Tu número de contacto"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección de Entrega *</label>
                        <textarea
                            required
                            rows={2}
                            placeholder="Calle, Número, Municipio..."
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                            value={formData.address}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-gray-400 font-normal">(Opcional para cuenta)</span></label>
                        <input
                            type="email"
                            placeholder="Para crear cuenta automática"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none transition-all"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mt-6 transition-all transform active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                        ) : (
                            <>
                                <MessageCircle size={20} />
                                Confirmar Reserva
                            </>
                        )}
                    </button>
                    <p className="text-xs text-center text-gray-400 mt-3 px-4">
                        Al confirmar, el producto pasará a estado <strong>Reservado</strong> inmediatamente.
                    </p>
                </form>
            </div>
        </div>
    );
}
