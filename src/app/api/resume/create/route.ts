import { NextRequest } from "next/server";
import { connectToDB } from "@/lib/database";
import getCurrentUser from "@/lib/getCurrentUser";
import resumeModel from "@/models/resume.model";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDB()

        const user = await getCurrentUser()

        const newResume = await resumeModel.create({
            userId: user.userId,
            title: '',
            summary: '',
            certificate: [],
            personalInfo: {},
            education: [],
            experience: [],
            projects: [],
            skills: []
        })

        return NextResponse.json({
            success: true,
            message: 'Resume created successfully',
            data: newResume
        }, { status: 201 })

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: 'Failed to create resume',
            error: (error as Error).message
        }, { status: 500 })

    }
}