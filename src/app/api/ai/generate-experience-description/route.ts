import { GenerateExperienceDescriptionBody } from "@/types/ai.types";
import { generateAIContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: Request) {
    try {

        const body: GenerateExperienceDescriptionBody = await req.json();

        const { experienceLevel, jobTitle, technologiesUsed } = body;

        if (!experienceLevel || !jobTitle || !technologiesUsed || !Array.isArray(technologiesUsed) || technologiesUsed.length === 0) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Generate an experience description for a ${experienceLevel} ${jobTitle} who has experience with ${technologiesUsed.join(', ')}.`;


        let experienceDescription = await generateAIContent(prompt);

        if (typeof experienceDescription === 'string') {
            experienceDescription = JSON.parse(experienceDescription);
        }

        return NextResponse.json<ApiResponse>({ success: true, message: "Experience description generated successfully", data: { experienceDescription } }, { status: 200 });

    } catch (error) {
        console.error("Error generating experience description:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "Failed to generate experience description", error: (error as Error).message }, { status: 500 });
    }
}