import React from 'react';

interface LogoProps {
    className?: string; // Additional classes for sizing/positioning
    variant?: 'gold' | 'white' | 'dark' | 'adaptive'; // 'adaptive' switches based on dark mode
}

export function Logo({ className = "", variant = 'gold' }: LogoProps) {
    // Determine color classes based on variant using Tailwind
    let colorClass = "text-[#D4AF37]"; // Default refined gold (approx Amber-400/500 feel but custom)

    // Logic:
    // gold: Always gold.
    // white: Always white.
    // dark: Always dark gray (almost black).
    // adaptive: Dark on Light Mode, White on Dark Mode (Standard text behavior)

    if (variant === 'white') colorClass = "text-white";
    if (variant === 'dark') colorClass = "text-gray-900";
    if (variant === 'adaptive') colorClass = "text-gray-900 dark:text-gray-100";

    // Combine passed className with calculated color class
    // 'currentColor' in SVG allows the text-color to flow through stroke and fill
    const finalClass = `${colorClass} ${className}`;

    return (
        <svg
            viewBox="0 0 100 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={finalClass}
            aria-hidden="true"
        >
            {/* Elegant Hanger Hook - Thicker Stroke for Visibility */}
            <path
                d="M50 4 C50 4 56 4 56 10 C56 14 52 16 50 16 L50 24"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Hanger Arms merging into Infinity/Leaf */}
            {/* Left Arm to Center Loop. Increased strokeWidth to 3.5 */}
            <path
                d="M50 24 L20 38 C14 41 14 48 22 48 C32 48 42 55 50 48"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Right Arm to Center Loop (Symmetric flow) */}
            <path
                d="M50 24 L80 38 C86 41 86 48 78 48 C68 48 58 55 50 48"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Center Leaf Accent - 80% opacity fill for substance */}
            <path
                d="M50 48 Q 50 58 56 54 Q 60 50 50 48"
                fill="currentColor"
                fillOpacity="0.8"
                stroke="none"
            />
        </svg>
    );
}

export function LogoWithText({ className = "", variant = 'gold' }: LogoProps) {
    let textColorClass = "text-[#D4AF37]";
    if (variant === 'white') textColorClass = "text-white";
    if (variant === 'dark') textColorClass = "text-gray-900";
    if (variant === 'adaptive') textColorClass = "text-gray-900 dark:text-gray-100";

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {/* Filter drop-shadow enhances visibility on noisy backgrounds */}
            <Logo className="h-12 w-auto mb-1 drop-shadow-sm" variant={variant} />
            <span className={`font-serif tracking-[0.2em] text-xl font-bold ${textColorClass} drop-shadow-sm`}>
                RENOVA
            </span>
        </div>
    )
}
