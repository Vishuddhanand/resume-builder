import { GenerateSkillsBody } from "@/types/ai.types";
import { generateAIContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: Request) {
    try {

        const body: GenerateSkillsBody = await req.json();

        const { experienceLevel, jobTitle } = body;

        if (!experienceLevel || !jobTitle) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Generate a list of skills for a ${experienceLevel} ${jobTitle}.`;


        let skills = await generateAIContent(prompt);

        if(typeof skills === 'string') {
            skills = JSON.parse(skills);
        }

        return NextResponse.json<ApiResponse>({ success: true, message: "Skills generated successfully", data: { skills } }, { status: 200 });

    } catch (error) {
        console.error("Error generating skills:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "Failed to generate skills", error: (error as Error).message }, { status: 500 });
    }
}