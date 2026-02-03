"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { Destination, Tour } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";

interface AdminTourFormProps {
    tour?: Tour;
    isEditing?: boolean;
}

export default function AdminTourForm({ tour, isEditing }: AdminTourFormProps) {
    const router = useRouter();
    const { showToast } = useNotification();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        destination_id: tour?.destination_id || "",
        title: tour?.title || "",
        price: tour?.price || "",
        duration_days: tour?.duration_days || "",
        max_travelers: tour?.max_travelers || "",
        description: tour?.description || "",
        image_url: tour?.image_url || "",
        is_featured: tour?.is_featured || false,
        start_date: tour?.start_date || "",
        itinerary: tour?.itinerary ? (typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary) : [],
        inclusions: tour?.inclusions ? (typeof tour.inclusions === 'string' ? JSON.parse(tour.inclusions) : tour.inclusions) : [],
    });

    const [imageSource, setImageSource] = useState<"local" | "url">("url");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(tour?.image_url || null);

    // Sync state when tour prop changes
    useEffect(() => {
        if (tour) {
            setFormData({
                destination_id: tour.destination_id || "",
                title: tour.title || "",
                price: tour.price || "",
                duration_days: tour.duration_days || "",
                max_travelers: tour.max_travelers || "",
                description: tour.description || "",
                image_url: tour.image_url || "",
                is_featured: tour.is_featured || false,
                start_date: tour.start_date || "",
                itinerary: tour.itinerary ? (typeof tour.itinerary === 'string' ? JSON.parse(tour.itinerary) : tour.itinerary) : [],
                inclusions: tour.inclusions ? (typeof tour.inclusions === 'string' ? JSON.parse(tour.inclusions) : tour.inclusions) : [],
            });
            setImagePreview(tour.image_url || null);
        }
    }, [tour]);

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

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get('/destinations');
                setDestinations(response.data);
                if (!tour && response.data.length > 0) {
                    setFormData(prev => ({ ...prev, destination_id: response.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
            }
        };
        fetchDestinations();
    }, [tour]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSubmit = new FormData();
            formDataToSubmit.append('destination_id', String(formData.destination_id));
            formDataToSubmit.append('title', formData.title);
            formDataToSubmit.append('price', String(formData.price));
            formDataToSubmit.append('duration_days', String(formData.duration_days));
            formDataToSubmit.append('max_travelers', String(formData.max_travelers));
            formDataToSubmit.append('description', formData.description);
            formDataToSubmit.append('is_featured', formData.is_featured ? '1' : '0');
            formDataToSubmit.append('start_date', formData.start_date);
            formDataToSubmit.append('itinerary', JSON.stringify(formData.itinerary));
            formDataToSubmit.append('inclusions', JSON.stringify(formData.inclusions));

            if (imageSource === "local" && imageFile) {
                formDataToSubmit.append('image_file', imageFile);
            } else {
                formDataToSubmit.append('image_url', formData.image_url);
            }

            if (isEditing && tour) {
                formDataToSubmit.append('_method', 'PUT');
                await api.post(`/tours/${tour.id}`, formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("success", "Tour updated successfully!");
            } else {
                await api.post('/tours', formDataToSubmit, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                showToast("success", "Tour created successfully!");
            }
            router.push('/admin/tours');
        } catch (err: any) {
            console.error("Form submission failed:", err);
            showToast("error", err.response?.data?.message || "Failed to save tour.");
        } finally {
            setLoading(false);
        }
    };

    const addItineraryDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [...prev.itinerary, { day: prev.itinerary.length + 1, title: "", desc: "", paragraphs: [] }]
        }));
    };

    const removeItineraryDay = (index: number) => {
        setFormData(prev => ({
            ...prev,
            itinerary: prev.itinerary.filter((_: any, i: number) => i !== index)
        }));
    };

    const updateItineraryDay = (index: number, field: string, value: string) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const addParagraph = (dayIndex: number) => {
        const newItinerary = [...formData.itinerary];
        if (!newItinerary[dayIndex].paragraphs) {
            newItinerary[dayIndex].paragraphs = [];
        }
        newItinerary[dayIndex].paragraphs.push("");
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const removeParagraph = (dayIndex: number, paragraphIndex: number) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].paragraphs = newItinerary[dayIndex].paragraphs.filter((_: string, i: number) => i !== paragraphIndex);
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    const updateParagraph = (dayIndex: number, paragraphIndex: number, value: string) => {
        const newItinerary = [...formData.itinerary];
        newItinerary[dayIndex].paragraphs[paragraphIndex] = value;
        setFormData(prev => ({ ...prev, itinerary: newItinerary }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Tour Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Majestic Hunza Valley Tour"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Deployment Region</label>
                    <select
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium appearance-none cursor-pointer"
                        value={formData.destination_id}
                        onChange={(e) => setFormData({ ...formData, destination_id: e.target.value })}
                    >
                        {destinations.map(d => (
                            <option key={d.id} value={d.id} className="bg-secondary text-white">{d.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Asset Valuation ($)</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Duration (Days)</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Traveler Capacity</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.max_travelers}
                        onChange={(e) => setFormData({ ...formData, max_travelers: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Operation Start Date</label>
                    <input
                        type="date"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
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
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Visual Asset URL</label>
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
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Expedition Overview</label>
                <textarea
                    required
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                    rows={5}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
            </div>

            <div className="flex items-center gap-4 py-4 relative z-10 bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="relative">
                    <input
                        type="checkbox"
                        id="is_featured"
                        className="w-6 h-6 rounded-lg bg-black/20 border-white/10 text-primary focus:ring-primary cursor-pointer transition-all"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    />
                </div>
                <label htmlFor="is_featured" className="text-[10px] font-black text-white uppercase tracking-widest cursor-pointer select-none">Prioritize as Featured Expedition</label>
            </div>

            <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Expedition Timeline</h3>
                    <button
                        type="button"
                        onClick={addItineraryDay}
                        className="text-[10px] font-black text-primary hover:text-white uppercase tracking-[0.2em] transition-colors"
                    >
                        + Initialize Day
                    </button>
                </div>
                <div className="space-y-4">
                    {formData.itinerary.map((item: any, idx: number) => (
                        <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 relative group hover:bg-white/[0.08] transition-all">
                            <button type="button" onClick={() => removeItineraryDay(idx)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="md:col-span-1">
                                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Day Alpha</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-bold"
                                        value={item.day}
                                        onChange={(e) => updateItineraryDay(idx, 'day', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Objective Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-bold"
                                        value={item.title}
                                        onChange={(e) => updateItineraryDay(idx, 'title', e.target.value)}
                                        placeholder="e.g. Arrival and Sightseeing"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Main Description</label>
                                <textarea
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-medium text-xs leading-relaxed"
                                    rows={2}
                                    value={item.desc}
                                    onChange={(e) => updateItineraryDay(idx, 'desc', e.target.value)}
                                    placeholder="Brief overview of the day"
                                ></textarea>
                            </div>

                            {/* Paragraphs Section */}
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Detailed Paragraphs</label>
                                    <button
                                        type="button"
                                        onClick={() => addParagraph(idx)}
                                        className="text-[9px] font-black text-primary hover:text-white uppercase tracking-wider transition-colors"
                                    >
                                        + Add Paragraph
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {item.paragraphs && item.paragraphs.length > 0 ? item.paragraphs.map((para: string, pIdx: number) => (
                                        <div key={pIdx} className="relative">
                                            <textarea
                                                className="w-full bg-slate-950/50 border border-white/5 rounded-lg p-3 pr-10 text-white outline-none focus:border-primary/30 transition-all font-light text-xs leading-relaxed"
                                                rows={3}
                                                value={para}
                                                onChange={(e) => updateParagraph(idx, pIdx, e.target.value)}
                                                placeholder={`Paragraph ${pIdx + 1} - Add detailed information...`}
                                            ></textarea>
                                            <button
                                                type="button"
                                                onClick={() => removeParagraph(idx, pIdx)}
                                                className="absolute top-3 right-3 text-gray-600 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="text-gray-600 text-[10px] italic">No detailed paragraphs added yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Inclusions Section */}
            <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Expedition Inclusions</h3>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, inclusions: [...prev.inclusions, ""] }))}
                        className="text-[10px] font-black text-primary hover:text-white uppercase tracking-[0.2em] transition-colors"
                    >
                        + Add Asset
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.inclusions.map((inc: string, idx: number) => (
                        <div key={idx} className="relative group">
                            <input
                                type="text"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-medium text-xs"
                                value={inc}
                                onChange={(e) => {
                                    const newInclusions = [...formData.inclusions];
                                    newInclusions[idx] = e.target.value;
                                    setFormData(prev => ({ ...prev, inclusions: newInclusions }));
                                }}
                                placeholder="e.g. Luxury Accommodation"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, inclusions: prev.inclusions.filter((_: string, i: number) => i !== idx) }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full orange-gradient text-white font-black py-5 rounded-2xl transition transform active:scale-95 shadow-orange text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative z-10"
            >
                {loading ? "Transmitting Data..." : isEditing ? "Finalize Parameter Updates" : "Deploy Expedition Package"}
            </button>
        </form>
    );
}
