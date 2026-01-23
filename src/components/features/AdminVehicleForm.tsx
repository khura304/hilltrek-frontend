"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { Destination, Vehicle } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";

interface AdminVehicleFormProps {
    vehicle?: Vehicle;
    isEditing?: boolean;
}

export default function AdminVehicleForm({ vehicle, isEditing }: AdminVehicleFormProps) {
    const router = useRouter();
    const { showToast } = useNotification();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        destination_id: vehicle?.destination_id || "",
        title: vehicle?.title || "",
        price: vehicle?.price || "",
        duration_days: vehicle?.duration_days || "",
        max_passengers: vehicle?.max_passengers || "",
        description: vehicle?.description || "",
        image_url: vehicle?.image_url || "",
        is_featured: vehicle?.is_featured || false,
        features: vehicle?.features ? (typeof vehicle.features === 'string' ? JSON.parse(vehicle.features) : vehicle.features) : [],
    });

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get('/destinations');
                setDestinations(response.data);
                if (!vehicle && response.data.length > 0) {
                    setFormData(prev => ({ ...prev, destination_id: response.data[0].id }));
                }
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
            }
        };
        fetchDestinations();
    }, [vehicle]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSubmit = {
                ...formData,
                is_featured: formData.is_featured ? 1 : 0,
            };

            if (isEditing && vehicle) {
                await api.put(`/vehicles/${vehicle.id}`, dataToSubmit);
                showToast("success", "Vehicle updated successfully!");
            } else {
                await api.post('/vehicles', dataToSubmit);
                showToast("success", "Vehicle created successfully!");
            }
            router.push('/admin/vehicles');
        } catch (err: any) {
            console.error("Form submission failed:", err);
            showToast("error", err.response?.data?.message || "Failed to save vehicle.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Vehicle Title</label>
                    <input
                        type="text"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Toyota Prado TX (With Driver)"
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Daily Rate ($)</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Standard Duration (Days)</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.duration_days}
                        onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Passenger Capacity</label>
                    <input
                        type="number"
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        value={formData.max_passengers}
                        onChange={(e) => setFormData({ ...formData, max_passengers: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Asset Image URL</label>
                <input
                    type="url"
                    required
                    className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="/images/vehicle.jpg"
                />
            </div>

            <div className="space-y-2 relative z-10">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Vehicle Specifications</label>
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
                <label htmlFor="is_featured" className="text-[10px] font-black text-white uppercase tracking-widest cursor-pointer select-none">Prioritize as Featured Vehicle</label>
            </div>

            {/* Features Section */}
            <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Features & Amenities</h3>
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, features: [...prev.features, ""] }))}
                        className="text-[10px] font-black text-primary hover:text-white uppercase tracking-[0.2em] transition-colors"
                    >
                        + Add Feature
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.features.map((feat: string, idx: number) => (
                        <div key={idx} className="relative group">
                            <input
                                type="text"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-medium text-xs"
                                value={feat}
                                onChange={(e) => {
                                    const newFeatures = [...formData.features];
                                    newFeatures[idx] = e.target.value;
                                    setFormData(prev => ({ ...prev, features: newFeatures }));
                                }}
                                placeholder="e.g. AC / Heater"
                            />
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, features: prev.features.filter((_: string, i: number) => i !== idx) }))}
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
                {loading ? "Transmitting Data..." : isEditing ? "Update Vehicle Asset" : "Deploy Vehicle Asset"}
            </button>
        </form>
    );
}
