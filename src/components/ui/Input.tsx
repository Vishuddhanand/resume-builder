"use client";

import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, leftIcon, className = "", id, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={id}
                        className="text-sm font-medium text-slate-300"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={id}
                        className={`w-full bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200
              ${leftIcon ? "pl-10" : ""}
              ${error ? "border-red-500/50 bg-red-500/5" : "border-white/10 hover:border-white/20"}
              ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                        <span>✕</span> {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";
export default Input;
