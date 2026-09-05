import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json<ApiResponse>(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/",
        });

        return response;
    } catch (error) {
        console.error("Error logging out:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to logout" },
            { status: 500 }
        );
    }
}
