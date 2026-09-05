import { ApiResponse } from "@/types/api.types";
import { NextResponse } from "next/server";
import resumeModel from "@/models/resume.model";
import { connectToDB } from "@/lib/database";
import getCurrentUser from "@/lib/getCurrentUser";

export async function GET() {
    try {
        await connectToDB();

        const user = await getCurrentUser();

        const resumes = await resumeModel
            .find({ userId: user.userId })
            .select("_id title summary createdAt updatedAt")
            .sort({ updatedAt: -1 });

        return NextResponse.json<ApiResponse>(
            { success: true, message: "Resumes fetched successfully", data: resumes as unknown as object },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching resumes:", error);
        return NextResponse.json<ApiResponse>(
            { success: false, message: "Failed to fetch resumes" },
            { status: 500 }
        );
    }
}
