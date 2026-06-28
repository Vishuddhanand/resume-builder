export interface GenerateSummaryBody {
    experienceLevel: string;
    skills: string[];
    jobTitle: string;
}

export interface GenerateSkillsBody {
    experienceLevel: string;
    jobTitle: string;
}

export interface GenerateProjectDescriptionBody {
    experienceLevel: string;
    jobTitle: string;
    technologiesUsed: string[];
}

export interface GenerateExperienceDescriptionBody {
    experienceLevel: string;
    jobTitle: string;
    technologiesUsed: string[];
}