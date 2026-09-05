import { NextRequest, NextResponse } from "next/server";
import { authGuard } from "@/middlewares/authGuard";

/**
 * Next.js Middleware entry point.
 * Logic is delegated to src/middlewares/authGuard.ts
 * (Next.js requires this file to live at src/middleware.ts)
 */
export function middleware(req: NextRequest) {
    return authGuard(req) ?? NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*", "/resume/:path*", "/auth/:path*"],
};
