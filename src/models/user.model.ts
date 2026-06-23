import { IUser } from "@/types/user.types";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt"


interface UserDocument extends Omit<IUser, '_id'>, Document {
    comparePassword(candidatePassword: string): boolean
}


const userSchema = new mongoose.Schema<UserDocument>({
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
        minLength: [10, 'Minimum length should be 10 characters'],
        maxLength: [10, 'Maximum length should be 10 characters'],
        unique: [true, 'Mobile number must be unique']
    }
}, {
    timestamps: true
})



userSchema.pre('save', function (): void {
    if (!this.isModified('password')) return
    this.password = bcrypt.hashSync(this.password, 10)

})

userSchema.methods.comparePassword = function (candidatePassword: string): boolean {
    return bcrypt.compareSync(candidatePassword, this.password)
}


const userModel = mongoose.model('User', userSchema)

export default userModel