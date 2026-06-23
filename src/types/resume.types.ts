import { Types } from "mongoose";

export interface IPersonalInfo {
    fullname: string;
    email: string;
    phone: string;
    address: string;
    linkedIn: string;
    github: string;
    portfolio: string;
}

export interface IEducation {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
}

export interface IExperience {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
}

export interface IProject {
    name: string;
    description: string;
    technologies: string[];
    liveUrl: string;
    githubUrl: string;
}

export interface IResume {
    _id?: string;
    userId: Types.ObjectId;
    title: string;
    summary: string;
    certificate?: string[];
    personalInfo: IPersonalInfo;
    education: IEducation[];
    experience?: IExperience[];
    projects: IProject[];
    skills: string[];
    createdAt?: Date;
    updatedAt?: Date;

}