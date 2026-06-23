import mongoose from "mongoose";
import { IResume } from "@/types/resume.types";

const resumeSchema = new mongoose.Schema<IResume>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        default: ''
    },
    summary: {
        type: String,
        required: true,
        default: ''
    },
    certificate: {
        type: [String],
        default: []
    },
    personalInfo: {
        type: {
            fullname: String,
            email: String,
            phone: String,
            address: String,
            linkedIn: String,
            github: String,
            portfolio: String
        }
        ,
        default: {}
    },
    education: {
        type:
            [
                {
                    institution: String,
                    degree: String,
                    fieldOfStudy: String,
                    startDate: String,
                    endDate: String
                }
            ]
        ,
        default: []
    },
    projects: {
        type: [
            {
                name: String,
                description: String,
                technologies: [String],
                liveUrl: String,
                githubUrl: String
            }
        ],
        default: []
    },
    experience: {
        type: [
            {
                company: String,
                position: String,
                startDate: String,
                endDate: String,
                responsibilities: [String]
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        required: true,
        default: []
    }


}, {
    timestamps: true
})

const resumeModel = mongoose.model('Resume', resumeSchema)

export default resumeModel