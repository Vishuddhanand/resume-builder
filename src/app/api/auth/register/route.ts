import { connectToDB } from "@/lib/database";
import { generateToken } from "@/lib/jwt";
import userModel from "@/models/user.model";
import { ApiResponse } from "@/types/api.types";
import { RegisterBody } from "@/types/user.types";
import { NextRequest, NextResponse } from "next/server";


async function POST(req: NextRequest) {
    try {

        await connectToDB()
        const body: RegisterBody = await req.json()

        const { name, email, password, mobile } = body

        if (!name || !email || !password) return NextResponse.json<ApiResponse>({
            success: false, message: "Provide all the necessary fields"
        }, {
            status: 400
        })

        const isUserExists = await userModel.findOne({ email })

        if (isUserExists) return NextResponse.json({
            success: false, message: "User Already Exists"
        }, { status: 401 })


        const newUser = await userModel.create({
            name, email, password, mobile
        })

        const response = NextResponse.json({
            success: true, message: "User Registered Successfully"
        }, { status: 201 })

        const token = generateToken({ userid: newUser._id.toString() })
        response.cookies.set('token', token)

        return response

    } catch (error) {
        return NextResponse.json<ApiResponse>({
            success: false, message: "Internal Server Error", error: (error as Error).message
        }, { status: 500 })
    }

}