import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle, MessageCircle, ArrowRight, MapPin, Package, Download } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { getSellerPhoneByCode } from "@/actions/referral";
import { getSystemSettings } from "@/actions/settings";

interface Props {
    params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
    return await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        }
    });
}

export default async function OrderSuccessPage({ params }: Props) {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        notFound();
    }

    // Determine WhatsApp Number
    let targetPhone = "54143078"; // Default
    if (order.referralCode) {
        const refPhone = await getSellerPhoneByCode(order.referralCode);
        if (refPhone) targetPhone = refPhone;
    } else {
        const settings = await getSystemSettings();
        if (settings['STORE_WHATSAPP']) targetPhone = settings['STORE_WHATSAPP'];
    }

    // Construct WhatsApp Message
    const orderIdShort = order.id.slice(0, 8);
    const itemsList = order.items.map(i => `• ${i.product.name} (x${i.quantity})`).join('\n');
    const voucherLink = `${process.env.NEXT_PUBLIC_APP_URL || 'https://renovamarket.com'}/voucher/${order.id}`;

    let message = `*¡Nuevo Pedido! (#${orderIdShort})*\n\n`;
    message += `*Cliente:* ${order.customerName}\n`;
    message += `*Teléfono:* ${order.customerPhone}\n`;
    if (order.addressLine1) {
        message += `*Dirección:* ${order.addressLine1}\n`; // Assuming addressLine1 contains full string based on previous logic
    }
    message += `\n*Pedido:*\n${itemsList}\n\n`;
    message += `*Total:* $${Number(order.total).toFixed(2)}\n`;
    message += `*Mensajería:* Requiero detalles de envío.\n\n`;
    message += `📄 *VER VALE DE ENTREGA (FOTO):*\n${voucherLink}`;

    const waUrl = `https://wa.me/53${targetPhone}?text=${encodeURIComponent(message)}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-2xl w-full bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-green-600 p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">¡Pedido Confirmado!</h1>
                    <p className="text-green-100">Gracias por tu compra, {order.customerName?.split(' ')[0]}</p>
                </div>

                <div className="p-8">
                    {/* Status Step */}
                    <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl flex gap-4 items-start">
                        <div className="p-2 bg-amber-100 dark:bg-amber-800 rounded-full shrink-0">
                            <MessageCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Último Paso Requerido</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                Para coordinar el envío y finalizar el pago, es necesario que envíes los detalles de tu orden por WhatsApp.
                            </p>
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold transition-transform hover:scale-105 shadow-md"
                            >
                                <MessageCircle size={18} />
                                Enviar Orden a WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Resumen del Pedido (#{orderIdShort})</h3>
                            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4 space-y-3">
                                {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium text-gray-700 dark:text-gray-200">x{item.quantity}</span>
                                            <span className="text-gray-900 dark:text-white">{item.product.name}</span>
                                        </div>
                                        <span className="font-medium text-gray-900 dark:text-white">${Number(item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between items-center font-bold text-lg">
                                    <span>Total</span>
                                    <span>${Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Datos de Entrega</h3>
                            <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4 flex gap-3 text-sm">
                                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                                <div className="text-gray-600 dark:text-gray-300">
                                    <p className="font-medium text-gray-900 dark:text-white mb-1">{order.customerName}</p>
                                    <p>{order.addressLine1}</p>
                                    <p>{order.customerPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-10 flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/shop"
                            className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            Seguir Comprando <ArrowRight size={18} />
                        </Link>
                        <Link
                            href={`/voucher/${order.id}`}
                            className="flex-1 border border-gray-200 dark:border-zinc-700 py-3 rounded-xl font-bold text-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 text-gray-700 dark:text-gray-200"
                        >
                            <Download size={18} /> Descargar Vale
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
