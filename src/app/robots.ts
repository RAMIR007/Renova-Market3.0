import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://renovamarket.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/profile/', '/cart'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
