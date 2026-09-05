"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user, logout, isAuthenticated } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        function handle(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("mousedown", handle);
        return () => document.removeEventListener("mousedown", handle);
    }, []);

    const isEditor = pathname?.startsWith("/resume/");

    return (
        <header style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
            height: 80,
            background: "rgba(10,10,10,0.85)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            transition: "all 0.3s ease",
        }}>
            <div style={{
                maxWidth: 1200, margin: "0 auto", height: "100%",
                padding: "0 32px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)",
                        boxShadow: "0 2px 8px rgba(91,91,214,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontWeight: 800, fontSize: 14, flexShrink: 0,
                    }}>R</div>
                    <span style={{
                        fontSize: 16, fontWeight: 700, color: "#f0f0f0",
                        letterSpacing: "-0.03em",
                        fontVariationSettings: "'wght' 700",
                    }}>
                        Resume<span style={{ color: "#5b5bd6" }}>AI</span>
                    </span>
                </Link>

                {!isEditor && isAuthenticated && (
                    <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <NavLink href="/" label="Home" current={pathname} />
                        <NavLink href="/dashboard" label="Dashboard" current={pathname} />
                    </nav>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {isAuthenticated ? (
                        <div ref={menuRef} style={{ position: "relative" }}>
                            <button
                                onClick={() => setOpen(v => !v)}
                                style={{
                                    display: "flex", alignItems: "center", gap: 10,
                                    padding: "6px 12px 6px 8px", borderRadius: 10,
                                    background: open ? "rgba(255,255,255,0.08)" : "transparent",
                                    border: "1px solid",
                                    borderColor: open ? "rgba(255,255,255,0.12)" : "transparent",
                                    cursor: "pointer", transition: "all 0.2s ease",
                                }}
                                onMouseEnter={e => !open && (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
                                onMouseLeave={e => !open && (e.currentTarget.style.background = "transparent")}
                            >
                                <div style={{
                                    width: 28, height: 28, borderRadius: "50%",
                                    background: "#5b5bd6",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontWeight: 700, fontSize: 12,
                                    boxShadow: "0 2px 6px rgba(91,91,214,0.3)",
                                }}>
                                    {user?.name?.charAt(0).toUpperCase() ?? "U"}
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 500, color: "#e0e0e0", letterSpacing: "-0.01em" }}>
                                    {user?.name?.split(" ")[0]}
                                </span>
                                <svg style={{
                                    width: 14, height: 14, color: "#666",
                                    transform: open ? "rotate(180deg)" : "none",
                                    transition: "transform 0.2s ease",
                                }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {open && (
                                <div
                                    className="animate-slide-down"
                                    style={{
                                        position: "absolute", right: 0, top: "calc(100% + 8px)",
                                        width: 240, borderRadius: 14, overflow: "hidden",
                                        background: "rgba(20,20,20,0.95)",
                                        backdropFilter: "blur(16px)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        boxShadow: "0 24px 64px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.4)",
                                    }}
                                >
                                    <div style={{
                                        padding: "16px 20px",
                                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                                    }}>
                                        <p style={{ fontSize: 12, color: "#666", marginBottom: 4, letterSpacing: "0.02em", fontWeight: 500 }}>Signed in as</p>
                                        <p style={{ fontSize: 14, fontWeight: 600, color: "#f5f5f5", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div style={{ padding: "8px" }}>
                                        <DropdownItem
                                            href="/dashboard"
                                            label="Dashboard"
                                            onClick={() => setOpen(false)}
                                            icon={
                                                <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                                </svg>
                                            }
                                        />
                                        <button
                                            onClick={() => { setOpen(false); logout(); }}
                                            style={{
                                                display: "flex", alignItems: "center", gap: 12,
                                                width: "100%", padding: "10px 12px", borderRadius: 8,
                                                background: "transparent", border: "none",
                                                color: "#888", fontSize: 13.5, fontWeight: 500, cursor: "pointer",
                                                textAlign: "left" as const, transition: "all 0.15s ease",
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#f87171"; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}
                                        >
                                            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/auth/login" style={{
                                padding: "8px 16px", borderRadius: 8,
                                fontSize: 14, fontWeight: 500, color: "#888",
                                textDecoration: "none", transition: "color 0.15s ease",
                                letterSpacing: "-0.01em",
                            }}
                                onMouseEnter={e => e.currentTarget.style.color = "#f5f5f5"}
                                onMouseLeave={e => e.currentTarget.style.color = "#888"}
                            >
                                Sign in
                            </Link>
                            <Link href="/auth/register" style={{
                                padding: "10px 20px", borderRadius: 10,
                                background: "linear-gradient(135deg, #5b5bd6 0%, #4a4ac0 100%)", color: "#fff",
                                fontSize: 14, fontWeight: 600,
                                textDecoration: "none", transition: "all 0.2s ease",
                                letterSpacing: "-0.01em",
                                boxShadow: "0 2px 10px rgba(91,91,214,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
                            }}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = "brightness(1)"}
                            >
                                Get started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

function NavLink({ href, label, current }: { href: string; label: string; current: string | null }) {
    const active = current === href;
    return (
        <Link href={href} style={{
            padding: "8px 14px", borderRadius: 8,
            fontSize: 14, fontWeight: active ? 600 : 500,
            color: active ? "#f5f5f5" : "#666",
            background: active ? "rgba(255,255,255,0.08)" : "transparent",
            textDecoration: "none", transition: "all 0.2s ease",
            letterSpacing: "-0.01em",
        }}
            onMouseEnter={e => !active && (e.currentTarget.style.color = "#a0a0a0", e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
            onMouseLeave={e => !active && (e.currentTarget.style.color = "#666", e.currentTarget.style.background = "transparent")}
        >
            {label}
        </Link>
    );
}

function DropdownItem({ href, label, icon, onClick }: { href: string; label: string; icon: React.ReactNode; onClick: () => void }) {
    return (
        <Link href={href} onClick={onClick} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 8,
            color: "#888", fontSize: 13.5, fontWeight: 500,
            textDecoration: "none", transition: "all 0.15s ease",
        }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#e0e0e0"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}
        >
            {icon}
            {label}
        </Link>
    );
}
