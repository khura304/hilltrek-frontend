"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
    HelpCircle,
    Plus,
    Trash2,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff,
    Edit
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useNotification } from "@/contexts/NotificationContext";

interface Faq {
    id: number;
    question: string;
    answer: string;
    order: number;
    is_active: boolean;
    page?: string;
    created_at: string;
}

export default function AdminFaqsPage() {
    const { showToast, confirm } = useNotification();
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/faqs');
            setFaqs(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch FAQs:", err);
            setError(err.response?.data?.message || "Failed to load FAQs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFaqs();
    }, []);

    const handleDelete = async (id: number) => {
        confirm(
            "Delete FAQ?",
            "Are you sure you want to delete this FAQ?",
            async () => {
                setActionLoading(id);
                try {
                    await api.delete(`/admin/faqs/${id}`);
                    setFaqs(prev => prev.filter(f => f.id !== id));
                    showToast("success", "FAQ deleted successfully");
                } catch (err) {
                    console.error("Failed to delete FAQ:", err);
                    showToast("error", "Failed to delete FAQ");
                } finally {
                    setActionLoading(null);
                }
            }
        );
    };

    const handleToggleStatus = async (faq: Faq) => {
        setActionLoading(faq.id);
        try {
            await api.put(`/admin/faqs/${faq.id}`, {
                is_active: !faq.is_active
            });
            setFaqs(prev => prev.map(f =>
                f.id === faq.id ? { ...f, is_active: !f.is_active } : f
            ));
            showToast("success", `FAQ ${!faq.is_active ? 'activated' : 'deactivated'} successfully`);
        } catch (err) {
            console.error("Failed to update status:", err);
            showToast("error", "Failed to update status");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex-grow flex items-center justify-center min-h-[400px] p-6">
            <Alert type="error" message={error} className="max-w-md w-full" />
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <HelpCircle size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Management</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        FAQs <span className="text-primary italic">Manager</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Manage frequently asked questions
                    </p>
                </div>

                <Link
                    href="/admin/faqs/add"
                    className="bg-primary text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus size={14} /> Add New
                </Link>
            </div>

            {/* FAQs List */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                {faqs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <HelpCircle size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">No FAQs yet</p>
                        <p className="text-[10px] font-bold mt-2">Add your first FAQ to get started</p>
                    </div>
                ) : (
                    <div className="p-6 space-y-4">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                                                #{faq.order}
                                            </span>
                                            <h3 className="text-white font-bold text-sm">{faq.question}</h3>
                                        </div>
                                        <p className="text-gray-400 text-xs line-clamp-2">{faq.answer}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${faq.is_active
                                        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                        : 'text-gray-500 bg-gray-500/10 border-gray-500/20'
                                        }`}>
                                        {faq.is_active ? 'Active' : 'Hidden'}
                                    </div>

                                    {faq.page && (
                                        <div className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border text-primary bg-primary/10 border-primary/20">
                                            Page: {faq.page}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(faq)}
                                            disabled={actionLoading === faq.id}
                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                            title={faq.is_active ? "Hide" : "Show"}
                                        >
                                            {actionLoading === faq.id ? <Loader2 size={14} className="animate-spin" /> : (
                                                faq.is_active ? <EyeOff size={14} /> : <Eye size={14} />
                                            )}
                                        </button>
                                        <Link
                                            href={`/admin/faqs/edit/${faq.id}`}
                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit size={14} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(faq.id)}
                                            disabled={actionLoading === faq.id}
                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
