"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/lib/api";
import {
    Save,
    X,
    HelpCircle,
    Hash,
    Loader2,
    AlertCircle
} from "lucide-react";

export default function EditFaqPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;

    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        order: 0,
        is_active: true
    });

    useEffect(() => {
        const fetchFaq = async () => {
            try {
                setFetchLoading(true);
                const response = await api.get(`/admin/faqs/${id}`);
                setFormData({
                    question: response.data.question,
                    answer: response.data.answer,
                    order: response.data.order,
                    is_active: response.data.is_active
                });
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch FAQ:", err);
                setError(err.response?.data?.message || "Failed to load FAQ");
            } finally {
                setFetchLoading(false);
            }
        };

        if (id) {
            fetchFaq();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'order' ? parseInt(value) || 0 : value
        }));
    };

    const handleToggle = () => {
        setFormData(prev => ({
            ...prev,
            is_active: !prev.is_active
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.put(`/admin/faqs/${id}`, formData);
            router.push('/admin/faqs');
        } catch (err: any) {
            console.error("Failed to update FAQ:", err);
            setError(err.response?.data?.message || "Failed to update FAQ");
        } finally {
            setLoading(false);
        }
    };

    if (fetchLoading) return (
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    if (error && fetchLoading) return (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[400px] text-red-500">
            <AlertCircle className="w-12 h-12 mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">{error}</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-2">
                    <HelpCircle size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Management</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                    Edit <span className="text-primary italic">FAQ</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Update frequently asked question
                </p>
            </div>

            {error && !fetchLoading && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Question */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <HelpCircle size={12} /> Question
                    </label>
                    <input
                        type="text"
                        name="question"
                        value={formData.question}
                        onChange={handleChange}
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                        placeholder="e.g. Is it safe to travel to Northern Pakistan?"
                    />
                </div>

                {/* Answer */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <HelpCircle size={12} /> Answer
                    </label>
                    <textarea
                        name="answer"
                        value={formData.answer}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20 resize-none"
                        placeholder="Provide a detailed answer to this question..."
                    />
                </div>

                {/* Order */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <Hash size={12} /> Display Order
                    </label>
                    <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        min="0"
                        required
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                        placeholder="0"
                    />
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Lower numbers appear first</p>
                </div>

                {/* Status Toggle */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wide mb-1">Active Status</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Show this FAQ on the website</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggle}
                        className={`relative w-11 h-6 transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-slate-900 ${formData.is_active ? 'bg-primary' : 'bg-gray-600'
                            }`}
                    >
                        <span
                            className={`inline-block w-4 h-4 transform transition bg-white rounded-full ${formData.is_active ? 'translate-x-6' : 'translate-x-1'
                                } top-1 absolute`}
                        />
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 font-bold uppercase tracking-widest text-xs hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        <X size={14} /> Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 rounded-xl bg-primary text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-white hover:text-slate-900 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        Update FAQ
                    </button>
                </div>
            </form>
        </div>
    );
}
