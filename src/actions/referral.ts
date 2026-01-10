'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/auth-check";

export async function getSellerPhoneByCode(code: string) {
    if (!code) return null;

    try {
        const seller = await prisma.user.findUnique({
            where: { referralCode: code.toUpperCase() },
            select: { whatsapp: true }
        });
        return seller?.whatsapp;
    } catch (e) {
        return null;
    }
}

export async function getCurrentUserReferralInfo() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) return null;

    try {
        const session = JSON.parse(token);
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { referralCode: true, whatsapp: true, role: true }
        });

        if (!user) return null;
        if (user.role === 'USER') return null; // Users don't refer?

        return {
            code: user.referralCode,
            whatsapp: user.whatsapp
        };
    } catch (e) {
        return null;
    }
}
