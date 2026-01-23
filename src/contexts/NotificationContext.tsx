"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast, { ToastType } from "@/components/ui/Toast";
import Modal, { ModalType } from "@/components/ui/Modal";

interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ModalItem {
    type: ModalType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}

interface NotificationContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    showModal: (options: Omit<ModalItem, 'type'> & { type?: ModalType }) => void;
    confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) => void;
    closeModal: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const [modal, setModal] = useState<ModalItem | null>(null);

    const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        setToasts((prev) => [...prev, { id, type, message, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showModal = useCallback((options: Omit<ModalItem, 'type'> & { type?: ModalType }) => {
        setModal({
            type: options.type || 'confirm',
            title: options.title,
            message: options.message,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            onConfirm: options.onConfirm,
            onCancel: options.onCancel,
            showCancel: options.showCancel !== false
        });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const confirm = useCallback((
        title: string,
        message: string,
        onConfirm: () => void,
        onCancel?: () => void
    ) => {
        showModal({
            type: 'confirm',
            title,
            message,
            confirmText: 'Confirm',
            cancelText: 'Cancel',
            onConfirm: () => {
                onConfirm();
                closeModal();
            },
            onCancel: () => {
                if (onCancel) onCancel();
                closeModal();
            },
            showCancel: true
        });
    }, [showModal, closeModal]);

    return (
        <NotificationContext.Provider value={{ showToast, showModal, confirm, closeModal }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
                <div className="flex flex-col gap-3 pointer-events-auto">
                    {toasts.map((toast) => (
                        <Toast
                            key={toast.id}
                            id={toast.id}
                            type={toast.type}
                            message={toast.message}
                            duration={toast.duration}
                            onClose={removeToast}
                        />
                    ))}
                </div>
            </div>

            {/* Modal */}
            {modal && (
                <Modal
                    isOpen={true}
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    confirmText={modal.confirmText}
                    cancelText={modal.cancelText}
                    onConfirm={modal.onConfirm}
                    onCancel={modal.onCancel || closeModal}
                    showCancel={modal.showCancel}
                />
            )}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
}
