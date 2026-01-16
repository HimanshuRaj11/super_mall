import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_123';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Skip public assets and APIs
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // images, etc
    ) {
        return NextResponse.next();
    }

    // Public auth routes - redirect if logged in
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
        if (token) {
            try {
                const secret = new TextEncoder().encode(JWT_SECRET);
                await jwtVerify(token, secret);
                // If token is valid, redirect related to role or just home for now
                // Ideally checks role but basic is fine.
            } catch (e) {
                // Invalid token, stay on login page
                return NextResponse.next();
            }
        }
        return NextResponse.next();
    }

    // 1. Authenticate & Decode (If token exists)
    let userPayload: { id: string; role: string } | null = null;
    if (token) {
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const { payload } = await jwtVerify(token, secret);
            userPayload = {
                id: payload.id as string,
                role: payload.role as string,
            };
        } catch (error) {
            // Token invalid - ignore payload, treat as guest
        }
    }

    // 2. Define Protected Paths
    const isProtectedPage =
        pathname.startsWith('/admin') ||
        pathname.startsWith('/merchant') ||
        pathname.startsWith('/profile');

    const isProtectedApi =
        pathname.startsWith('/api/admin') ||
        pathname.startsWith('/api/merchant');

    // 3. Enforce Auth for Protected Routes
    if ((isProtectedPage || isProtectedApi) && !userPayload) {
        if (pathname.startsWith('/api')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // 4. Enforce Role Permissions
    if (userPayload) {
        const { role } = userPayload;

        // Admin Pages
        if (pathname.startsWith('/admin') && role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
        // Merchant Pages
        if (pathname.startsWith('/merchant') && role !== 'merchant' && role !== 'admin') {
            return NextResponse.redirect(new URL('/', req.url));
        }
        // Admin API
        if (pathname.startsWith('/api/admin') && role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
        // Merchant API
        if (pathname.startsWith('/api/merchant') && role !== 'merchant' && role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
    }

    // 5. Enhance Request (Inject Headers)
    // We recreate response/headers because NextRequest is immutable-ish for downstream
    const requestHeaders = new Headers(req.headers);
    if (userPayload) {
        requestHeaders.set('x-user-id', userPayload.id);
        requestHeaders.set('x-user-role', userPayload.role);
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/merchant/:path*',
        '/profile/:path*',
        '/api/admin/:path*',
        '/api/merchant/:path*',
        '/login',
        '/register',
        '/api/products/:path*' // Added to ensure headers are injected
    ],
};
