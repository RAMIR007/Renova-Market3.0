import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// Register standard fonts if needed, or use defaults
// Font.register({ family: 'Inter', src: '...' });

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#111827',
    },
    subtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        fontSize: 12,
    },
    bold: {
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        fontSize: 10,
        color: '#9CA3AF',
    },
});

interface OrderReceiptProps {
    orderId: string;
    customerName: string;
    date: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
    total: number;
}

export const OrderReceipt = ({ orderId, customerName, date, items, total }: OrderReceiptProps) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Renova Market</Text>
                <Text style={styles.subtitle}>Comprobante de Compra</Text>
                <Text style={{ fontSize: 10, marginTop: 5, color: '#6B7280' }}>Orden #{orderId}</Text>
            </View>

            {/* Customer Info */}
            <View style={styles.section}>
                <Text style={{ fontSize: 12, marginBottom: 5 }}>Cliente: <Text style={styles.bold}>{customerName}</Text></Text>
                <Text style={{ fontSize: 12 }}>Fecha: {date}</Text>
            </View>

            {/* Items Table */}
            <View style={styles.section}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#E5E7EB', paddingBottom: 5 }}>
                    Detalles del Pedido
                </Text>
                {items.map((item, i) => (
                    <View key={i} style={styles.row}>
                        <Text style={{ flex: 2 }}>{item.quantity} x {item.name}</Text>
                        <Text>${item.price.toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={{ marginHorizontal: 20 }}>
                <View style={styles.totalRow}>
                    <Text>Total A Pagar</Text>
                    <Text>${total.toFixed(2)}</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Gracias por comprar en Renova Market. ¡Esperamos verte pronto!</Text>
                <Text>www.renovamarket.cu</Text>
            </View>
        </Page>
    </Document>
);
