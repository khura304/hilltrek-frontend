"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
    Save,
    X,
    MessageSquare,
    Star,
    User,
    Briefcase,
    Image as ImageIcon,
    Loader2,
    AlertCircle
} from "lucide-react";

export default function AddTestimonialPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5,
        image: "",
        is_active: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rating' ? parseInt(value) : value
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
            await api.post('/admin/testimonials', formData);
            router.push('/admin/testimonials');
        } catch (err: any) {
            console.error("Failed to create testimonial:", err);
            setError(err.response?.data?.message || "Failed to create testimonial");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-6 border-b border-white/5">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-2">
                    <MessageSquare size={10} className="text-primary" />
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Management</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                    Add <span className="text-primary italic">Testimonial</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Create a new testimonial from a traveler
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500">
                    <AlertCircle size={18} />
                    <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <User size={12} /> Traveler Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                            placeholder="e.g. Sarah Johnson"
                        />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Briefcase size={12} /> Role / Title
                        </label>
                        <input
                            type="text"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                            placeholder="e.g. Adventure Enthusiast"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rating */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <Star size={12} /> Rating
                        </label>
                        <select
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors [&>option]:bg-slate-900"
                        >
                            {[5, 4, 3, 2, 1].map(r => (
                                <option key={r} value={r}>{r} Stars</option>
                            ))}
                        </select>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                            <ImageIcon size={12} /> Image URL
                        </label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                        <MessageSquare size={12} /> Testimonial Content
                    </label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/20 resize-none"
                        placeholder="Share the traveler's experience..."
                    />
                </div>

                {/* Status Toggle */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-white uppercase tracking-wide mb-1">Active Status</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Show this testimonial on the website</p>
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
                        Save Testimonial
                    </button>
                </div>
            </form>
        </div>
    );
}
