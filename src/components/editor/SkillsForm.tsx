"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { generateSkills } from "@/apis/ai.api";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

interface Props { data: string[]; onChange: (d: string[]) => void; }

const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", padding: "8px 11px", fontSize: 13.5,
    background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
    color: "#e8e8e8", outline: "none", transition: "border-color 0.15s", letterSpacing: "-0.01em",
};

export default function SkillsForm({ data, onChange }: Props) {
    const { showToast } = useToast();
    const [val, setVal] = useState("");
    const [modal, setModal] = useState(false);
    const [aiForm, setAiForm] = useState({ experienceLevel: "", jobTitle: "" });
    const [generating, setGenerating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const add = (s: string) => {
        const t = s.trim();
        if (!t || data.includes(t)) return;
        onChange([...data, t]);
        setVal("");
    };
    const remove = (s: string) => onChange(data.filter(x => x !== s));

    function onKey(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(val); }
        if (e.key === "Backspace" && !val && data.length > 0) remove(data[data.length - 1]);
    }

    async function handleGen() {
        if (!aiForm.experienceLevel || !aiForm.jobTitle) { showToast("Fill all fields", "error"); return; }
        setGenerating(true);
        try {
            const res = await generateSkills({ experienceLevel: aiForm.experienceLevel, jobTitle: aiForm.jobTitle });
            const raw = (res.data?.data as { skills: string | string[] })?.skills;
            let skills: string[] = [];
            if (Array.isArray(raw)) skills = raw.map(String);
            else if (typeof raw === "string") skills = raw.split(/[\n,]+/).map(s => s.replace(/^[-•*]\s*/, "").trim()).filter(Boolean);
            onChange(Array.from(new Set([...data, ...skills])));
            setModal(false);
            showToast(`${skills.length} skills added`, "success");
        } catch (e) {
            showToast((e as AxiosError<{ message: string }>).response?.data?.message ?? "Failed", "error");
        } finally { setGenerating(false); }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* AI button */}
            <button onClick={() => setModal(true)} id="generate-skills-btn" style={{
                display: "flex", alignItems: "center", gap: 5, width: "fit-content",
                padding: "6px 12px", borderRadius: 6,
                background: "rgba(91,91,214,0.12)", border: "1px solid rgba(91,91,214,0.25)",
                color: "#8080d8", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            }}>✦ Generate skills with AI</button>

            {/* Tag input */}
            <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 8 }}>
                    Skills · {data.length} added
                </label>
                <div
                    onClick={() => inputRef.current?.focus()}
                    style={{
                        minHeight: 72, display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 10px",
                        background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                        cursor: "text", transition: "border-color 0.15s",
                    }}
                    onFocusCapture={e => (e.currentTarget.style.borderColor = "#5b5bd6")}
                    onBlurCapture={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                >
                    {data.map(skill => (
                        <span key={skill} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "3px 10px", borderRadius: 5,
                            background: "rgba(91,91,214,0.1)", border: "1px solid rgba(91,91,214,0.2)",
                            color: "#9090d8", fontSize: 12.5, fontWeight: 500,
                        }}>
                            {skill}
                            <button onClick={e => { e.stopPropagation(); remove(skill); }}
                                style={{ color: "#5050a0", background: "none", border: "none", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        ref={inputRef} id="skills-input" value={val}
                        onChange={e => setVal(e.target.value)}
                        onKeyDown={onKey}
                        onBlur={() => val && add(val)}
                        placeholder={data.length === 0 ? "Type a skill, press Enter or ," : "Add more…"}
                        style={{
                            flex: 1, minWidth: 120, background: "transparent",
                            border: "none", outline: "none", fontSize: 13.5,
                            color: "#e8e8e8", letterSpacing: "-0.01em",
                        }}
                    />
                </div>
                <p style={{ fontSize: 11.5, color: "#2a2a2a", marginTop: 5 }}>
                    Press <kbd style={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 3, padding: "1px 5px", fontSize: 11 }}>Enter</kbd> or <kbd style={{ background: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 3, padding: "1px 5px", fontSize: 11 }}>,</kbd> to add · Backspace to remove last
                </p>
            </div>

            {/* AI Modal */}
            {modal && (
                <div style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }} onClick={() => setModal(false)}>
                    <div onClick={e => e.stopPropagation()} className="animate-scale-in" style={{ width: "100%", maxWidth: 400, background: "#131313", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 24, boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.03em", marginBottom: 20 }}>Generate skills</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[{ k: "experienceLevel", label: "Experience level", ph: "Senior" }, { k: "jobTitle", label: "Job title", ph: "Full Stack Developer" }].map(({ k, label, ph }) => (
                                <div key={k}>
                                    <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5 }}>{label}</label>
                                    <input value={(aiForm as Record<string, string>)[k]} onChange={e => setAiForm(p => ({ ...p, [k]: e.target.value }))} placeholder={ph} style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
                            <button onClick={() => setModal(false)} style={{ flex: 1, padding: "8px 0", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#666", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>Cancel</button>
                            <button onClick={handleGen} id="confirm-generate-skills" disabled={generating} style={{ flex: 1, padding: "8px 0", borderRadius: 7, background: generating ? "#3d3d8f" : "#5b5bd6", color: "#fff", border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{generating ? "Generating…" : "✦ Generate"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
