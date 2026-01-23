"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const TOAST_CONFIG = {
    success: {
        icon: CheckCircle2,
        gradient: "from-emerald-500/10 to-emerald-600/5",
        border: "border-emerald-500/20",
        iconBg: "bg-emerald-500/20",
        iconBorder: "border-emerald-500/30",
        iconColor: "text-emerald-500",
        textColor: "text-emerald-400"
    },
    error: {
        icon: AlertCircle,
        gradient: "from-red-500/10 to-red-600/5",
        border: "border-red-500/20",
        iconBg: "bg-red-500/20",
        iconBorder: "border-red-500/30",
        iconColor: "text-red-500",
        textColor: "text-red-400"
    },
    warning: {
        icon: AlertTriangle,
        gradient: "from-amber-500/10 to-amber-600/5",
        border: "border-amber-500/20",
        iconBg: "bg-amber-500/20",
        iconBorder: "border-amber-500/30",
        iconColor: "text-amber-500",
        textColor: "text-amber-400"
    },
    info: {
        icon: Info,
        gradient: "from-blue-500/10 to-blue-600/5",
        border: "border-blue-500/20",
        iconBg: "bg-blue-500/20",
        iconBorder: "border-blue-500/30",
        iconColor: "text-blue-500",
        textColor: "text-blue-400"
    }
};

export default function Toast({ id, type, message, duration = 5000, onClose }: ToastProps) {
    const config = TOAST_CONFIG[type];
    const Icon = config.icon;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    return (
        <div
            className={`
                relative overflow-hidden
                bg-gradient-to-br ${config.gradient}
                backdrop-blur-xl rounded-2xl border ${config.border}
                p-4 pr-12 shadow-2xl
                animate-fade-in-right
                min-w-[320px] max-w-md
            `}
        >
            <div className="flex items-start gap-3">
                <div className={`
                    w-10 h-10 rounded-full ${config.iconBg} 
                    flex items-center justify-center 
                    border ${config.iconBorder} shrink-0
                `}>
                    <Icon size={20} className={config.iconColor} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${config.textColor} leading-relaxed break-words`}>
                        {message}
                    </p>
                </div>
            </div>

            <button
                onClick={() => onClose(id)}
                className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
                aria-label="Close notification"
            >
                <X size={16} strokeWidth={2.5} />
            </button>
        </div>
    );
}
