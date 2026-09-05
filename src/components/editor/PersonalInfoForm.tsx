"use client";

import React from "react";
import { IPersonalInfo } from "@/types/resume.types";

interface Props {
    data: Partial<IPersonalInfo>;
    onChange: (data: Partial<IPersonalInfo>) => void;
}

function Field({ id, label, placeholder, value, onChange, span }: {
    id: string; label: string; placeholder?: string;
    value: string; onChange: (v: string) => void; span?: boolean;
}) {
    return (
        <div style={{ gridColumn: span ? "span 2" : undefined }}>
            <label htmlFor={id} style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#555", marginBottom: 5, letterSpacing: "0.01em" }}>
                {label}
            </label>
            <input
                id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                style={{
                    display: "block", width: "100%", padding: "8px 11px",
                    fontSize: 13.5, background: "#111",
                    border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7,
                    color: "#e8e8e8", outline: "none", transition: "border-color 0.15s",
                    letterSpacing: "-0.01em",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "#5b5bd6"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
        </div>
    );
}

export default function PersonalInfoForm({ data, onChange }: Props) {
    const u = (field: keyof IPersonalInfo) => (v: string) => onChange({ ...data, [field]: v });

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 16px" }}>
            <Field id="pi-fullname" label="Full name" placeholder="Alex Johnson" value={data.fullname ?? ""} onChange={u("fullname")} />
            <Field id="pi-email" label="Email" placeholder="alex@example.com" value={data.email ?? ""} onChange={u("email")} />
            <Field id="pi-phone" label="Phone" placeholder="+1 (555) 000-0000" value={data.phone ?? ""} onChange={u("phone")} />
            <Field id="pi-address" label="Location" placeholder="San Francisco, CA" value={data.address ?? ""} onChange={u("address")} />
            <Field id="pi-linkedin" label="LinkedIn" placeholder="linkedin.com/in/alexj" value={data.linkedIn ?? ""} onChange={u("linkedIn")} />
            <Field id="pi-github" label="GitHub" placeholder="github.com/alexj" value={data.github ?? ""} onChange={u("github")} />
            <Field id="pi-portfolio" label="Portfolio" placeholder="alexj.dev" value={data.portfolio ?? ""} onChange={u("portfolio")} span />
        </div>
    );
}
