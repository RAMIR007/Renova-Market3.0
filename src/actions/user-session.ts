'use server';

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) return null;

    try {
        const session = JSON.parse(token);
        // We verify against DB to be sure regarding role and fresh info
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: { id: true, name: true, referralCode: true, role: true }
        });
        return user;
    } catch {
        return null;
    }
}
