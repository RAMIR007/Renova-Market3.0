'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function getMyProfile() {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;

    if (!token) return null;

    try {
        const session = JSON.parse(token);
        // Assuming session object contains { id: '...' }
        // Verify against DB to get fresh data
        const user = await prisma.user.findUnique({
            where: { id: session.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                referralCode: true,
                whatsapp: true,
            }
        });

        return user;
    } catch (e) {
        console.error("Error fetching profile:", e);
        return null;
    }
}
