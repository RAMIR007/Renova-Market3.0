'use server';

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function trackEvent(type: string, target: string, path: string, metadata: any = {}) {
    try {
        // Simple session ID from IP (not perfect but OK for basic stats)
        const headerList = await headers();
        const ip = headerList.get("x-forwarded-for") || "unknown";
        const userAgent = headerList.get("user-agent") || "unknown";

        // Hash IP to be privacy friendly (simplified here)
        // In real app use crypto
        const sessionId = Buffer.from(`${ip}-${userAgent}`).toString('base64').substring(0, 24);

        await prisma.analyticsEvent.create({
            data: {
                type, // 'CLICK', 'VIEW'
                target, // 'whatsapp_btn', 'add_to_cart'
                path,
                sessionId,
                meta: metadata
            }
        });

        // If it's a page view, update DailyStat
        if (type === 'view') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Upsert Daily Stat
            // Prisma upsert needs unique constraint on date
            const stat = await prisma.dailyStat.findUnique({
                where: { date: today }
            });

            if (stat) {
                await prisma.dailyStat.update({
                    where: { id: stat.id },
                    data: { views: { increment: 1 } }
                });
            } else {
                await prisma.dailyStat.create({
                    data: {
                        date: today,
                        views: 1,
                        visitors: 1 // Rough estimate for new day record
                    }
                });
            }
        }

        return { success: true };
    } catch (error) {
        console.error("Tracking Error:", error);
        return { success: false };
    }
}
