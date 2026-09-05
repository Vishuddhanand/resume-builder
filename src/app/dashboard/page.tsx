"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAllResumes, createResume } from "@/apis/resume.api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

interface ResumeCard {
    _id: string;
    title: string;
    summary: string;
    createdAt: string;
    updatedAt: string;
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
}

export default function DashboardPage() {
    const router = useRouter();
    const { user } = useAuth();
    const { showToast } = useToast();

    const [resumes, setResumes] = useState<ResumeCard[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    const fetchResumes = useCallback(async () => {
        try {
            const res = await getAllResumes();
            setResumes((res.data?.data as ResumeCard[]) ?? []);
        } catch {
            showToast("Failed to load resumes", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { fetchResumes(); }, [fetchResumes]);

    async function handleCreate() {
        setCreating(true);
        try {
            const res = await createResume();
            const r = res.data?.data as ResumeCard;
            router.push(`/resume/${r._id}`);
        } catch (err) {
            showToast((err as AxiosError<{ message: string }>).response?.data?.message ?? "Failed", "error");
            setCreating(false);
        }
    }

    return (
        <div style={{ minHeight: "100vh", background: "#080808", paddingTop: 80 }}>
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 32px" }}>
                <div style={{
                    display: "flex", alignItems: "center",
                    justifyContent: "space-between", marginBottom: 48, gap: 16,
                }}>
                    <div>
                        <h1 style={{
                            fontSize: 28, fontWeight: 700, color: "#fcfcfc",
                            letterSpacing: "-0.04em", marginBottom: 6,
                        }}>
                            {user?.name ? `${user.name.split(" ")[0]}'s resumes` : "My resumes"}
                        </h1>
                        <p style={{ fontSize: 14.5, color: "#666" }}>
                            {loading ? "Loading…" : resumes.length === 0
                                ? "No resumes yet"
                                : `${resumes.length} resume${resumes.length > 1 ? "s" : ""}`}
                        </p>
                    </div>

                    <button
                        onClick={handleCreate}
                        disabled={creating}
                        id="create-resume-btn"
                        style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "11px 20px", borderRadius: 10,
                            background: creating ? "#3d3d8f" : "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)",
                            color: "#fff", fontWeight: 600, fontSize: 14, border: "none",
                            cursor: creating ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease", whiteSpace: "nowrap" as const,
                            letterSpacing: "-0.01em",
                            boxShadow: creating ? "none" : "0 4px 14px rgba(91,91,214,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                        }}
                        onMouseEnter={e => !creating && (e.currentTarget.style.filter = "brightness(1.1)")}
                        onMouseLeave={e => !creating && (e.currentTarget.style.filter = "brightness(1)")}
                    >
                        {creating ? (
                            <>
                                <svg className="animate-spin-slow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
                                    <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                Creating…
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                New resume
                            </>
                        )}
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                height: 76, borderRadius: 12, background: "rgba(255,255,255,0.02)",
                                border: "1px solid rgba(255,255,255,0.05)",
                                marginBottom: 1,
                            }} className="skeleton" />
                        ))}
                    </div>
                ) : resumes.length === 0 ? (
                    <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        minHeight: 320, textAlign: "center",
                        background: "rgba(255,255,255,0.02)",
                        border: "1px dashed rgba(255,255,255,0.1)",
                        borderRadius: 16,
                    }} className="animate-fade-in">
                        <div style={{
                            width: 64, height: 64, borderRadius: 16,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: 24, fontSize: 24,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                        }}>
                            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 600, color: "#f0f0f0", marginBottom: 8, letterSpacing: "-0.02em" }}>
                            No resumes yet
                        </p>
                        <p style={{ fontSize: 14.5, color: "#666", marginBottom: 32 }}>
                            Create your first resume to get started.
                        </p>
                        <button
                            onClick={handleCreate}
                            id="create-first-resume-btn"
                            style={{
                                padding: "10px 20px", borderRadius: 10,
                                background: "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)", color: "#fff",
                                fontWeight: 600, fontSize: 14, border: "none",
                                cursor: "pointer", letterSpacing: "-0.01em",
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 14px rgba(91,91,214,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                            }}
                            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
                            onMouseLeave={e => e.currentTarget.style.filter = "brightness(1)"}
                        >
                            Create resume
                        </button>
                    </div>
                ) : (
                    <div style={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 14, overflow: "hidden",
                        background: "rgba(255,255,255,0.02)",
                        boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
                    }} className="animate-fade-in">
                        {resumes.map((resume, idx) => (
                            <div
                                key={resume._id}
                                style={{
                                    display: "flex", alignItems: "center",
                                    padding: "20px 24px", gap: 16,
                                    borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined,
                                    background: "transparent",
                                    transition: "background 0.2s ease",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                                }}>
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontSize: 15, fontWeight: 600, color: "#f0f0f0",
                                        letterSpacing: "-0.01em", marginBottom: 4,
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                                    }}>
                                        {resume.title || <span style={{ color: "#444" }}>Untitled resume</span>}
                                    </p>
                                    <p style={{
                                        fontSize: 13, color: "#666",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const,
                                    }}>
                                        Updated {timeAgo(resume.updatedAt)}
                                    </p>
                                </div>

                                <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
                                    <Link
                                        href={`/resume/${resume._id}/preview`}
                                        id={`preview-${resume._id}`}
                                        style={{
                                            padding: "8px 16px", borderRadius: 8,
                                            border: "1px solid rgba(255,255,255,0.12)",
                                            color: "#a0a0a0", fontSize: 13, fontWeight: 500,
                                            textDecoration: "none", transition: "all 0.2s ease",
                                            letterSpacing: "-0.01em",
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.color = "#f0f0f0"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.color = "#a0a0a0"; e.currentTarget.style.background = "transparent"; }}
                                    >
                                        Preview
                                    </Link>
                                    <Link
                                        href={`/resume/${resume._id}`}
                                        id={`edit-${resume._id}`}
                                        style={{
                                            padding: "8px 16px", borderRadius: 8,
                                            background: "rgba(91,91,214,0.12)",
                                            border: "1px solid rgba(91,91,214,0.3)",
                                            color: "#8a8ad9", fontSize: 13, fontWeight: 500,
                                            textDecoration: "none", transition: "all 0.2s ease",
                                            letterSpacing: "-0.01em",
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(91,91,214,0.2)"; e.currentTarget.style.color = "#a8a8e8"; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(91,91,214,0.12)"; e.currentTarget.style.color = "#8a8ad9"; }}
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={handleCreate}
                            id="add-new-resume-card"
                            style={{
                                display: "flex", alignItems: "center", gap: 10,
                                width: "100%", padding: "16px 24px",
                                borderTop: "1px solid rgba(255,255,255,0.06)",
                                background: "rgba(255,255,255,0.01)", border: "none",
                                cursor: "pointer", color: "#666", fontSize: 14, fontWeight: 500,
                                transition: "all 0.2s ease", letterSpacing: "-0.01em",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#a0a0a0"; }}
                            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.01)"; e.currentTarget.style.color = "#666"; }}
                        >
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            New resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
