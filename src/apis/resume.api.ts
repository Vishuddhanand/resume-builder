import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export const createResume = () => api.post("/resume/create");

export const getAllResumes = () => api.get("/resume");

export const getResume = (resumeId: string) => api.get(`/resume/${resumeId}`);

export const updateResume = (resumeId: string, body: object) =>
    api.patch(`/resume/${resumeId}`, body);

export const deleteResume = (resumeId: string) =>
    api.delete(`/resume/${resumeId}`);
