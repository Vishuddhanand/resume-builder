import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

export const generateSummary = (body: {
    experienceLevel: string;
    skills: string[];
    jobTitle: string;
}) => api.post("/ai/generate-summary", body);

export const generateSkills = (body: {
    experienceLevel: string;
    jobTitle: string;
}) => api.post("/ai/generate-skills", body);

export const generateProjectDescription = (body: {
    experienceLevel: string;
    jobTitle: string;
    technologiesUsed: string[];
}) => api.post("/ai/generate-project-description", body);

export const generateExperienceDescription = (body: {
    experienceLevel: string;
    jobTitle: string;
    technologiesUsed: string[];
}) => api.post("/ai/generate-experience-description", body);

export const improveContent = (body: { content: string }) =>
    api.post("/ai/improve-content", body);

export const getAtsScore = (body: { resumeText: string }) =>
    api.post("/ai/ats-score", body);
