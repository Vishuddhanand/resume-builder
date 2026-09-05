"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { getResume } from "@/apis/resume.api";
import { getAtsScore } from "@/apis/ai.api";
import { useToast } from "@/context/ToastContext";
import { IResume } from "@/types/resume.types";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { AxiosError } from "axios";

interface AtsResult {
    score: number;
    feedback: string;
}

export default function ResumePreviewPage({
    params,
}: {
    params: Promise<{ resumeId: string }>;
}) {
    const { resumeId } = use(params);
    const { showToast } = useToast();

    const [resume, setResume] = useState<IResume | null>(null);
    const [loading, setLoading] = useState(true);
    const [atsLoading, setAtsLoading] = useState(false);
    const [atsResult, setAtsResult] = useState<AtsResult | null>(null);
    const [jobDesc, setJobDesc] = useState("");

    useEffect(() => {
        getResume(resumeId)
            .then((res) => setResume(res.data?.data as IResume))
            .catch(() => showToast("Failed to load resume", "error"))
            .finally(() => setLoading(false));
    }, [resumeId, showToast]);

    function buildResumeText(r: IResume): string {
        const lines: string[] = [];
        const pi = r.personalInfo;
        if (pi?.fullname) lines.push(pi.fullname);
        if (pi?.email) lines.push(pi.email);
        if (r.summary) lines.push("SUMMARY", r.summary);
        if (r.experience?.length) {
            lines.push("EXPERIENCE");
            r.experience.forEach((e) => {
                lines.push(`${e.position} at ${e.company} (${e.startDate} - ${e.endDate || "Present"})`);
                e.responsibilities.forEach((resp) => resp && lines.push(`• ${resp}`));
            });
        }
        if (r.projects?.length) {
            lines.push("PROJECTS");
            r.projects.forEach((p) => {
                lines.push(`${p.name}: ${p.description}`);
                if (p.technologies.length) lines.push(`Technologies: ${p.technologies.join(", ")}`);
            });
        }
        if (r.education?.length) {
            lines.push("EDUCATION");
            r.education.forEach((e) => lines.push(`${e.degree} in ${e.fieldOfStudy} — ${e.institution}`));
        }
        if (r.skills?.length) lines.push("SKILLS", r.skills.join(", "));
        if (r.certificate?.length) lines.push("CERTIFICATES", ...r.certificate);
        if (jobDesc) lines.push("JOB DESCRIPTION", jobDesc);
        return lines.join("\n");
    }

    async function handleAtsScore() {
        if (!resume) return;
        setAtsLoading(true);
        try {
            const resumeText = buildResumeText(resume);
            const res = await getAtsScore({ resumeText });
            const raw = (res.data?.data as { atsScore: string })?.atsScore ?? "";
            const scoreMatch = raw.match(/\d+/);
            const score = scoreMatch ? parseInt(scoreMatch[0]) : 0;
            setAtsResult({ score: Math.min(score, 100), feedback: raw });
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            showToast(error.response?.data?.message || "Failed to calculate ATS score", "error");
        } finally {
            setAtsLoading(false);
        }
    }

    function handlePrint() {
        window.print();
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!resume) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 mb-4">Resume not found.</p>
                    <Link href="/dashboard" className="text-indigo-400 hover:underline">← Back</Link>
                </div>
            </div>
        );
    }

    const pi = resume.personalInfo;

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Top bar — no-print */}
            <div className="no-print sticky top-16 z-30 bg-slate-950/90 backdrop-blur-xl border-b border-white/8 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <Link
                        href={`/resume/${resumeId}`}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Editor
                    </Link>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm" onClick={handlePrint} id="print-resume-btn">
                            🖨 Print / Download PDF
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Resume print view */}
                <div className="lg:col-span-2">
                    <div
                        id="resume-print-area"
                        className="bg-white text-slate-900 rounded-2xl p-10 shadow-2xl min-h-[1000px] font-sans"
                        style={{ fontFamily: "'Times New Roman', serif" }}
                    >
                        {/* Header */}
                        <div className="border-b-2 border-slate-800 pb-5 mb-5 text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                                {pi?.fullname || "Your Name"}
                            </h1>
                            <div className="flex flex-wrap justify-center gap-3 text-slate-600 text-sm mt-2">
                                {pi?.email && <span>{pi.email}</span>}
                                {pi?.phone && <><span>·</span><span>{pi.phone}</span></>}
                                {pi?.address && <><span>·</span><span>{pi.address}</span></>}
                            </div>
                            <div className="flex flex-wrap justify-center gap-3 text-indigo-700 text-sm mt-1">
                                {pi?.linkedIn && <a href={pi.linkedIn}>{pi.linkedIn}</a>}
                                {pi?.github && <><span>·</span><a href={pi.github}>{pi.github}</a></>}
                                {pi?.portfolio && <><span>·</span><a href={pi.portfolio}>{pi.portfolio}</a></>}
                            </div>
                        </div>

                        {/* Summary */}
                        {resume.summary && (
                            <section className="mb-5">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Professional Summary</h2>
                                <p className="text-slate-700 text-sm leading-relaxed">{resume.summary}</p>
                            </section>
                        )}

                        {/* Experience */}
                        {(resume.experience?.length ?? 0) > 0 && (
                            <section className="mb-5">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Work Experience</h2>
                                {resume.experience!.map((exp, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-bold text-slate-900">{exp.position}</div>
                                                <div className="text-slate-600 text-sm font-medium">{exp.company}</div>
                                            </div>
                                            <div className="text-slate-500 text-xs text-right whitespace-nowrap ml-4">
                                                {exp.startDate} – {exp.endDate || "Present"}
                                            </div>
                                        </div>
                                        {exp.responsibilities.length > 0 && (
                                            <ul className="mt-2 space-y-1 list-disc list-inside text-slate-700 text-sm">
                                                {exp.responsibilities.filter(Boolean).map((r, ri) => <li key={ri}>{r}</li>)}
                                            </ul>
                                        )}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Projects */}
                        {(resume.projects?.length ?? 0) > 0 && (
                            <section className="mb-5">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Projects</h2>
                                {resume.projects!.map((proj, i) => (
                                    <div key={i} className="mb-4">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-slate-900">{proj.name}</span>
                                            <div className="flex gap-3 text-indigo-700 text-xs ml-4">
                                                {proj.liveUrl && <a href={proj.liveUrl}>Live ↗</a>}
                                                {proj.githubUrl && <a href={proj.githubUrl}>GitHub ↗</a>}
                                            </div>
                                        </div>
                                        {proj.technologies.length > 0 && (
                                            <div className="text-slate-400 text-xs mb-1">{proj.technologies.join(" · ")}</div>
                                        )}
                                        {proj.description && <p className="text-slate-700 text-sm">{proj.description}</p>}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Education */}
                        {(resume.education?.length ?? 0) > 0 && (
                            <section className="mb-5">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Education</h2>
                                {resume.education!.map((edu, i) => (
                                    <div key={i} className="flex justify-between mb-3">
                                        <div>
                                            <div className="font-bold text-slate-900">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</div>
                                            <div className="text-slate-600 text-sm">{edu.institution}</div>
                                        </div>
                                        <div className="text-slate-500 text-xs text-right ml-4">
                                            {edu.startDate} – {edu.endDate}
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Skills */}
                        {(resume.skills?.length ?? 0) > 0 && (
                            <section className="mb-5">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {resume.skills!.map((skill) => (
                                        <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">{skill}</span>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Certificates */}
                        {(resume.certificate?.filter(Boolean).length ?? 0) > 0 && (
                            <section>
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-1 mb-3">Certifications</h2>
                                <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                                    {resume.certificate!.filter(Boolean).map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </section>
                        )}
                    </div>
                </div>

                {/* ATS Score Panel */}
                <div className="no-print space-y-5">
                    <div className="glass-card p-5 bg-slate-900/50 border border-white/8">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                            <span>🎯</span> ATS Score Checker
                        </h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Paste a job description to see how well your resume matches.
                        </p>
                        <textarea
                            id="job-description-input"
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                            rows={5}
                            placeholder="Paste the job description here..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all hover:border-white/20 resize-none mb-3"
                        />
                        <Button
                            variant="primary"
                            size="md"
                            loading={atsLoading}
                            onClick={handleAtsScore}
                            className="w-full"
                            id="calculate-ats-btn"
                        >
                            Calculate ATS Score
                        </Button>

                        {/* Score display */}
                        {atsResult && (
                            <div className="mt-5 animate-fade-up">
                                {/* Gauge */}
                                <div className="flex flex-col items-center mb-4">
                                    <div className="relative w-32 h-32">
                                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={atsResult.score >= 70 ? "#10b981" : atsResult.score >= 50 ? "#f59e0b" : "#ef4444"}
                                                strokeWidth="10"
                                                strokeDasharray={`${(atsResult.score / 100) * 251.2} 251.2`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-3xl font-bold text-white">{atsResult.score}</span>
                                            <span className="text-xs text-slate-400">/100</span>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-semibold mt-1 ${atsResult.score >= 70 ? "text-emerald-400" : atsResult.score >= 50 ? "text-amber-400" : "text-red-400"}`}>
                                        {atsResult.score >= 70 ? "Great Match!" : atsResult.score >= 50 ? "Fair Match" : "Needs Improvement"}
                                    </p>
                                </div>

                                {/* Feedback */}
                                <div className="bg-slate-800/40 rounded-xl p-4">
                                    <p className="text-xs text-slate-400 font-medium mb-2">AI Feedback:</p>
                                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-20">
                                        {atsResult.feedback}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick info card */}
                    <div className="glass-card p-5 bg-slate-900/50 border border-white/8">
                        <h3 className="text-sm font-bold text-white mb-3">Resume Summary</h3>
                        <div className="space-y-2 text-xs text-slate-400">
                            <div className="flex justify-between">
                                <span>Skills</span>
                                <span className="text-slate-200 font-medium">{resume.skills?.length ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Experience entries</span>
                                <span className="text-slate-200 font-medium">{resume.experience?.length ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Projects</span>
                                <span className="text-slate-200 font-medium">{resume.projects?.length ?? 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Education</span>
                                <span className="text-slate-200 font-medium">{resume.education?.length ?? 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
