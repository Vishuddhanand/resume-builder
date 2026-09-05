"use client";

import React from "react";

interface Props { data: string[]; onChange: (d: string[]) => void; }

const inputStyle: React.CSSProperties = {
    flex: 1, padding: "8px 11px", fontSize: 13.5,
    background: "#111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
    color: "#e8e8e8", outline: "none", transition: "border-color 0.15s", letterSpacing: "-0.01em",
};

export default function CertificatesForm({ data, onChange }: Props) {
    const add = () => onChange([...data, ""]);
    const remove = (i: number) => onChange(data.filter((_, n) => n !== i));
    const upd = (i: number, v: string) => onChange(data.map((c, n) => n === i ? v : c));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {data.length === 0 && <p style={{ fontSize: 13, color: "#333", padding: "24px 0" }}>No certificates yet.</p>}

            {data.map((cert, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                    <input
                        id={`cert-${i}`} value={cert}
                        onChange={e => upd(i, e.target.value)}
                        placeholder="e.g. AWS Certified Solutions Architect"
                        style={inputStyle}
                        onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                        onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                    <button onClick={() => remove(i)} style={{
                        color: "#3a3a3a", background: "none", border: "none",
                        cursor: "pointer", fontSize: 16, padding: "0 6px",
                        transition: "color 0.15s",
                    }}
                        onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                        onMouseLeave={e => e.currentTarget.style.color = "#3a3a3a"}
                    >×</button>
                </div>
            ))}

            <button onClick={add} id="add-certificate-btn" style={{
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
                Add certificate
            </button>
        </div>
    );
}
