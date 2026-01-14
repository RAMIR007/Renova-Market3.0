"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utils for tailwind merge, if not I'll just use string interp

// Simple utility if @/lib/utils doesn't exist or clsx not imported
function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

interface ProductGalleryProps {
    images: string[];
    productName: string;
    productSlug?: string;
}

export default function ProductGallery({ images, productName, productSlug }: ProductGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(images[0] || "");

    if (!images || images.length === 0) {
        return (
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                Sin Imagen
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-zinc-800 group border border-gray-100 dark:border-zinc-700 shadow-sm">
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-cover transition-all duration-500 ease-in-out"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Download / Share Button overlay (optional, keeping clean for now or reusing existing logic) */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {productSlug && (
                        <a
                            href={selectedImage}
                            download={`renova-${productSlug}.jpg`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/90 backdrop-blur-md text-gray-800 p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-105 transition-all outline-none focus:ring-2 focus:ring-black"
                            title="Ver en pantalla completa / Descargar"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" /></svg>
                        </a>
                    )}
                </div>
            </div>

            {/* Thumbnails Grid */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={classNames(
                                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black",
                                selectedImage === img
                                    ? "border-black ring-1 ring-black shadow-md scale-95"
                                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                            )}
                            aria-label={`Ver imagen ${idx + 1}`}
                        >
                            <Image
                                src={img}
                                alt={`${productName} vista ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="100px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
