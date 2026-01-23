"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

export type ModalType = "success" | "error" | "warning" | "info" | "confirm";

export interface ModalProps {
    isOpen: boolean;
    type?: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

const MODAL_CONFIG = {
    success: {
        icon: CheckCircle2,
        iconBg: "bg-emerald-500/20",
        iconBorder: "border-emerald-500/30",
        iconColor: "text-emerald-500",
        buttonGradient: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500"
    },
    error: {
        icon: AlertCircle,
        iconBg: "bg-red-500/20",
        iconBorder: "border-red-500/30",
        iconColor: "text-red-500",
        buttonGradient: "from-red-500 to-red-600 hover:from-red-600 hover:to-red-500"
    },
    warning: {
        icon: AlertTriangle,
        iconBg: "bg-amber-500/20",
        iconBorder: "border-amber-500/30",
        iconColor: "text-amber-500",
        buttonGradient: "from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500"
    },
    info: {
        icon: Info,
        iconBg: "bg-blue-500/20",
        iconBorder: "border-blue-500/30",
        iconColor: "text-blue-500",
        buttonGradient: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-500"
    },
    confirm: {
        icon: AlertCircle,
        iconBg: "bg-primary/20",
        iconBorder: "border-primary/30",
        iconColor: "text-primary",
        buttonGradient: "from-primary to-orange-600 hover:from-orange-600 hover:to-primary"
    }
};

export default function Modal({
    isOpen,
    type = "confirm",
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    showCancel = true
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const config = MODAL_CONFIG[type];
    const Icon = config.icon;

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen && onCancel) {
                onCancel();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onCancel) {
            onCancel();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in-up"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative bg-white/[0.03] backdrop-blur-xl rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-2xl max-w-md w-full animate-fade-in-up"
                style={{ animationDelay: "50ms" }}
            >
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="absolute top-6 right-6 text-white/40 hover:text-white/80 transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                )}

                <div className="text-center">
                    <div className={`
                        w-20 h-20 rounded-full ${config.iconBg}
                        flex items-center justify-center mx-auto mb-6
                        border ${config.iconBorder}
                    `}>
                        <Icon size={40} className={config.iconColor} strokeWidth={2.5} />
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase mb-4">
                        {title}
                    </h3>

                    <p className="text-base text-gray-300 font-medium mb-8 leading-relaxed">
                        {message}
                    </p>

                    <div className={`flex flex-col ${showCancel ? 'sm:flex-row' : ''} gap-3 justify-center`}>
                        {onConfirm && (
                            <button
                                onClick={onConfirm}
                                className={`
                                    inline-flex items-center justify-center gap-2
                                    bg-gradient-to-r ${config.buttonGradient}
                                    text-white px-6 py-3 rounded-xl
                                    font-black text-sm uppercase tracking-widest
                                    shadow-2xl transition-all duration-300
                                    hover:scale-105
                                `}
                            >
                                {confirmText}
                            </button>
                        )}

                        {showCancel && onCancel && (
                            <button
                                onClick={onCancel}
                                className="
                                    inline-flex items-center justify-center gap-2
                                    bg-white/10 hover:bg-white/20
                                    text-white px-6 py-3 rounded-xl
                                    font-bold text-sm uppercase tracking-widest
                                    border border-white/20 transition-all
                                    hover:scale-105
                                "
                            >
                                {cancelText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
