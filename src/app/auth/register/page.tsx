"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/apis/auth.api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { AxiosError } from "axios";

const inp: React.CSSProperties = {
    display: "block", width: "100%",
    padding: "12px 16px", fontSize: 14.5,
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 10, color: "#f5f5f5", outline: "none",
    transition: "all 0.2s ease",
    letterSpacing: "-0.01em", fontFamily: "inherit",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
};

function Field({ id, label, type = "text", placeholder, value, onChange, error }: {
    id: string; label: string; type?: string; placeholder?: string;
    value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; error?: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <label htmlFor={id} style={{ fontSize: 13, fontWeight: 600, color: "#888", letterSpacing: "0.01em" }}>{label}</label>
            <input id={id} type={type} placeholder={placeholder} value={value} onChange={onChange}
                style={{ ...inp, borderColor: error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)" }}
                onFocus={e => { e.currentTarget.style.borderColor = "#5b5bd6"; e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.2), 0 0 0 3px rgba(91,91,214,0.15)"; }}
                onBlur={e => { e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.12)"; e.currentTarget.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.2)"; }}
            />
            {error && <span style={{ fontSize: 12, color: "#f87171", fontWeight: 500 }}>{error}</span>}
        </div>
    );
}

interface FormState { name: string; email: string; mobile: string; password: string; }
interface FormErrors { name?: string; email?: string; mobile?: string; password?: string; }

export default function RegisterPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const { showToast } = useToast();
    const [form, setForm] = useState<FormState>({ name: "", email: "", mobile: "", password: "" });
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);

    function validate(): FormErrors {
        const e: FormErrors = {};
        if (!form.name.trim()) e.name = "Required";
        if (!form.email) e.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
        if (!form.mobile) e.mobile = "Required";
        else if (!/^\d{10}$/.test(form.mobile)) e.mobile = "Must be 10 digits";
        if (!form.password) e.password = "Required";
        else if (form.password.length < 6) e.password = "Min 6 characters";
        return e;
    }

    async function handleSubmit(ev: React.FormEvent) {
        ev.preventDefault();
        const e = validate();
        if (Object.keys(e).length) return setErrors(e);
        setErrors({});
        setLoading(true);
        try {
            const res = await registerUser(form);
            if (res.data?.user) setUser(res.data.user);
            showToast("Account created successfully", "success");
            router.push("/dashboard");
        } catch (err) {
            const msg = (err as AxiosError<{ message: string }>).response?.data?.message ?? "Registration failed";
            showToast(msg, "error");
        } finally { setLoading(false); }
    }

    const f = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [field]: e.target.value }));

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "120px 24px 80px",
            background: "#080808", position: "relative",
        }}>
            <div style={{
                position: "fixed", top: -100, left: "50%", transform: "translateX(-50%)",
                width: 800, height: 500, pointerEvents: "none",
                background: "radial-gradient(ellipse at 50% 0%, rgba(91,91,214,0.12) 0%, transparent 60%)",
                filter: "blur(50px)",
            }} />

            <div style={{ width: "100%", maxWidth: 460, position: "relative" }} className="animate-slide-up">

                <div style={{ textAlign: "center", marginBottom: 48 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 14,
                        background: "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)",
                        boxShadow: "0 4px 16px rgba(91,91,214,0.25), inset 0 1px 2px rgba(255,255,255,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 800, fontSize: 22, margin: "0 auto 24px",
                    }}>R</div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fdfdfd", letterSpacing: "-0.04em", marginBottom: 8 }}>
                        Create your account
                    </h1>
                    <p style={{ fontSize: 15, color: "#666", fontWeight: 400 }}>Free forever. No credit card required.</p>
                </div>

                <div style={{
                    background: "rgba(18,18,18,0.8)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 20, padding: "40px",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)",
                }}>
                    <form id="register-form" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <Field id="register-name" label="Full name" placeholder="Alex Johnson"
                            value={form.name} onChange={f("name")} error={errors.name} />

                        <Field id="register-email" label="Email address" type="email" placeholder="you@example.com"
                            value={form.email} onChange={f("email")} error={errors.email} />

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <Field id="register-mobile" label="Mobile number" type="tel" placeholder="10 digits"
                                value={form.mobile} onChange={f("mobile")} error={errors.mobile} />
                            <Field id="register-password" label="Password" type="password" placeholder="Min 6 chars"
                                value={form.password} onChange={f("password")} error={errors.password} />
                        </div>

                        <button
                            type="submit" id="register-submit" disabled={loading}
                            style={{
                                marginTop: 12,
                                padding: "13px 0", borderRadius: 10,
                                background: loading ? "#3a3a8f" : "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)",
                                color: "#fff", fontWeight: 700, fontSize: 14.5,
                                border: "none", cursor: loading ? "not-allowed" : "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                                transition: "all 0.2s ease", letterSpacing: "-0.01em",
                                boxShadow: loading ? "none" : "0 4px 14px rgba(91,91,214,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                            }}
                            onMouseEnter={e => !loading && (e.currentTarget.style.filter = "brightness(1.1)")}
                            onMouseLeave={e => !loading && (e.currentTarget.style.filter = "brightness(1)")}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin-slow" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
                                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                                    </svg>
                                    Creating account…
                                </>
                            ) : "Create account"}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: "center", fontSize: 14, color: "#555", marginTop: 32 }}>
                    Already have an account?{" "}
                    <Link href="/auth/login"
                        style={{ color: "#7272c8", textDecoration: "none", fontWeight: 600, transition: "color 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#9090e0"}
                        onMouseLeave={e => e.currentTarget.style.color = "#7272c8"}
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
