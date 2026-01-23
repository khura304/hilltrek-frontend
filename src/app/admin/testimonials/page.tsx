"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
    MessageSquare,
    Star,
    Plus,
    User,
    Trash2,
    Loader2,
    AlertCircle,
    Eye,
    EyeOff
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useNotification } from "@/contexts/NotificationContext";

interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string | null;
    is_active: boolean;
    created_at: string;
}

export default function AdminTestimonialsPage() {
    const { showToast, confirm } = useNotification();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/testimonials');
            setTestimonials(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch testimonials:", err);
            setError(err.response?.data?.message || "Failed to load testimonials");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = async (id: number) => {
        confirm(
            "Delete Testimonial?",
            "Are you sure you want to delete this testimonial?",
            async () => {
                setActionLoading(id);
                try {
                    await api.delete(`/admin/testimonials/${id}`);
                    setTestimonials(prev => prev.filter(t => t.id !== id));
                    showToast("success", "Testimonial deleted successfully");
                } catch (err) {
                    console.error("Failed to delete testimonial:", err);
                    showToast("error", "Failed to delete testimonial");
                } finally {
                    setActionLoading(null);
                }
            }
        );
    };

    const handleToggleStatus = async (testimonial: Testimonial) => {
        setActionLoading(testimonial.id);
        try {
            await api.put(`/admin/testimonials/${testimonial.id}`, {
                is_active: !testimonial.is_active
            });
            setTestimonials(prev => prev.map(t =>
                t.id === testimonial.id ? { ...t, is_active: !t.is_active } : t
            ));
            showToast("success", `Testimonial ${!testimonial.is_active ? 'activated' : 'deactivated'} successfully`);
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
                        <MessageSquare size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Management</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        Testimonials <span className="text-primary italic">Manager</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Manage what travelers say about us
                    </p>
                </div>

                <Link
                    href="/admin/testimonials/add"
                    className="bg-primary text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                    <Plus size={14} /> Add New
                </Link>
            </div>

            {/* Testimonials List */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                {testimonials.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">No testimonials yet</p>
                        <p className="text-[10px] font-bold mt-2">Add your first testimonial to get started</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-slate-900/50 p-6 rounded-2xl border border-white/5 group hover:border-primary/20 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {testimonial.image ? (
                                            <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-primary">
                                                <User size={16} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="text-white font-bold text-sm">{testimonial.name}</h3>
                                            <p className="text-primary text-[10px] font-bold uppercase tracking-wider">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg">
                                        <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-bold text-white">{testimonial.rating}</span>
                                    </div>
                                </div>

                                <p className="text-gray-400 text-xs italic mb-6 line-clamp-3">"{testimonial.content}"</p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded border ${testimonial.is_active
                                        ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
                                        : 'text-gray-500 bg-gray-500/10 border-gray-500/20'
                                        }`}>
                                        {testimonial.is_active ? 'Active' : 'Hidden'}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(testimonial)}
                                            disabled={actionLoading === testimonial.id}
                                            className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                            title={testimonial.is_active ? "Hide" : "Show"}
                                        >
                                            {actionLoading === testimonial.id ? <Loader2 size={14} className="animate-spin" /> : (
                                                testimonial.is_active ? <EyeOff size={14} /> : <Eye size={14} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(testimonial.id)}
                                            disabled={actionLoading === testimonial.id}
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
