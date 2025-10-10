import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = req.cookies.get("accessToken")?.value;
    const url = req.nextUrl.clone();

    const publicPaths = ['/login', '/signup', '/vault', '/api/signup', '/api/login'];

    if(url.pathname === '/') {
        if(token) {
            return NextResponse.redirect(new URL('/vault', url.origin));
        } else {
            return NextResponse.redirect(new URL('/login', url.origin));
        }
    }

    if(publicPaths.includes(url.pathname)) {
        if(token && (url.pathname === '/login' || url.pathname === '/signup')) {
            return NextResponse.redirect(new URL('/vault', url.origin));
        }

        else if(!token && (url.pathname === '/vault')) {
            return NextResponse.redirect(new URL('/login', url.origin));
        }

        else {
            return NextResponse.next();
        }
    }

    if(!token) return NextResponse.redirect(new URL('/login', url.origin));

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/signup',
        '/login',
        '/vault',
        '/api/:path*'
    ]
}