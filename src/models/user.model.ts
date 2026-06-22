import { IUser } from "@/types/user.types";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email must be unique']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [6, 'Minimum length should be 6 characters']
    },
    mobile: {
        type: String,
        minLength: 10
    }
})

