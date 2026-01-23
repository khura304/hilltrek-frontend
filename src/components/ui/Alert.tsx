"use client";

import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
    type: AlertType;
    message: string;
    dismissible?: boolean;
    onDismiss?: () => void;
    className?: string;
}

const ALERT_CONFIG = {
    success: {
        icon: CheckCircle2,
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        iconColor: "text-emerald-500",
        textColor: "text-emerald-400"
    },
    error: {
        icon: AlertCircle,
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        iconColor: "text-red-500",
        textColor: "text-red-400"
    },
    warning: {
        icon: AlertTriangle,
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        iconColor: "text-amber-500",
        textColor: "text-amber-400"
    },
    info: {
        icon: Info,
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        iconColor: "text-blue-500",
        textColor: "text-blue-400"
    }
};

export default function Alert({
    type,
    message,
    dismissible = false,
    onDismiss,
    className = ""
}: AlertProps) {
    const config = ALERT_CONFIG[type];
    const Icon = config.icon;

    return (
        <div
            className={`
                relative ${config.bg} border ${config.border} 
                rounded-2xl p-4 ${dismissible ? 'pr-12' : ''}
                ${className}
            `}
            role="alert"
        >
            <div className="flex items-start gap-3">
                <Icon size={20} className={`${config.iconColor} shrink-0 mt-0.5`} strokeWidth={2.5} />
                <p className={`text-sm font-medium ${config.textColor} leading-relaxed flex-1`}>
                    {message}
                </p>
            </div>

            {dismissible && onDismiss && (
                <button
                    onClick={onDismiss}
                    className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors"
                    aria-label="Dismiss alert"
                >
                    <X size={16} strokeWidth={2.5} />
                </button>
            )}
        </div>
    );
}
