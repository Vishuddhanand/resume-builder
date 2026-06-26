import { GenerateSummaryBody } from "@/types/ai.types";
import { generateAIContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: Request) {
    try {

        const body: GenerateSummaryBody = await req.json();

        const { experienceLevel, skills, jobTitle } = body;

        if (!experienceLevel || !skills || !jobTitle) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Generate a professional summary for a ${experienceLevel} ${jobTitle} with the following skills: ${skills.join(", ")}.`;


        const summary = await generateAIContent(prompt);

        return NextResponse.json<ApiResponse>({ success: true, message: "Summary generated successfully", data: { summary } }, { status: 200 });

    } catch (error) {
        console.error("Error generating summary:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "Failed to generate summary", error: (error as Error).message }, { status: 500 });
    }
}