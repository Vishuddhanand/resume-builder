"use client";

import React, { useState } from "react";
import { IProject } from "@/types/resume.types";
import { generateProjectDescription } from "@/apis/ai.api";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

interface Props { data: IProject[]; onChange: (d: IProject[]) => void; }
const empty = (): IProject => ({ name: "", description: "", technologies: [], liveUrl: "", githubUrl: "" });
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
export default function ProjectsForm({ data, onChange }: Props) {
    const { showToast } = useToast();
    const [aiModal, setAiModal] = useState<number | null>(null);
    const [aiForm, setAiForm] = useState({ experienceLevel: "", jobTitle: "", technologies: "" });
    const [generating, setGenerating] = useState(false);
    const add = () => onChange([...data, empty()]);
    const remove = (i: number) => onChange(data.filter((_, n) => n !== i));
    const upd = (i: number, k: keyof IProject, v: string | string[]) =>
        onChange(data.map((p, n) => n === i ? { ...p, [k]: v } : p));

    async function genAI(idx: number) {
        if (!aiForm.experienceLevel || !aiForm.jobTitle || !aiForm.technologies) { showToast("Fill all fields", "error"); return; }
        setGenerating(true);
        try {
            const res = await generateProjectDescription({
                experienceLevel: aiForm.experienceLevel, jobTitle: aiForm.jobTitle,
                technologiesUsed: aiForm.technologies.split(",").map(t => t.trim()),
            });
            const desc = String((res.data?.data as { projectDescription: string })?.projectDescription ?? "");
            upd(idx, "description", desc);
            setAiModal(null);
            showToast("Description generated", "success");
        } catch (e) {
            showToast((e as AxiosError<{ message: string }>).response?.data?.message ?? "Failed", "error");
        } finally { setGenerating(false); }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.length === 0 && <p style={{ fontSize: 13, color: "#333", padding: "24px 0" }}>No projects yet.</p>}
            {data.map((proj, i) => (
                <div key={i} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#333" }}>Project {i + 1}</span>
                        <div style={{ display: "flex", gap: 10 }}>
                            <button onClick={() => { setAiModal(i); setAiForm({ experienceLevel: "", jobTitle: "", technologies: proj.technologies.join(", ") }); }}
                                id={`ai-project-${i}`} style={{
                                    fontSize: 11.5, color: "#8080d8", background: "rgba(91,91,214,0.1)",
                                    border: "1px solid rgba(91,91,214,0.2)", borderRadius: 5, padding: "2px 8px", cursor: "pointer",
                                }}>✦ AI description</button>
                            <button onClick={() => remove(i)} id={`remove-project-${i}`} style={{
                                fontSize: 11.5, color: "#f87171", background: "none", border: "none", cursor: "pointer",
                            }}>Remove</button>
                        </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", marginBottom: 14 }}>
                        <F id={`proj-name-${i}`} label="Project name" ph="My App" value={proj.name} onChange={v => upd(i, "name", v)} />
                        <F id={`proj-tech-${i}`} label="Technologies (comma-separated)" ph="React, Node.js" value={proj.technologies.join(", ")}
                            onChange={v => upd(i, "technologies", v.split(",").map(t => t.trimStart()))} />
                        <F id={`proj-live-${i}`} label="Live URL" ph="https://myapp.com" value={proj.liveUrl} onChange={v => upd(i, "liveUrl", v)} />
                        <F id={`proj-github-${i}`} label="GitHub URL" ph="https://github.com/…" value={proj.githubUrl} onChange={v => upd(i, "githubUrl", v)} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 6 }}>Description</label>
                        <textarea value={proj.description} onChange={e => upd(i, "description", e.target.value)}
                            id={`proj-desc-${i}`} rows={3} placeholder="What does this project do? What was your role?"
                            style={{ ...inputStyle, resize: "vertical", lineHeight: 1.65, fontFamily: "inherit" }}
                            onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                            onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                    </div>
                </div>
            ))}
            <button onClick={add} id="add-project-btn" style={{
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
                Add project
            </button>
            {aiModal !== null && (
                <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={() => setAiModal(null)}>
                    <div onClick={e => e.stopPropagation()} className="animate-scale-in" style={{ width: "100%", maxWidth: 420, background: "#131313", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 24, boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.03em", marginBottom: 20 }}>Generate project description</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[{ k: "experienceLevel", label: "Experience level", ph: "Mid-level" }, { k: "jobTitle", label: "Your role", ph: "Frontend Developer" }, { k: "technologies", label: "Technologies", ph: "React, TypeScript, Tailwind" }].map(({ k, label, ph }) => (
                                <div key={k}>
                                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5 }}>{label}</label>
                                    <input value={(aiForm as Record<string, string>)[k]} onChange={e => setAiForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                            <button onClick={() => setAiModal(null)} style={{ flex: 1, padding: "8px 0", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#666", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                            <button onClick={() => genAI(aiModal)} id="confirm-generate-proj" disabled={generating} style={{ flex: 1, padding: "8px 0", borderRadius: 7, background: generating ? "#3d3d8f" : "#5b5bd6", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{generating ? "Generating…" : "✦ Generate"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
