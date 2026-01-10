'use client';

import { Share2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getCurrentUserReferralInfo } from "@/actions/referral";

interface ShareButtonProps {
    title: string;
    text: string;
    url?: string;
}

export default function ShareButton({ title, text, url }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    useEffect(() => {
        // Fetch referral code on mount
        getCurrentUserReferralInfo().then((info: any) => {
            // Base URL
            const baseUrl = url || window.location.href;
            try {
                const urlObj = new URL(baseUrl);

                if (info && info.code) {
                    urlObj.searchParams.set('ref', info.code);
                }
                setShareUrl(urlObj.toString());
            } catch (e) {
                // Invalid URL, fallback to raw
                setShareUrl(baseUrl);
            }
        });
    }, [url]);

    const handleShare = async () => {
        const finalUrl = shareUrl || url || window.location.href;

        const shareData = {
            title,
            text,
            url: finalUrl,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                // toast.success("Compartido con éxito");
            } catch (err) {
                console.log("Error al compartir:", err);
            }
        } else {
            // Fallback to copy clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                setCopied(true);
                toast.success("Enlace copiado al portapapeles");
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                toast.error("No se pudo copiar el enlace");
            }
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm"
        >
            {copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
            {copied ? "Enlace Copiado" : "Compartir con amigos"}
        </button>
    );
}
