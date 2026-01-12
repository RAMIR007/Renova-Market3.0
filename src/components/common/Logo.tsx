import React from 'react';

interface LogoProps {
    className?: string;
    variant?: 'gold' | 'white' | 'dark';
}

export function Logo({ className = "", variant = 'gold' }: LogoProps) {
    let strokeColor = "#D4AF37"; // Gold default
    if (variant === 'white') strokeColor = "#ffffff";
    if (variant === 'dark') strokeColor = "#111827";

    return (
        <svg
            viewBox="0 0 100 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Elegant Hanger Hook */}
            <path
                d="M50 4 C50 4 56 4 56 10 C56 14 52 16 50 16 L50 24"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Hanger Arms merging into Infinity/Leaf */}
            {/* Left Arm to Center Loop */}
            <path
                d="M50 24 L20 38 C14 41 14 48 22 48 C32 48 42 55 50 48"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Right Arm to Center Loop (Symmetric flow) */}
            <path
                d="M50 24 L80 38 C86 41 86 48 78 48 C68 48 58 55 50 48"
                stroke={strokeColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Center Leaf Accent */}
            <path
                d="M50 48 Q 50 58 56 54 Q 60 50 50 48"
                fill={strokeColor}
                fillOpacity="0.3"
                stroke="none"
            />
        </svg>
    );
}

export function LogoWithText({ className = "", variant = 'gold' }: LogoProps) {
    const textColor = variant === 'white'
        ? 'text-white'
        : variant === 'dark'
            ? 'text-gray-900'
            : 'text-[#D4AF37]'; // Gold

    return (
        <div className={`flex flex-col items-center ${className}`}>
            <Logo className="h-12 w-auto mb-1" variant={variant} />
            <span className={`font-serif tracking-[0.2em] text-xl font-bold ${textColor}`}>
                RENOVA
            </span>
        </div>
    )
}
