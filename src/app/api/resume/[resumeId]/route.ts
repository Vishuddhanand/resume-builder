import { ApiResponse } from "@/types/api.types";
import { NextRequest, NextResponse } from "next/server";
import resumeModel from "@/models/resume.model";
import { connectToDB } from "@/lib/database";
import getCurrentUser from "@/lib/getCurrentUser";


export async function GET(req: NextRequest,

    { params }: { params: Promise<{ resumeId: string }> }
) {

    try {

        await connectToDB();

        const user = await getCurrentUser();

        const { resumeId } = await params;

        const resume = await resumeModel.findById({
            _id: resumeId,
            user_id: user.userId
        });

        if (!resume) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false, message: "Resume not found",

                },

                { status: 404 });
        }


        return NextResponse.json<ApiResponse>(
            { success: true, message: "Resume fetched successfully", data: resume },
            { status: 200 }
        );

    }

    catch (error) {
        console.error("Error fetching resume:", error);

        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Failed to fetch resume"
            },

            { status: 500 }

        );
    }

}


export async function PATCH(req: NextRequest,

    { params }: { params: Promise<{ resumeId: string }> }
) {

    try {

        await connectToDB();

        const body = await req.json();

        const user = await getCurrentUser();

        const { resumeId } = await params;

        const updateResume = await resumeModel.findByIdAndUpdate(
            { _id: resumeId, user_id: user.userId },
            {
                $set: body
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updateResume) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false, message: "Resume not updated",

                },

                { status: 400 });
        }


        return NextResponse.json<ApiResponse>(
            { success: true, message: "Resume updated successfully", data: updateResume },
            { status: 200 }
        );

    }

    catch (error) {
        console.error("Error updating resume:", error);

        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: "Failed to update resume"
            },

            { status: 500 }

        );
    }

}