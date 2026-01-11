'use client';

import { useState, useEffect } from "react";
import { Copy, Share2, AlertTriangle, ExternalLink } from "lucide-react";

interface ReferralViewProps {
    referralCode: string | null;
    whatsapp: string | null;
}

export function ReferralView({ referralCode, whatsapp }: ReferralViewProps) {
    const [baseUrl, setBaseUrl] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    if (!referralCode) {
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-700">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <div>
                    <p className="font-medium">No tienes un código de referido activo.</p>
                    <p className="text-sm mt-1">Contacta al administrador si crees que esto es un error.</p>
                </div>
            </div>
        );
    }

    const referralLink = `${baseUrl}/?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        // Simple visual feedback
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        const text = `¡Hola! Te recomiendo comprar en Renova Market. Tienen ropa increíble. Usa mi enlace para ver el catálogo:\n\n${referralLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-600" />
                    Tu Enlace de Referido
                </h3>

                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-600 font-mono text-sm break-all">
                            {baseUrl ? referralLink : "Cargando enlace..."}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            {copied ? (
                                <>Copiado</>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    <span className="hidden sm:inline">Copiar</span>
                                </>
                            )}
                        </button>
                    </div>

                    <button
                        onClick={handleShare}
                        className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 self-start"
                    >
                        <ExternalLink className="w-5 h-5" />
                        Compartir por WhatsApp
                    </button>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-700">
                <div className="bg-blue-100 rounded-full p-2 h-fit">
                    <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="font-semibold text-blue-800">Importante</p>
                    <p className="text-sm mt-1 text-blue-700 leading-relaxed">
                        Este enlace es para que lo compartas <strong>manualmente</strong> con tus clientes y contactos.
                        Los pedidos realizados a través de este enlace se asignarán a tu cuenta.
                        <br /><br />
                        <strong>Nota:</strong> No confundir con los enlaces que se envían automáticamente en las confirmaciones de pedido del sistema (Renova Bot). Este es tu enlace personal de vendedor.
                    </p>
                </div>
            </div>
        </div>
    );
}
