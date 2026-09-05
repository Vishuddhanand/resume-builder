"use client";

import React, { useEffect, useState, useCallback, use } from "react";
import Link from "next/link";
import { getResume, updateResume } from "@/apis/resume.api";
import { useToast } from "@/context/ToastContext";
import { IResume } from "@/types/resume.types";
import PersonalInfoForm from "@/components/editor/PersonalInfoForm";
import SummaryForm from "@/components/editor/SummaryForm";
import EducationForm from "@/components/editor/EducationForm";
import ExperienceForm from "@/components/editor/ExperienceForm";
import ProjectsForm from "@/components/editor/ProjectsForm";
import SkillsForm from "@/components/editor/SkillsForm";
import CertificatesForm from "@/components/editor/CertificatesForm";
import ResumePreviewPane from "@/components/editor/ResumePreviewPane";

type TabId = "personal" | "summary" | "education" | "experience" | "projects" | "skills" | "certificates";

const TABS: { id: TabId; label: string }[] = [
    { id: "personal",     label: "Personal" },
    { id: "summary",      label: "Summary" },
    { id: "education",    label: "Education" },
    { id: "experience",   label: "Experience" },
    { id: "projects",     label: "Projects" },
    { id: "skills",       label: "Skills" },
    { id: "certificates", label: "Certificates" },
];

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
    let t: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); }) as T;
}

export default function ResumeEditorPage({ params }: { params: Promise<{ resumeId: string }> }) {
    const { resumeId } = use(params);
    const { showToast } = useToast();

    const [resume, setResume] = useState<Partial<IResume> | null>(null);
    const [loading, setLoading] = useState(true);
    const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
    const [activeTab, setActiveTab] = useState<TabId>("personal");
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        getResume(resumeId)
            .then(res => setResume(res.data?.data as IResume))
            .catch(() => showToast("Failed to load resume", "error"))
            .finally(() => setLoading(false));
    }, [resumeId, showToast]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const autoSave = useCallback(
        debounce(async (data: Partial<IResume>) => {
            setSaveState("saving");
            try {
                await updateResume(resumeId, data);
                setSaveState("saved");
                setTimeout(() => setSaveState("idle"), 2000);
            } catch {
                setSaveState("idle");
            }
        }, 1200),
        [resumeId]
    );

    function patch<K extends keyof IResume>(field: K, value: IResume[K]) {
        setResume(prev => {
            if (!prev) return prev;
            const updated = { ...prev, [field]: value };
            autoSave(updated);
            return updated;
        });
    }

    if (loading) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808" }}>
            <svg className="animate-spin-slow" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#5b5bd6" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </div>
    );

    if (!resume) return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#080808" }}>
            <div style={{ textAlign: "center" }}>
                <p style={{ color: "#666", marginBottom: 20, fontSize: 15 }}>Resume not found.</p>
                <Link href="/dashboard" style={{
                    color: "#5b5bd6", fontSize: 14, fontWeight: 500,
                    textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6
                }}>
                    ← Back to dashboard
                </Link>
            </div>
        </div>
    );

    return (
        <div style={{ minHeight: "100vh", background: "#080808", paddingTop: 80 }}>
            <div style={{
                position: "sticky", top: 80, zIndex: 40,
                height: 56,
                background: "rgba(8,8,8,0.85)",
                backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center",
                padding: "0 24px", gap: 16,
            }}>
                <Link
                    href="/dashboard"
                    style={{ color: "#555", display: "flex", alignItems: "center", gap: 4, textDecoration: "none", transition: "color 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.color = "#a0a0a0"}
                    onMouseLeave={e => e.currentTarget.style.color = "#555"}
                >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>

                <input
                    id="resume-title"
                    value={resume.title ?? ""}
                    onChange={e => patch("title", e.target.value)}
                    placeholder="Untitled resume"
                    style={{
                        flex: 1, maxWidth: 320,
                        background: "transparent", border: "none", outline: "none",
                        fontSize: 15, fontWeight: 600, color: "#f5f5f5",
                        letterSpacing: "-0.01em", transition: "color 0.2s",
                    }}
                    onFocus={e => e.currentTarget.style.color = "#fff"}
                    onBlur={e => e.currentTarget.style.color = "#f5f5f5"}
                />

                <span style={{
                    fontSize: 12, fontWeight: 600, letterSpacing: "0.02em",
                    color: saveState === "saving" ? "#666" : saveState === "saved" ? "#22c55e" : "transparent",
                    transition: "color 0.3s ease",
                }}>
                    {saveState === "saving" ? "Saving…" : "Saved"}
                </span>

                <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
                    <button
                        onClick={() => setShowPreview(v => !v)}
                        id="toggle-preview-btn"
                        style={{
                            padding: "6px 14px", borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: showPreview ? "rgba(255,255,255,0.08)" : "transparent",
                            color: showPreview ? "#f0f0f0" : "#888",
                            fontSize: 13, fontWeight: 600, cursor: "pointer",
                            transition: "all 0.2s ease", letterSpacing: "-0.01em",
                        }}
                    >
                        Preview
                    </button>
                    <Link
                        href={`/resume/${resumeId}/preview`}
                        id="full-preview-link"
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "6px 14px", borderRadius: 8,
                            background: "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)", color: "#fff",
                            fontSize: 13, fontWeight: 600, textDecoration: "none",
                            transition: "all 0.2s ease", letterSpacing: "-0.01em",
                            boxShadow: "0 2px 8px rgba(91,91,214,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                        onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                    >
                        Full view
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div style={{
                maxWidth: showPreview ? 1400 : 800,
                margin: "0 auto", padding: "48px 24px",
                display: showPreview ? "grid" : "block",
                gridTemplateColumns: showPreview ? "1fr 440px" : undefined,
                gap: 48,
            }}>
                <div>
                    <div style={{
                        display: "flex", gap: 4, marginBottom: 40,
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        paddingBottom: 0, overflowX: "auto",
                    }}>
                        {TABS.map(tab => {
                            const active = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    id={`tab-${tab.id}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        padding: "10px 16px",
                                        fontSize: 13.5, fontWeight: active ? 600 : 500,
                                        color: active ? "#f5f5f5" : "#666",
                                        background: "none", border: "none",
                                        borderBottom: active ? "2px solid #5b5bd6" : "2px solid transparent",
                                        marginBottom: -1,
                                        cursor: "pointer",
                                        transition: "all 0.2s ease",
                                        letterSpacing: "-0.01em",
                                        whiteSpace: "nowrap" as const,
                                    }}
                                    onMouseEnter={e => !active && (e.currentTarget.style.color = "#a0a0a0")}
                                    onMouseLeave={e => !active && (e.currentTarget.style.color = "#666")}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="animate-fade-in">
                        <h2 style={{
                            fontSize: 16, fontWeight: 700, color: "#f0f0f0",
                            letterSpacing: "-0.01em", marginBottom: 28,
                        }}>
                            {TABS.find(t => t.id === activeTab)?.label}
                        </h2>

                        {activeTab === "personal"     && <PersonalInfoForm data={resume.personalInfo ?? {}} onChange={v => patch("personalInfo", v as IResume["personalInfo"])} />}
                        {activeTab === "summary"      && <SummaryForm value={resume.summary ?? ""} onChange={v => patch("summary", v)} />}
                        {activeTab === "education"    && <EducationForm data={resume.education ?? []} onChange={v => patch("education", v)} />}
                        {activeTab === "experience"   && <ExperienceForm data={resume.experience ?? []} onChange={v => patch("experience", v)} />}
                        {activeTab === "projects"     && <ProjectsForm data={resume.projects ?? []} onChange={v => patch("projects", v)} />}
                        {activeTab === "skills"       && <SkillsForm data={resume.skills ?? []} onChange={v => patch("skills", v)} />}
                        {activeTab === "certificates" && <CertificatesForm data={resume.certificate ?? []} onChange={v => patch("certificate", v)} />}
                    </div>
                </div>

                {showPreview && (
                    <div style={{ position: "sticky", top: 160, alignSelf: "start" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 16 }}>
                            Live preview
                        </p>
                        <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto", borderRadius: 12, boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 64px rgba(0,0,0,0.5)" }}>
                            <ResumePreviewPane resume={resume} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
