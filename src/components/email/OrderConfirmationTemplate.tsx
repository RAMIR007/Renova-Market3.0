import * as React from 'react';

interface OrderConfirmationTemplateProps {
    customerName: string;
    orderId: string;
    total: number;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

export const OrderConfirmationTemplate: React.FC<OrderConfirmationTemplateProps> = ({
    customerName,
    orderId,
    total,
    items,
}) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: 1.5, color: '#333' }}>
        <h1 style={{ color: '#111827' }}>¡Gracias por tu compra, {customerName}!</h1>
        <p>Tu orden <strong>#{orderId.slice(0, 8)}</strong> ha sido confirmada.</p>

        <div style={{ margin: '20px 0', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f9fafb', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold' }}>
                Resumen del Pedido
            </div>
            <div style={{ padding: '16px' }}>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>{item.quantity}x {item.name}</span>
                        <span>${item.price.toFixed(2)}</span>
                    </div>
                ))}
                <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '12px', paddingTop: '12px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        <p>Estamos preparando tu pedido. Te notificaremos cuando sea enviado.</p>

        <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />

        <p style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
            Renova Market - Moda Sostenible<br />
            La Habana, Cuba
        </p>
    </div>
);
