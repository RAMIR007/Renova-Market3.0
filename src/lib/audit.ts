'use server';

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function createAuditLog(
    action: string,
    entity: string,
    entityId: string | null,
    details: any
) {
    try {
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get('session_token')?.value;

        if (!sessionToken) return; // Anonymous actions usually not logged or logged as system?

        const session = JSON.parse(sessionToken);
        const userId = session.id;

        await prisma.auditLog.create({
            data: {
                action,
                entity,
                entityId,
                details,
                userId
            }
        });
    } catch (error) {
        console.error("Failed to create audit log:", error);
        // Don't fail the main request just because logging failed
    }
}
