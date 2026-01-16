'use client';

import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ArrowRight, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const { items, removeItem, clearCart, cartTotal } = useCart();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [createAccount, setCreateAccount] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        neighborhood: '',
        city: 'La Habana',
        phone: '',
        email: '',
        password: ''
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
                email: formData.email || `guest-${Date.now()}@renova.cu`, // Keep fallback if optional
                name: formData.name,
                phone: formData.phone,
                address: `${formData.address}, ${formData.neighborhood}, ${formData.city}`,
                items: items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total: finalTotal,
                password: formData.password,
                shouldRegister: createAccount
            });

            if (result.success && result.orderId) {
                // 2. Clear Cart
                clearCart();

                // 3. Redirect to Success Page
                router.push(`/checkout/success/${result.orderId}`);
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
                                    <label className="block text-sm font-medium mb-1">Correo Electrónico</label>
                                    <input
                                        required={createAccount}
                                        type="email"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={createAccount ? "Tu correo para iniciar sesión" : "Opcional (para el recibo)"}
                                    />
                                </div>

                                <div className="p-4 bg-gray-100 rounded-lg flex flex-col gap-3">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={createAccount}
                                                onChange={(e) => setCreateAccount(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                        </div>
                                        <span className="text-sm font-medium text-gray-900">
                                            Guardar mis datos para rastrear mi pedido
                                        </span>
                                    </label>

                                    {createAccount && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-sm font-medium mb-1">Crear Contraseña</label>
                                            <input
                                                required={createAccount}
                                                type="password"
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:outline-none"
                                                value={formData.password}
                                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                                placeholder="Mínimo 6 caracteres"
                                                minLength={6}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">Se creará una cuenta automáticamente con tu compra.</p>
                                        </div>
                                    )}
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

                                {/* Legacy email field removed, merged above */}

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
