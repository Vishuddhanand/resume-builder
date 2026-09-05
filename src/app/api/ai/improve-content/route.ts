import { ImproveContentBody } from "@/types/ai.types";
import { generateAIContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: Request) {
    try {

        const body: ImproveContentBody = await req.json();

        const { content } = body;

        if (!content) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Improve the following content: ${content}`;


        const ImprovedContent = await generateAIContent(prompt);

        return NextResponse.json<ApiResponse>({ success: true, message: "Content improved successfully", data: { improvedContent: ImprovedContent } }, { status: 200 });

    } catch (error) {
        console.error("Error improving content:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "Failed to improve content", error: (error as Error).message }, { status: 500 });
    }
}