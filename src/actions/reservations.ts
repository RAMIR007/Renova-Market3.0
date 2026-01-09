'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

const RESERVATION_TIME_MINUTES = 15;
const MAX_FAILED_RESERVATIONS = 3;
const BAN_DURATION_HOURS = 24;

export async function createReservation(productId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
        return { error: 'Debes iniciar sesión para reservar.' };
    }

    const session = JSON.parse(sessionToken);
    const userId = session.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: 'Usuario no encontrado.' };

    // Check ban
    if (user.reservationBanUntil && user.reservationBanUntil > new Date()) {
        const remainingHours = Math.ceil((user.reservationBanUntil.getTime() - Date.now()) / (1000 * 60 * 60));
        return { error: `Tu cuenta está temporalmente restringida para reservas por ${remainingHours}h debido a reservas no completadas.` };
    }

    // Clean expired reservations globaly (could be a cron, but lazy clean is fine here)
    await prisma.reservation.deleteMany({
        where: {
            expiresAt: { lt: new Date() }
        }
    });

    // Check if product is available
    const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { reservations: true }
    });

    if (!product) return { error: 'Producto no encontrado.' };

    // Stock check considering valid reservations
    const reservedQuantity = product.reservations.reduce((acc, r) => acc + r.quantity, 0);
    const availableStock = product.stock - reservedQuantity;

    if (availableStock <= 0) {
        return { error: 'Producto no disponible o reservado por otro usuario.' };
    }

    // Create reservation
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + RESERVATION_TIME_MINUTES);

    await prisma.reservation.create({
        data: {
            userId,
            productId,
            quantity: 1, // Unique items for now
            expiresAt
        }
    });

    return { success: true, expiresAt };
}

export async function checkReservationStatus(userId: string) {
    // Logic to run periodically or at checkout start
    // Find expired reservations for this user that were NOT converted to orders
    // This part is tricky without a cron job. 
    // A simpler approach: When user tries to reserve, we check his history?
    // Or we rely on the "failedReservationsCount" increments.
    // Since we don't have webhooks for "expiration", we can only punish when we NOTICE expiration.

    // Implementation:
    // When deleting expired reservations (in createReservation or cron), we should check who owned them.
    // If they expired without partial purchase, increment their fail count.

    // For now, let's implement a "Release & Punish" function called when cleaning up.
}

export async function releaseExpiredReservations() {
    const expiredReservations = await prisma.reservation.findMany({
        where: { expiresAt: { lt: new Date() } },
        include: { user: true }
    });

    for (const res of expiredReservations) {
        // Increment fail count
        await prisma.user.update({
            where: { id: res.userId },
            data: {
                failedReservationsCount: { increment: 1 }
            }
        });

        // Check for ban threshold
        const updatedUser = await prisma.user.findUnique({ where: { id: res.userId } });
        if (updatedUser && updatedUser.failedReservationsCount >= MAX_FAILED_RESERVATIONS) {
            const banUntil = new Date();
            banUntil.setHours(banUntil.getHours() + BAN_DURATION_HOURS);
            await prisma.user.update({
                where: { id: res.userId },
                data: {
                    reservationBanUntil: banUntil,
                    failedReservationsCount: 0 // Reset count after ban
                }
            });
        }
    }

    // Delete them
    await prisma.reservation.deleteMany({
        where: { expiresAt: { lt: new Date() } }
    });
}
