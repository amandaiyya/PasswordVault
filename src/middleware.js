import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = req.cookies.get("accessToken")?.value;

    const url = req.nextUrl;

    if(url.pathname === '/') {
        if(token) {
            return NextResponse.redirect(new URL('/vault', url.origin));
        } else {
            return NextResponse.redirect(new URL('/login', url.origin));
        }
    }

    if(url.pathname === '/signup' || url.pathname === '/login') {
        if(token) {
            return NextResponse.redirect(new URL('/vault', url.origin));
        } else {
            return NextResponse.next();
        }
    }

    if(url.pathname === '/api/sign-up' || url.pathname === '/api/login') return NextResponse.next();

    if(!token) {
        return NextResponse.json(
            {
                success: false,
                message: "Unauthorized"
            },
            { status: 401 }
        )
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/:path*'
    ]
}