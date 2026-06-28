import { GenerateProjectDescriptionBody } from "@/types/ai.types";
import { generateAIContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: Request) {
    try {

        const body: GenerateProjectDescriptionBody = await req.json();

        const { experienceLevel, jobTitle, technologiesUsed } = body;

        if (!experienceLevel || !jobTitle || !technologiesUsed || !Array.isArray(technologiesUsed) || technologiesUsed.length === 0) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Generate a project description for a ${experienceLevel} ${jobTitle} who has experience with ${technologiesUsed.join(', ')}.`;


        let projectDescription = await generateAIContent(prompt);

        if(typeof projectDescription === 'string') {
            projectDescription = JSON.parse(projectDescription);
        }

        return NextResponse.json<ApiResponse>({ success: true, message: "Project description generated successfully", data: { projectDescription } }, { status: 200 });

    } catch (error) {
        console.error("Error generating project description:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "Failed to generate project description", error: (error as Error).message }, { status: 500 });
    }
}