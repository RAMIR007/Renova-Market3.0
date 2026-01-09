'use client';

import { MessageCircle } from 'lucide-react';
import { getSystemSettings } from '@/actions/settings';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
    const pathname = usePathname();
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

    useEffect(() => {
        getSystemSettings().then(settings => {
            if (settings['STORE_WHATSAPP']) {
                setPhoneNumber(settings['STORE_WHATSAPP']);
            }
        });
    }, []);

    if (pathname?.startsWith('/admin')) {
        return null;
    }

    if (!phoneNumber) return null;

    const whatsappUrl = `https://wa.me/53${phoneNumber}?text=Hola!%20Me%20interesa%20un%20producto%20de%20Renova%20Market.`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
            aria-label="Contactar por WhatsApp"
        >
            <MessageCircle size={28} fill="white" className="group-hover:animate-pulse" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                ¡Contáctanos!
            </span>
        </a>
    );
}
