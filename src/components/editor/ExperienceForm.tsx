"use client";

import React, { useState } from "react";
import { IExperience } from "@/types/resume.types";
import { generateExperienceDescription } from "@/apis/ai.api";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

interface Props { data: IExperience[]; onChange: (d: IExperience[]) => void; }

const empty = (): IExperience => ({ company: "", position: "", startDate: "", endDate: "", responsibilities: [""] });

const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", padding: "8px 11px", fontSize: 13.5,
    background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
    color: "#e8e8e8", outline: "none", transition: "border-color 0.15s", letterSpacing: "-0.01em",
};

function F({ id, label, ph, value, onChange }: { id: string; label: string; ph?: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label htmlFor={id} style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5 }}>{label}</label>
            <input id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={ph} style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
        </div>
    );
}

export default function ExperienceForm({ data, onChange }: Props) {
    const { showToast } = useToast();
    const [aiModal, setAiModal] = useState<number | null>(null);
    const [aiForm, setAiForm] = useState({ experienceLevel: "", jobTitle: "", technologies: "" });
    const [generating, setGenerating] = useState(false);

    const add = () => onChange([...data, empty()]);
    const remove = (i: number) => onChange(data.filter((_, n) => n !== i));
    const updField = (i: number, k: keyof IExperience, v: string) =>
        onChange(data.map((e, n) => n === i ? { ...e, [k]: v } : e));
    const updResp = (ei: number, ri: number, v: string) =>
        onChange(data.map((e, n) => n === ei ? { ...e, responsibilities: e.responsibilities.map((r, m) => m === ri ? v : r) } : e));
    const addResp = (ei: number) =>
        onChange(data.map((e, n) => n === ei ? { ...e, responsibilities: [...e.responsibilities, ""] } : e));
    const removeResp = (ei: number, ri: number) =>
        onChange(data.map((e, n) => n === ei ? { ...e, responsibilities: e.responsibilities.filter((_, m) => m !== ri) } : e));

    async function genAI(idx: number) {
        if (!aiForm.experienceLevel || !aiForm.jobTitle || !aiForm.technologies) { showToast("Fill all fields", "error"); return; }
        setGenerating(true);
        try {
            const res = await generateExperienceDescription({
                experienceLevel: aiForm.experienceLevel, jobTitle: aiForm.jobTitle,
                technologiesUsed: aiForm.technologies.split(",").map(t => t.trim()),
            });
            const raw = (res.data?.data as { experienceDescription: string | string[] })?.experienceDescription;
            const bullets = Array.isArray(raw) ? raw.map(String) : [String(raw)];
            onChange(data.map((e, n) => n === idx ? { ...e, responsibilities: bullets } : e));
            setAiModal(null);
            showToast("Bullets generated", "success");
        } catch (e) {
            showToast((e as AxiosError<{ message: string }>).response?.data?.message ?? "Failed", "error");
        } finally { setGenerating(false); }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.length === 0 && <p style={{ fontSize: 13, color: "#333", padding: "24px 0" }}>No experience yet.</p>}

            {data.map((exp, i) => (
                <div key={i} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#333" }}>
                            Experience {i + 1}
                        </span>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => { setAiModal(i); setAiForm({ experienceLevel: "", jobTitle: exp.position, technologies: "" }); }}
                                id={`ai-experience-${i}`} style={{
                                    fontSize: 11.5, color: "#8080d8", background: "rgba(91,91,214,0.1)",
                                    border: "1px solid rgba(91,91,214,0.2)", borderRadius: 5,
                                    padding: "2px 8px", cursor: "pointer",
                                }}>✦ AI bullets</button>
                            <button onClick={() => remove(i)} id={`remove-exp-${i}`} style={{
                                fontSize: 11.5, color: "#f87171", background: "none", border: "none", cursor: "pointer",
                            }}>Remove</button>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 16 }}>
                        <F id={`exp-company-${i}`} label="Company" ph="Acme Corp" value={exp.company} onChange={v => updField(i, "company", v)} />
                        <F id={`exp-position-${i}`} label="Position" ph="Software Engineer" value={exp.position} onChange={v => updField(i, "position", v)} />
                        <F id={`exp-start-${i}`} label="Start date" ph="Jan 2022" value={exp.startDate} onChange={v => updField(i, "startDate", v)} />
                        <F id={`exp-end-${i}`} label="End date" ph="Present" value={exp.endDate} onChange={v => updField(i, "endDate", v)} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 8 }}>Responsibilities</label>
                        {exp.responsibilities.map((r, ri) => (
                            <div key={ri} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                                <input value={r} onChange={e => updResp(i, ri, e.target.value)}
                                    id={`exp-resp-${i}-${ri}`} placeholder="Describe an achievement…"
                                    style={{ ...inputStyle, flex: 1 }}
                                    onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                                <button onClick={() => removeResp(i, ri)} style={{
                                    color: "#3a3a3a", background: "none", border: "none",
                                    cursor: "pointer", fontSize: 15, padding: "0 4px",
                                }}>×</button>
                            </div>
                        ))}
                        <button onClick={() => addResp(i)} style={{
                            fontSize: 12, color: "#444", background: "none", border: "none",
                            cursor: "pointer", padding: 0, marginTop: 2,
                        }}>+ Add bullet</button>
                    </div>
                </div>
            ))}

            <button onClick={add} id="add-experience-btn" style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                borderRadius: 7, border: "1px solid rgba(255,255,255,0.09)",
                background: "transparent", color: "#555", fontSize: 13, fontWeight: 500,
                cursor: "pointer", width: "fit-content", transition: "all 0.15s",
            }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"; e.currentTarget.style.color = "#aaa"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.color = "#555"; }}
            >
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add experience
            </button>

            {/* AI Modal */}
            {aiModal !== null && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 60,
                    display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
                }} onClick={() => setAiModal(null)}>
                    <div onClick={e => e.stopPropagation()} className="animate-scale-in" style={{
                        width: "100%", maxWidth: 420,
                        background: "#131313", border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 14, padding: 24,
                        boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
                    }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.03em", marginBottom: 20 }}>
                            Generate experience bullets
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[
                                { k: "experienceLevel", label: "Experience level", ph: "Senior" },
                                { k: "jobTitle",         label: "Job title",         ph: "Backend Engineer" },
                                { k: "technologies",     label: "Technologies (comma-separated)", ph: "Node.js, PostgreSQL" },
                            ].map(({ k, label, ph }) => (
                                <div key={k}>
                                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5 }}>{label}</label>
                                    <input value={(aiForm as Record<string, string>)[k]}
                                        onChange={e => setAiForm(p => ({ ...p, [k]: e.target.value }))}
                                        placeholder={ph} style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                            <button onClick={() => setAiModal(null)} style={{
                                flex: 1, padding: "8px 0", borderRadius: 7,
                                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                                color: "#666", fontSize: 13, fontWeight: 500, cursor: "pointer",
                            }}>Cancel</button>
                            <button onClick={() => genAI(aiModal)} id="confirm-generate-exp" disabled={generating} style={{
                                flex: 1, padding: "8px 0", borderRadius: 7,
                                background: generating ? "#3d3d8f" : "#5b5bd6",
                                color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer",
                            }}>{generating ? "Generating…" : "✦ Generate"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
