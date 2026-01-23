"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api, { Destination } from "@/lib/api";

interface AdminDestinationFormProps {
    destination?: Destination;
    isEditing?: boolean;
}

export default function AdminDestinationForm({ destination, isEditing }: AdminDestinationFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: destination?.name || "",
        city: destination?.city || "",
        country: destination?.country || "",
        best_time_to_visit: destination?.best_time_to_visit || "",
        description: destination?.description || "",
        image_url: destination?.image_url || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && destination) {
                await api.put(`/destinations/${destination.id}`, formData);
                alert("Destination updated successfully!");
            } else {
                await api.post('/destinations', formData);
                alert("Destination created successfully!");
            }
            router.push('/admin/destinations');
        } catch (err: any) {
            console.error("Form submission failed:", err);
            alert(err.response?.data?.message || "Failed to save destination.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Destination Name</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Hunza Valley"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">City</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g. Karimabad"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Country</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. Pakistan"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Best Time to Visit</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.best_time_to_visit}
                        onChange={(e) => setFormData({ ...formData, best_time_to_visit: e.target.value })}
                        placeholder="e.g. April to October"
                    />
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Image URL</label>
                <input
                    type="url"
                    required
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="/images/your-image.jpg"
                />
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Description</label>
                <textarea
                    required
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full orange-gradient text-white font-black py-5 rounded-2xl transition transform active:scale-95 shadow-orange text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative z-10"
            >
                {loading ? "Processing Data..." : isEditing ? "Update Regional Cluster" : "Register New Destination"}
            </button>
        </form>
    );
}
