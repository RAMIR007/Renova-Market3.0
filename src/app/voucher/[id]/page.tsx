import { getOrderById } from '@/actions/orders';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        return {
            title: 'Orden no encontrada | Renova Market',
            description: 'No se pudieron encontrar los detalles de esta orden.',
        };
    }

    const firstProductImage = order.items[0]?.product.images && order.items[0]?.product.images.length > 0
        ? order.items[0].product.images[0]
        : '/images/og-default.jpg'; // Fallback image

    return {
        title: `Vale de Compra #${order.id.slice(0, 8).toUpperCase()} | Renova Market`,
        description: `Cliente: ${order.customerName} - Total: $${Number(order.total).toFixed(2)}. ¡Gracias por tu compra!`,
        openGraph: {
            title: `Vale de Compra #${order.id.slice(0, 8).toUpperCase()}`,
            description: `Orden de ${order.customerName}. ${order.items.length} productos. Total: $${Number(order.total).toFixed(2)}`,
            images: [
                {
                    url: firstProductImage,
                    width: 800,
                    height: 600,
                    alt: 'Producto de Renova Market',
                },
            ],
            type: 'article',
        },
    };
}

export default async function VoucherPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
        return <div className="p-8 text-center text-red-500">Orden no encontrada</div>;
    }

    // Calcular totales
    const total = Number(order.total);
    // Asumimos que los items tienen el precio unitario
    const itemsTotal = order.items.reduce((acc: any, item: any) => acc + (Number(item.price) * item.quantity), 0);
    const shippingEstimado = total - itemsTotal;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-black text-white p-6 text-center">
                    <h1 className="text-2xl font-bold uppercase tracking-wide">RENOVA MARKET</h1>
                    <p className="text-sm text-gray-300 mt-1">Vale de Entrega - Orden #{order.id.slice(0, 8).toUpperCase()}</p>
                </div>

                {/* Cliente */}
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xs uppercase font-bold text-gray-500 mb-4">Datos del Cliente</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Nombre:</span>
                            <span className="font-medium text-right">{order.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Teléfono:</span>
                            <span className="font-medium text-right">{order.customerPhone || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Dirección:</span>
                            <span className="font-medium text-right max-w-[60%]">{order.addressLine1}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Fecha:</span>
                            <span className="font-medium text-right">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Productos */}
                <div className="p-6">
                    <h2 className="text-xs uppercase font-bold text-gray-500 mb-4">Productos</h2>
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    {item.product.images && item.product.images[0] ? (
                                        <Image
                                            src={item.product.images[0]}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">Sin img</div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold line-clamp-2 leading-tight mb-1">{item.product.name}</h3>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">x{item.quantity}</span>
                                        <span>${Number(item.price).toFixed(2)} c/u</span>
                                    </div>
                                    {/* Si el producto tuviera talla o estado especifico en item, se mostraría aqui */}
                                    {(item.product.size || item.product.condition) && (
                                        <div className="flex gap-2 mt-1">
                                            {item.product.size && <span className="text-[10px] bg-gray-50 border border-gray-100 px-1.5 rounded">Talla: {item.product.size}</span>}
                                            {item.product.condition && <span className="text-[10px] bg-gray-50 border border-gray-100 px-1.5 rounded">{item.product.condition}</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Totales */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                    <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-600">Subtotal Productos</span>
                        <span className="font-medium">${itemsTotal.toFixed(2)}</span>
                    </div>
                    {/* 
                      Solo mostramos "Envio" si la diferencia es positiva, 
                      y si no, mostramos "A coordinar" si total == subtotal 
                    */}
                    {Math.abs(shippingEstimado) > 1 ? (
                        <div className="flex justify-between mb-4 text-sm">
                            <span className="text-gray-600">Envío Estimado</span>
                            <span className="font-medium">${shippingEstimado.toFixed(2)}</span>
                        </div>
                    ) : (
                        <div className="flex justify-between mb-4 text-sm">
                            <span className="text-gray-600">Envío</span>
                            <span className="font-medium text-orange-600">A coordinar</span>
                        </div>
                    )}


                    <div className="flex justify-between items-end border-t border-gray-300 pt-4">
                        <span className="text-base font-bold uppercase text-gray-800">Total a Pagar</span>
                        <span className="text-2xl font-black tracking-tight">${total.toFixed(2)}</span>
                    </div>

                    <p className="text-[10px] text-center text-gray-400 mt-6">
                        Comprobante Digital generado por Renova Market.
                    </p>
                </div>
            </div>

            <div className="mt-8">
                <Link href="/" className="text-sm text-gray-500 hover:text-black hover:underline">
                    &larr; Volver a la Tienda
                </Link>
            </div>
        </div>
    );
}
