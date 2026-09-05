import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

const PROTECTED = ["/dashboard", "/resume"];
const AUTH_ONLY  = ["/auth/login", "/auth/register"];

/**
 * Auth guard middleware.
 * - Redirects unauthenticated users away from protected routes → /auth/login
 * - Redirects authenticated users away from auth pages → /dashboard
 */
export function authGuard(req: NextRequest): NextResponse | null {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    const isProtected = PROTECTED.some(p => pathname.startsWith(p));
    const isAuthPage  = AUTH_ONLY.some(p => pathname.startsWith(p));

    // 1. Protected route — must be authenticated
    if (isProtected) {
        if (!token) {
            return NextResponse.redirect(new URL("/auth/login", req.url));
        }
        try {
            verifyToken(token);
        } catch {
            const res = NextResponse.redirect(new URL("/auth/login", req.url));
            res.cookies.set("token", "", { expires: new Date(0) });
            return res;
        }
    }

    // 2. Auth pages — bounce logged-in users to dashboard
    if (isAuthPage && token) {
        try {
            verifyToken(token);
            return NextResponse.redirect(new URL("/dashboard", req.url));
        } catch {
            // Invalid token — let them through
        }
    }

    return null; // No redirect needed
}
