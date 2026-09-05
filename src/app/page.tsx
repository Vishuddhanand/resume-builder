"use client";

import React from "react";
import Link from "next/link";

const features = [
    { title: "Professional Summary", desc: "Describe your experience level and role — AI writes a tight, compelling summary in seconds.", tag: "Generate" },
    { title: "Skills Intelligence",  desc: "Get a curated, role-specific skills list. No more guessing what keywords recruiters scan for.", tag: "Suggest"  },
    { title: "ATS Score",            desc: "Paste a job description. We analyse how well your resume matches and what's missing.", tag: "Analyse"  },
    { title: "Project Descriptions", desc: "Turn a tech stack into a concise, impact-driven project write-up automatically.", tag: "Write"    },
    { title: "Experience Bullets",   desc: "Transform plain job titles into achievement-oriented bullet points that get noticed.", tag: "Rewrite"  },
    { title: "Content Polish",       desc: "Paste any text. AI tightens the language, improves clarity, and removes filler.", tag: "Improve"  },
];

export default function LandingPage() {
    return (
        <div style={{ background: "#080808", minHeight: "100vh", fontFamily: "inherit" }}>
            <section style={{
                minHeight: "92vh",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "160px 24px 120px",
                position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
                    width: 1000, height: 600, pointerEvents: "none",
                    background: "radial-gradient(ellipse at 50% 0%, rgba(91,91,214,0.15) 0%, transparent 65%)",
                    filter: "blur(60px)",
                }} />

                <div style={{ maxWidth: 760, textAlign: "center", position: "relative" }} className="animate-slide-up">
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 10,
                        padding: "6px 16px", borderRadius: 99,
                        border: "1px solid rgba(91,91,214,0.4)",
                        background: "rgba(91,91,214,0.1)",
                        marginBottom: 40,
                        fontSize: 11.5, fontWeight: 700, letterSpacing: "0.1em",
                        textTransform: "uppercase", color: "#8a8ad9",
                        boxShadow: "0 4px 20px rgba(91,91,214,0.15)",
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5b5bd6", display: "inline-block" }} className="animate-pulse-dot" />
                        AI-powered · Free to start
                    </div>

                    <h1 style={{
                        fontSize: "clamp(46px, 8vw, 84px)",
                        fontWeight: 800, lineHeight: 1.05,
                        letterSpacing: "-0.05em", color: "#fdfdfd", marginBottom: 28,
                    }}>
                        Your resume,<br />
                        <em style={{ color: "#5b5bd6", fontStyle: "italic", background: "linear-gradient(135deg, #7c7cd9, #5b5bd6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>written by AI.</em>
                    </h1>

                    <p style={{
                        fontSize: 18, lineHeight: 1.7, color: "#666",
                        maxWidth: 540, margin: "0 auto 56px", letterSpacing: "-0.01em",
                        fontWeight: 400,
                    }}>
                        Stop agonising over wording. ResumeAI generates summaries,
                        skills, and bullet points — and scores against any job description.
                    </p>

                    <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                        <Link href="/auth/register" id="cta-get-started" className="btn-primary">
                            Start building →
                        </Link>
                        <Link href="/auth/login" id="cta-sign-in" className="btn-ghost">
                            Sign in
                        </Link>
                    </div>

                    <div style={{
                        marginTop: 80,
                        display: "flex", justifyContent: "center", gap: 64, flexWrap: "wrap",
                    }}>
                        {[
                            { n: "6", label: "AI features" },
                            { n: "8", label: "Resume sections" },
                            { n: "100%", label: "Free to start" },
                        ].map(({ n, label }) => (
                            <div key={label} style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 32, fontWeight: 800, color: "#f5f5f5", letterSpacing: "-0.04em", marginBottom: 6 }}>{n}</div>
                                <div style={{ fontSize: 13, color: "#555", letterSpacing: "0.02em", fontWeight: 500, textTransform: "uppercase" }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)", maxWidth: 1200, margin: "0 auto" }} />

            <section style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px" }}>
                <div style={{ marginBottom: 64 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: 16 }}>
                        What's included
                    </p>
                    <h2 style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fdfdfd", maxWidth: 500, lineHeight: 1.15 }}>
                        Six AI tools,<br />one resume.
                    </h2>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: 1,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16, overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
                }}>
                    {features.map(f => (
                        <div key={f.title} className="feature-cell">
                            <span style={{
                                display: "inline-block", fontSize: 10, fontWeight: 800,
                                letterSpacing: "0.1em", textTransform: "uppercase",
                                color: "#6e6ede", padding: "4px 10px", borderRadius: 6,
                                background: "rgba(91,91,214,0.12)", marginBottom: 20,
                            }}>{f.tag}</span>
                            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f0f0f0", letterSpacing: "-0.02em", marginBottom: 10 }}>{f.title}</h3>
                            <p style={{ fontSize: 14, color: "#606060", lineHeight: 1.7, letterSpacing: "-0.01em", fontWeight: 400 }}>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "120px 24px", textAlign: "center" }}>
                <h2 style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fdfdfd", marginBottom: 18 }}>
                    Ready when you are.
                </h2>
                <p style={{ fontSize: 16, color: "#666", marginBottom: 44, fontWeight: 400 }}>
                    Create an account and start building in under a minute.
                </p>
                <Link href="/auth/register" id="cta-bottom" className="btn-primary" style={{ padding: "14px 28px", fontSize: 15 }}>
                    Create your resume →
                </Link>
            </section>

            <footer style={{
                borderTop: "1px solid rgba(255,255,255,0.04)",
                padding: "24px 24px", textAlign: "center",
                fontSize: 12, color: "#333", fontWeight: 500, letterSpacing: "0.02em"
            }}>
                © 2026 ResumeAI — Built with Next.js &amp; Google Gemini
            </footer>

            <style>{`
                .btn-primary {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 13px 26px; border-radius: 12px;
                    background: linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%);
                    color: #fff; font-weight: 700;
                    font-size: 14.5px; text-decoration: none;
                    transition: all 0.2s ease; letter-spacing: -0.01em;
                    box-shadow: 0 4px 14px rgba(91,91,214,0.3), inset 0 1px 1px rgba(255,255,255,0.2);
                }
                .btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(91,91,214,0.4), inset 0 1px 1px rgba(255,255,255,0.2); }
                .btn-primary:active { transform: translateY(0); }
                
                .btn-ghost {
                    display: inline-flex; align-items: center;
                    padding: 13px 26px; border-radius: 12px;
                    border: 1px solid rgba(255,255,255,0.15);
                    background: rgba(255,255,255,0.03);
                    color: #a0a0a0; font-weight: 600; font-size: 14.5px;
                    text-decoration: none; transition: all 0.2s ease;
                    letter-spacing: -0.01em;
                }
                .btn-ghost:hover {
                    border-color: rgba(255,255,255,0.25);
                    color: #fff; background: rgba(255,255,255,0.08);
                }
                
                .feature-cell {
                    padding: 40px 32px; background: #0c0c0c;
                    transition: all 0.3s ease;
                }
                .feature-cell:hover { background: #121212; }
            `}</style>
        </div>
    );
}