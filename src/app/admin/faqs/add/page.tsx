"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    Save,
    X,
    HelpCircle,
    Hash,
    Loader2,
    AlertCircle
} from "lucide-react";

export default function AddFaqPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        question: "",
        answer: "",
        order: 0,
        is_active: true,
        page: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            await api.post('/admin/faqs', formData);
            router.push('/admin/faqs');
        } catch (err: any) {
            console.error("Failed to create FAQ:", err);
            setError(err.response?.data?.message || "Failed to create FAQ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-2">
                    <HelpCircle size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Management</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                    Add <span className="text-primary italic">FAQ</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Create a new frequently asked question
                </p>
            </div>

            {error && (
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

                {/* Order and Page Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Target Page */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <HelpCircle size={12} /> Target Page
                        </label>
                        <select
                            name="page"
                            value={formData.page}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                        >
                            <option value="" className="bg-secondary text-white">Global (All Pages)</option>
                            <option value="home" className="bg-secondary text-white">Home Page</option>
                            <option value="tours" className="bg-secondary text-white">Tours Page</option>
                            <option value="destinations" className="bg-secondary text-white">Destinations Page</option>
                            <option value="accommodations" className="bg-secondary text-white">Accommodations Page</option>
                            <option value="vehicles" className="bg-secondary text-white">Vehicles Page</option>
                            <option value="about" className="bg-secondary text-white">About Us</option>
                            <option value="contact" className="bg-secondary text-white">Contact Page</option>
                            <option value="custom-booking" className="bg-secondary text-white">Custom Booking</option>
                            <option value="blog" className="bg-secondary text-white">Blog Page</option>
                            <option value="gallery" className="bg-secondary text-white">Gallery Page</option>
                        </select>
                        <p className="text-[9px] text-gray-500 uppercase tracking-wider">Where should this FAQ be displayed?</p>
                    </div>
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
                        Save FAQ
                    </button>
                </div>
            </form>
        </div >
    );
}
