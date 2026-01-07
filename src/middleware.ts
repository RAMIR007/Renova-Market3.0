import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Only check paths starting with /admin
    if (request.nextUrl.pathname.startsWith('/admin')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/admin/login') {
            const token = request.cookies.get('session_token')
            // If already logged in, redirect to admin
            if (token) {
                return NextResponse.redirect(new URL('/admin', request.url))
            }
            return NextResponse.next()
        }

        // Check for session cookie
        const token = request.cookies.get('session_token')

        if (!token) {
            // If not logged in, redirect to login page
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/admin/:path*',
}
