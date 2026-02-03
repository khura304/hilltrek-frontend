"use client";

import { useState, useEffect } from "react";
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

    const [imageSource, setImageSource] = useState<"local" | "url">("url");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(destination?.image_url || null);

    // Sync state when destination prop changes
    useEffect(() => {
        if (destination) {
            setFormData({
                name: destination.name || "",
                city: destination.city || "",
                country: destination.country || "",
                best_time_to_visit: destination.best_time_to_visit || "",
                description: destination.description || "",
                image_url: destination.image_url || "",
            });
            setImagePreview(destination.image_url || null);
        }
    }, [destination]);

    // Handle image preview for local file
    useEffect(() => {
        if (imageSource === "local" && imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else if (imageSource === "url") {
            setImagePreview(formData.image_url || null);
        }
    }, [imageSource, imageFile, formData.image_url]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('name', formData.name);
            formDataToSubmit.append('city', formData.city);
            formDataToSubmit.append('country', formData.country);
            formDataToSubmit.append('best_time_to_visit', formData.best_time_to_visit);
            formDataToSubmit.append('description', formData.description);

            if (imageSource === "local" && imageFile) {
                formDataToSubmit.append('image_file', imageFile);
            } else {
                formDataToSubmit.append('image_url', formData.image_url);
            }

            if (isEditing && destination) {
                formDataToSubmit.append('_method', 'PUT');
                await api.post(`/destinations/${destination.id}`, formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Destination updated successfully!");
            } else {
                await api.post('/destinations', formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
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

            <div className="space-y-4 relative z-10">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setImageSource("url")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${imageSource === "url" ? "bg-primary text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                            >
                                Online Link
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageSource("local")}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${imageSource === "local" ? "bg-primary text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}
                            >
                                Local File
                            </button>
                        </div>

                        {imageSource === "url" ? (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Image URL</label>
                                <input
                                    type="url"
                                    required={imageSource === "url"}
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                                    value={formData.image_url || ""}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    placeholder="/images/your-image.jpg"
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Upload Local Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required={imageSource === "local" && !isEditing}
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="w-full md:w-64 h-48 bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden relative group">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-[10px] font-black uppercase tracking-widest">
                                No Preview
                            </div>
                        )}
                    </div>
                </div>
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
