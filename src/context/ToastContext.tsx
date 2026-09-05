"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type ToastType = "success" | "error" | "info";

interface Toast { id: string; message: string; type: ToastType; }

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ACCENT = {
    success: { bg: "rgba(22,101,52,0.8)", border: "rgba(34,197,94,0.2)", text: "#86efac", dot: "#22c55e" },
    error:   { bg: "rgba(127,29,29,0.8)", border: "rgba(239,68,68,0.2)",  text: "#fca5a5", dot: "#ef4444" },
    info:    { bg: "rgba(20,20,20,0.9)",  border: "rgba(255,255,255,0.1)", text: "#a0a0a0", dot: "#5b5bd6" },
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts(p => p.filter(t => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).slice(2);
        setToasts(p => [...p, { id, message, type }]);
        setTimeout(() => removeToast(id), 3800);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
            {children}
            {/* Toast container */}
            <div style={{
                position: "fixed", bottom: 24, right: 24,
                zIndex: 9999, display: "flex", flexDirection: "column", gap: 8,
                pointerEvents: "none",
            }}>
                {toasts.map(t => {
                    const c = ACCENT[t.type];
                    return (
                        <div
                            key={t.id}
                            onClick={() => removeToast(t.id)}
                            className="animate-slide-up"
                            style={{
                                pointerEvents: "all",
                                display: "flex", alignItems: "center", gap: 10,
                                padding: "10px 14px",
                                borderRadius: 10,
                                border: `1px solid ${c.border}`,
                                background: c.bg,
                                backdropFilter: "blur(16px)",
                                WebkitBackdropFilter: "blur(16px)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                                cursor: "pointer",
                                maxWidth: 340,
                                minWidth: 220,
                            }}
                        >
                            <div style={{
                                width: 6, height: 6, borderRadius: "50%",
                                background: c.dot, flexShrink: 0,
                            }} />
                            <p style={{ fontSize: 13, color: c.text, letterSpacing: "-0.01em" }}>
                                {t.message}
                            </p>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
