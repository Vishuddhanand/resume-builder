import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/database";
import { LoginBody } from "@/types/user.types";
import { ApiResponse } from "@/types/api.types";
import userModel from "@/models/user.model";

async function POST(req: NextRequest) {
    try {
        await connectToDB()
        const body: LoginBody = await req.json()

        const { email, password } = body
        if (!email || !password) return NextResponse.json<ApiResponse>({
            success: false, message: "email or password not received"
        }, { status: 400 })

        const isUserExists = await userModel.findOne({ email })

        if (!isUserExists) return NextResponse.json<ApiResponse>({
            success: false, message: "Invalid Credentials"
        }, { status: 401 })

        const isPasswordMatched = isUserExists.comparePassword(password)

        if (!isPasswordMatched) return NextResponse.json<ApiResponse>({
            success: false, message: "Invalid Credentials"
        }, { status: 401 })

        return NextResponse.json<ApiResponse>({
            success: true, message: "Login Successful"
        }, { status: 200 })

    } catch (error) {

        return NextResponse.json<ApiResponse>({
            success: false, message: "Internal Server Error", error: (error as Error).message
        }, { status: 500 })
    }
}