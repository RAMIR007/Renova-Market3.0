import { prisma } from '@/lib/prisma';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamarket.com';

    // Static Routes
    const routes = [
        '',
        '/shop',
        '/about',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic Products (Limited to 100 to avoid build timeouts on free DB tier)
    let productUrls: MetadataRoute.Sitemap = [];
    try {
        const products = await prisma.product.findMany({
            select: { slug: true, updatedAt: true },
            take: 100, // Limit to recent 100
            orderBy: { updatedAt: 'desc' }
        });
        productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: product.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Sitemap Products Error:", e);
    }

    // Dynamic Categories
    let categoryUrls: MetadataRoute.Sitemap = [];
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true, updatedAt: true },
        });
        categoryUrls = categories.map((category) => ({
            url: `${baseUrl}/category/${category.slug}`,
            lastModified: category.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Sitemap Categories Error:", e);
    }

    return [...routes, ...categoryUrls, ...productUrls];
}
