import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    const isProtectedPath =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/merchant') ||
        pathname.startsWith('/profile');

    // Skip public assets and APIs
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // images, etc
    ) {
        return NextResponse.next();
    }

    // Public auth routes
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        if (token) {
            // If already logged in, redirect to dashboard/home
            // We'd verify here ideally, but simple check is okay for now
            // Better to verify to avoid loops with invalid tokens
        }
        return NextResponse.next();
    }

    if (isProtectedPath || pathname.startsWith('/api/admin') || pathname.startsWith('/api/merchant')) {
        if (!token) {
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);

            const role = payload.role as string;

            // Role based access
            if (pathname.startsWith('/admin') && role !== 'admin') {
                return NextResponse.redirect(new URL('/', req.url)); // or /unauthorized
            }

            if (pathname.startsWith('/merchant') && role !== 'merchant' && role !== 'admin') {
                return NextResponse.redirect(new URL('/', req.url));
            }

            if (pathname.startsWith('/api/admin') && role !== 'admin') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            if (pathname.startsWith('/api/merchant') && role !== 'merchant' && role !== 'admin') {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }

            // Add user info to headers for API routes ease
            const requestHeaders = new Headers(req.headers);
            requestHeaders.set('x-user-id', payload.id as string);
            requestHeaders.set('x-user-role', role);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            // Token invalid
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/merchant/:path*',
        '/profile/:path*',
        '/api/admin/:path*',
        '/api/merchant/:path*',
        '/login',
        '/register'
    ],
};
