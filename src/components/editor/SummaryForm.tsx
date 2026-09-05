"use client";

import React, { useState } from "react";
import { generateSummary, improveContent } from "@/apis/ai.api";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", padding: "8px 11px", fontSize: 13.5,
    background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
    color: "#e8e8e8", outline: "none", transition: "border-color 0.15s", letterSpacing: "-0.01em",
};

function AiModal({ open, onClose, onGenerate }: {
    open: boolean; onClose: () => void;
    onGenerate: (f: { experienceLevel: string; jobTitle: string; skills: string }) => void;
}) {
    const [f, setF] = useState({ experienceLevel: "", jobTitle: "", skills: "" });
    if (!open) return null;
    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 60,
            display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
        }} onClick={onClose}>
            <div
                onClick={e => e.stopPropagation()}
                className="animate-scale-in"
                style={{
                    width: "100%", maxWidth: 420,
                    background: "#131313", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14, padding: 24,
                    boxShadow: "0 24px 64px rgba(0,0,0,0.7)",
                }}
            >
                <div style={{ marginBottom: 20 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.03em", marginBottom: 4 }}>
                        Generate summary
                    </h3>
                    <p style={{ fontSize: 13, color: "#444" }}>AI will write a professional summary based on these inputs.</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                        { k: "experienceLevel", label: "Experience level", ph: "Senior, Mid-level, Junior…" },
                        { k: "jobTitle",         label: "Job title",         ph: "Full Stack Developer" },
                        { k: "skills",           label: "Key skills (comma-separated)", ph: "React, Node.js, TypeScript" },
                    ].map(({ k, label, ph }) => (
                        <div key={k}>
                            <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5 }}>{label}</label>
                            <input
                                value={(f as Record<string, string>)[k]}
                                onChange={e => setF(p => ({ ...p, [k]: e.target.value }))}
                                placeholder={ph}
                                style={inputStyle}
                                onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                            />
                        </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                    <button onClick={onClose} style={{
                        flex: 1, padding: "8px 0", borderRadius: 7,
                        border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                        color: "#666", fontSize: 13, fontWeight: 500, cursor: "pointer",
                    }}>Cancel</button>
                    <button onClick={() => onGenerate(f)} id="confirm-generate-summary" style={{
                        flex: 1, padding: "8px 0", borderRadius: 7,
                        background: "#5b5bd6", color: "#fff", border: "none",
                        fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>Generate</button>
                </div>
            </div>
        </div>
    );
}

export default function SummaryForm({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const { showToast } = useToast();
    const [modal, setModal] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [improving, setImproving] = useState(false);

    async function handleGenerate(form: { experienceLevel: string; jobTitle: string; skills: string }) {
        if (!form.experienceLevel || !form.jobTitle || !form.skills) { showToast("Fill all fields", "error"); return; }
        setGenerating(true);
        setModal(false);
        try {
            const res = await generateSummary({
                experienceLevel: form.experienceLevel,
                jobTitle: form.jobTitle,
                skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
            });
            onChange((res.data?.data as { summary: string })?.summary ?? "");
            showToast("Summary generated", "success");
        } catch (e) {
            showToast((e as AxiosError<{ message: string }>).response?.data?.message ?? "Generation failed", "error");
        } finally { setGenerating(false); }
    }

    async function handleImprove() {
        if (!value.trim()) { showToast("Write something first", "info"); return; }
        setImproving(true);
        try {
            const res = await improveContent({ content: value });
            onChange((res.data?.data as { improvedContent: string })?.improvedContent ?? "");
            showToast("Content improved", "success");
        } catch (e) {
            showToast((e as AxiosError<{ message: string }>).response?.data?.message ?? "Failed", "error");
        } finally { setImproving(false); }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Action row */}
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setModal(true)} id="generate-summary-btn" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", borderRadius: 6,
                    background: "rgba(91,91,214,0.12)", border: "1px solid rgba(91,91,214,0.25)",
                    color: "#8080d8", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                    letterSpacing: "-0.01em",
                }}>
                    {generating ? (
                        <svg className="animate-spin-slow" width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="rgba(128,128,216,0.3)" strokeWidth="3" />
                            <path d="M12 2a10 10 0 0 1 10 10" stroke="#8080d8" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    ) : "✦"} {generating ? "Generating…" : "Generate with AI"}
                </button>
                <button onClick={handleImprove} disabled={improving} id="improve-summary-btn" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "6px 12px", borderRadius: 6,
                    background: "transparent", border: "1px solid rgba(255,255,255,0.09)",
                    color: improving ? "#333" : "#555", fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                }}>
                    {improving ? "Improving…" : "↑ Improve"}
                </button>
            </div>

            {/* Textarea */}
            <textarea
                id="summary-textarea"
                value={value}
                onChange={e => onChange(e.target.value)}
                rows={6}
                placeholder="Write a professional summary, or generate one with AI above…"
                style={{
                    width: "100%", padding: "11px 13px", fontSize: 13.5,
                    background: "#111", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, color: "#e8e8e8",
                    resize: "vertical", outline: "none", transition: "border-color 0.15s",
                    lineHeight: 1.7, letterSpacing: "-0.01em",
                    fontFamily: "inherit",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <p style={{ fontSize: 11.5, color: "#2e2e2e", textAlign: "right", marginTop: -8 }}>{value.length} chars</p>

            <AiModal open={modal} onClose={() => setModal(false)} onGenerate={handleGenerate} />
        </div>
    );
}
