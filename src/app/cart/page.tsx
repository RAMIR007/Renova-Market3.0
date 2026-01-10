'use client';

import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { createOrder } from '@/actions/checkout';
import { getSellerPhoneByCode } from '@/actions/referral';
import { getSystemSettings } from '@/actions/settings';
import { MUNICIPALITY_DISTANCES, DEFAULT_DISTANCE } from '@/lib/delivery-zones';
// import { loadStripe } from '@stripe/stripe-js';

// Placeholder for Stripe (not fully implemented yet, focusing on cash first as per request)
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CartPage() {
    const { items, removeItem, clearCart, cartTotal } = useCart();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        neighborhood: '',
        city: 'La Habana',
        phone: '',
        email: 'pedido@whatsapp.temp', // Default stub if email is optional in this flow, but good to keep if possible. Let's ask user.
        // Actually user said "fill form with their data to send delivery". 
        // Email might be less important for WhatsApp deal, but useful for DB.
        // Let's keep email as optional or hidden if user strictly wants "simple".
        // The user said "remove registration". Not necessarily email field.
        // But let's keep it simple. If we want no registration, maybe email is skippable?
        // createOrder takes email. Let's require it for receipt or just put dummy if they don't care.
        // Let's keep it but maybe not emphasize account creation.
    });
    // To simplify: I'll keep email field but maybe optional or auto-fill? 
    // Wait, createOrder SCHEME requires email. I will keep the field.

    // const [deliveryCost, setDeliveryCost] = useState(0); // Disabled for now
    // const [pricePerKm, setPricePerKm] = useState(100);

    // Fetch delivery price setting
    /*
    useEffect(() => {
        getSystemSettings().then(settings => {
            if (settings['DELIVERY_PRICE_PER_KM']) {
                setPricePerKm(Number(settings['DELIVERY_PRICE_PER_KM']));
            }
        });
    }, []);
    */

    /*
    // Recalculate delivery cost when city changes
    useEffect(() => {
        if (!formData.city || formData.city === 'La Habana' || formData.city === 'Otro') {
            setDeliveryCost(0); 
            return;
        }
        
        const distance = MUNICIPALITY_DISTANCES[formData.city] || DEFAULT_DISTANCE;
        setDeliveryCost(distance * pricePerKm);

    }, [formData.city, pricePerKm]);
    */

    const [negotiationThreshold, setNegotiationThreshold] = useState<number | null>(null);

    // Fetch settings
    useEffect(() => {
        getSystemSettings().then(settings => {
            if (settings['NEGOTIATION_THRESHOLD']) {
                setNegotiationThreshold(Number(settings['NEGOTIATION_THRESHOLD']));
            }
        });
    }, []);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleWhatsAppCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Include Delivery in Total logic? 
            // Usually order total is products. Delivery is separate line item.
            // But for the total message we should sum it.
            // const finalTotal = cartTotal + deliveryCost;
            const finalTotal = cartTotal; // Just products for now

            // 1. Create Order in DB (Guest mode)
            // We use a dummy email if user didn't provide one? No, let's ask for it or phone.
            // The User requested "fill a form... data to send delivery".
            // Name, Address, Phone are critical. Email is good for receipt.

            const result = await createOrder({
                email: formData.email || `guest-${Date.now()}@renova.cu`, // Fallback if we make it optional
                name: formData.name,
                address: `${formData.address}, ${formData.neighborhood}, ${formData.city}`,
                items: items.map(item => ({
                    productId: item.id, // Fixed: item.id holds the product ID in CartContext
                    quantity: item.quantity,
                    price: item.price
                })),
                total: finalTotal, // Use total including delivery? Or just products? 
                // Let's use Product Total for DB to be consistent with Item Sum, 
                // OR save shipping separately? 
                // DB schema doesn't have shippingCost. 
                // I will save the RAW product total in DB for now to avoid mismatch with item sum check.
                // And handle the "Total to Pay" in the WhatsApp message.
            });

            if (result.success && result.orderId) {
                // 2. Clear Cart
                clearCart();

                // 3. Redirect to WhatsApp
                const orderIdShort = result.orderId.slice(0, 8);
                const itemsList = items.map(i => `• ${i.name} (x${i.quantity})`).join('%0A');

                // Get Base URL correctly (window.location.origin is fine in client)
                const voucherLink = `${window.location.origin}/voucher/${result.orderId}`;

                let message = `*¡Nuevo Pedido! (#${orderIdShort})*%0A%0A`;
                message += `*Cliente:* ${formData.name}%0A`;
                message += `*Teléfono:* ${formData.phone}%0A`;
                message += `*Dirección:* ${formData.address}%0A`;
                message += `*Reparto:* ${formData.neighborhood}%0A`;
                message += `*Municipio:* ${formData.city}%0A%0A`;
                message += `*Pedido:*%0A${itemsList}%0A%0A`;
                message += `*Total Productos:* $${cartTotal.toFixed(2)}%0A`;
                message += `*Mensajería:* A coordinar%0A`;
                message += `*TOTAL A PAGAR:* $${finalTotal.toFixed(2)}%0A%0A`;

                message += `📄 *VER VALE DE ENTREGA (FOTO):*%0A${voucherLink}%0A%0A`;

                if (negotiationThreshold !== null && cartTotal > negotiationThreshold) {
                    message += `_Nota: Compra > $${negotiationThreshold}. Precio de envío sujeto a descuento._%0A`;
                }

                // Phone number logic (handled by referral or system default)
                // We need the number here. Since we are inside a client component, 
                // we'll rely on the WhatsAppButton logic or just fetch it here.
                // A simpler way: Just put a generic link and let the user send it?
                // Or better: Re-use the number from the floating button context? 
                // We don't have that context easily. 
                // Let's just fetch the referral/system number again or use a hardcoded fallback interaction.

                // For now, I will use a Client Action to get the number to send to.

                // Check cookies for referral
                let targetPhone = "5350000000"; // Fallback
                const match = document.cookie.match(new RegExp('(^| )referral_code=([^;]+)'));
                if (match) {
                    const code = match[2];
                    const refPhone = await getSellerPhoneByCode(code);
                    if (refPhone) targetPhone = refPhone;
                } else {
                    const settings = await getSystemSettings();
                    if (settings['STORE_WHATSAPP']) targetPhone = settings['STORE_WHATSAPP'];
                }

                const waUrl = `https://wa.me/53${targetPhone}?text=${message}`;
                window.location.href = waUrl;
            } else {
                alert(result.error || "Error al procesar el pedido.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error inesperado.");
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
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
                        <div className="flex justify-between mb-2 text-gray-600">
                            <span>Envío</span>
                            <span className="text-gray-500 font-medium text-sm text-right">A coordinar por WhatsApp</span>
                        </div>

                        {cartTotal > 30000 && (
                            <div className="mb-4 bg-green-50 border border-green-200 p-3 rounded-lg">
                                <p className="text-green-800 text-xs font-medium">
                                    ¡Felicidades! Tu compra supera los $30,000.
                                    <br />
                                    <strong>La mensajería tiene un precio especial negociable.</strong>
                                </p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center mb-8">
                            <span className="text-xl font-bold">Total</span>
                            <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                        </div>

                        {!isFormVisible ? (
                            <button
                                onClick={() => setIsFormVisible(true)}
                                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                Proceder al Pago <ArrowRight size={20} />
                            </button>
                        ) : (
                            <form onSubmit={handleWhatsAppCheckout} className="space-y-4 animate-in slide-in-from-bottom-4 fade-in">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre Completo</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Teléfono / WhatsApp</label>
                                    <input
                                        required
                                        type="tel"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="Ej. 5xxxxxxx"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Dirección de Entrega</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        placeholder="Calle y Número (ej. Calle 23 #1234)"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Reparto</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        placeholder="Ej. Vedado, Alamar, Miramar"
                                        value={formData.neighborhood}
                                        onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Municipio</label>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="">Seleccionar...</option>
                                        <option>Arroyo Naranjo</option>
                                        <option>Boyeros</option>
                                        <option>Centro Habana</option>
                                        <option>Cerro</option>
                                        <option>Cotorro</option>
                                        <option>Diez de Octubre</option>
                                        <option>Guanabacoa</option>
                                        <option>Habana del Este</option>
                                        <option>Habana Vieja</option>
                                        <option>La Lisa</option>
                                        <option>Marianao</option>
                                        <option>Playa</option>
                                        <option>Plaza de la Revolución</option>
                                        <option>Regla</option>
                                        <option>San Miguel del Padrón</option>
                                        <option>Otro</option>
                                    </select>
                                </div>

                                {/* Hidden email field for compatibility if needed, or optional visible */}
                                <div className="hidden">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setIsFormVisible(false)}
                                        className="px-4 py-3 rounded-xl border border-gray-300 font-medium hover:bg-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {isSubmitting ? 'Procesando...' : (
                                            <>
                                                Enviar por WhatsApp <MessageCircle size={20} />
                                            </>
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Al enviar, serás redirigido a WhatsApp para finalizar la entrega y el pago.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
