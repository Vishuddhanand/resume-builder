"use client";

import React from "react";
import { IEducation } from "@/types/resume.types";

interface Props { data: IEducation[]; onChange: (d: IEducation[]) => void; }

const empty = (): IEducation => ({ institution: "", degree: "", fieldOfStudy: "", startDate: "", endDate: "" });

const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", padding: "8px 11px", fontSize: 13.5,
    background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
    color: "#e8e8e8", outline: "none", transition: "border-color 0.15s", letterSpacing: "-0.01em",
};

function F({ id, label, placeholder, value, onChange }: { id: string; label: string; placeholder?: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label htmlFor={id} style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5 }}>{label}</label>
            <input id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
        </div>
    );
}

export default function EducationForm({ data, onChange }: Props) {
    const add = () => onChange([...data, empty()]);
    const remove = (i: number) => onChange(data.filter((_, n) => n !== i));
    const upd = (i: number, k: keyof IEducation, v: string) =>
        onChange(data.map((e, n) => n === i ? { ...e, [k]: v } : e));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.length === 0 && (
                <p style={{ fontSize: 13, color: "#333", padding: "24px 0" }}>No education entries yet.</p>
            )}
            {data.map((edu, i) => (
                <div key={i} style={{
                    background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10, padding: 20,
                }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "#333" }}>
                            Education {i + 1}
                        </span>
                        <button onClick={() => remove(i)} id={`remove-education-${i}`} style={{
                            fontSize: 11.5, color: "#f87171", background: "none", border: "none",
                            cursor: "pointer", padding: "2px 6px",
                        }}>Remove</button>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" }}>
                        <F id={`edu-institution-${i}`} label="Institution" placeholder="MIT" value={edu.institution} onChange={v => upd(i, "institution", v)} />
                        <F id={`edu-degree-${i}`} label="Degree" placeholder="Bachelor's" value={edu.degree} onChange={v => upd(i, "degree", v)} />
                        <F id={`edu-field-${i}`} label="Field of study" placeholder="Computer Science" value={edu.fieldOfStudy} onChange={v => upd(i, "fieldOfStudy", v)} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            <F id={`edu-start-${i}`} label="Start" placeholder="Sep 2020" value={edu.startDate} onChange={v => upd(i, "startDate", v)} />
                            <F id={`edu-end-${i}`} label="End" placeholder="May 2024" value={edu.endDate} onChange={v => upd(i, "endDate", v)} />
                        </div>
                    </div>
                </div>
            ))}
            <button onClick={add} id="add-education-btn" style={{
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
                Add education
            </button>
        </div>
    );
}
