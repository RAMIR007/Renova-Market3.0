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

    // Dynamic Products
    const products = await prisma.product.findMany({
        select: {
            slug: true,
            updatedAt: true,
        }
    });

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic Categories
    const categories = await prisma.category.findMany({
        select: {
            slug: true,
            updatedAt: true,
        }
    });

    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/category/${category.slug}`,
        lastModified: category.updatedAt || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...categoryUrls, ...productUrls];
}
