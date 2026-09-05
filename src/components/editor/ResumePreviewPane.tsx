"use client";

import React from "react";
import { IResume } from "@/types/resume.types";

interface Props {
    resume: Partial<IResume>;
}

export default function ResumePreviewPane({ resume }: Props) {
    const pi = resume.personalInfo;

    return (
        <div className="bg-white text-slate-900 rounded-xl p-6 text-xs font-sans shadow-2xl min-h-[500px] overflow-auto">
            {/* Header */}
            <div className="border-b border-slate-200 pb-4 mb-4 text-center">
                <h1 className="text-xl font-bold text-slate-900">
                    {pi?.fullname || <span className="text-slate-300">Your Name</span>}
                </h1>
                <div className="flex flex-wrap justify-center gap-2 text-slate-500 text-[10px] mt-1">
                    {pi?.email && <span>{pi.email}</span>}
                    {pi?.phone && <><span>·</span><span>{pi.phone}</span></>}
                    {pi?.address && <><span>·</span><span>{pi.address}</span></>}
                </div>
                <div className="flex flex-wrap justify-center gap-2 text-indigo-600 text-[10px] mt-1">
                    {pi?.linkedIn && <a href={pi.linkedIn} className="hover:underline">{pi.linkedIn}</a>}
                    {pi?.github && <><span>·</span><a href={pi.github} className="hover:underline">{pi.github}</a></>}
                    {pi?.portfolio && <><span>·</span><a href={pi.portfolio} className="hover:underline">{pi.portfolio}</a></>}
                </div>
            </div>

            {/* Summary */}
            {resume.summary && (
                <section className="mb-4">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Summary</h2>
                    <p className="text-slate-700 leading-relaxed">{resume.summary}</p>
                </section>
            )}

            {/* Experience */}
            {(resume.experience?.length ?? 0) > 0 && (
                <section className="mb-4">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Experience</h2>
                    {resume.experience!.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-900">{exp.position}</span>
                                <span className="text-slate-400">{exp.startDate} – {exp.endDate || "Present"}</span>
                            </div>
                            <div className="text-slate-600 mb-1">{exp.company}</div>
                            {exp.responsibilities.length > 0 && (
                                <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                                    {exp.responsibilities.filter(Boolean).map((r, ri) => (
                                        <li key={ri}>{r}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* Projects */}
            {(resume.projects?.length ?? 0) > 0 && (
                <section className="mb-4">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Projects</h2>
                    {resume.projects!.map((proj, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between">
                                <span className="font-bold text-slate-900">{proj.name}</span>
                                {(proj.liveUrl || proj.githubUrl) && (
                                    <div className="flex gap-2 text-indigo-600">
                                        {proj.liveUrl && <a href={proj.liveUrl} className="hover:underline">Live</a>}
                                        {proj.githubUrl && <a href={proj.githubUrl} className="hover:underline">GitHub</a>}
                                    </div>
                                )}
                            </div>
                            {proj.technologies.length > 0 && (
                                <div className="text-slate-400 text-[10px] mb-1">{proj.technologies.join(", ")}</div>
                            )}
                            {proj.description && <p className="text-slate-700">{proj.description}</p>}
                        </div>
                    ))}
                </section>
            )}

            {/* Education */}
            {(resume.education?.length ?? 0) > 0 && (
                <section className="mb-4">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Education</h2>
                    {resume.education!.map((edu, i) => (
                        <div key={i} className="mb-2 flex justify-between">
                            <div>
                                <div className="font-bold text-slate-900">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                                <div className="text-slate-600">{edu.institution}</div>
                            </div>
                            <div className="text-slate-400 text-right text-[10px]">
                                {edu.startDate} – {edu.endDate}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Skills */}
            {(resume.skills?.length ?? 0) > 0 && (
                <section className="mb-4">
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {resume.skills!.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px]">{skill}</span>
                        ))}
                    </div>
                </section>
            )}

            {/* Certificates */}
            {(resume.certificate?.length ?? 0) > 0 && (
                <section>
                    <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-2">Certificates</h2>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                        {resume.certificate!.filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}
                    </ul>
                </section>
            )}
        </div>
    );
}
