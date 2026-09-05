import {  } from "@/types/ai.types";
import { generateAIContent } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api.types";

export async function POST(req: Request) {
    try {

        const body= await req.json();

        const { resumeText } = body;

        if (!resumeText) {
            return NextResponse.json<ApiResponse>({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        const prompt = `Calculate the ATS score for the following resume text: ${resumeText}`;


        const AtsSCore = await generateAIContent(prompt);

        return NextResponse.json<ApiResponse>({ success: true, message: "ATS score calculated successfully", data: { atsScore: AtsSCore  } }, { status: 200 });

    } catch (error) {
        console.error("Error calculating ATS score:", error);
        return NextResponse.json<ApiResponse>({ success: false, message: "Failed to calculate ATS score", error: (error as Error).message }, { status: 500 });
    }
}