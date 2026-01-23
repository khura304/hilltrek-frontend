"use client";

import { useState, useEffect } from "react";
import api, { getSiteSettings, updateSiteSettings, SiteSetting } from "@/lib/api";

export default function AdminSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<SiteSetting>({});

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSiteSettings();
                setFormData(settings);
            } catch (err) {
                console.error("Failed to fetch settings:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateSiteSettings(formData);
            alert("Settings updated successfully!");
        } catch (err: any) {
            console.error("Form submission failed:", err);
            alert(err.response?.data?.message || "Failed to update settings.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-white">Loading settings...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="space-y-6 relative z-10">
                <h3 className="text-2xl font-bold text-white mb-6">General Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Site Name</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.site_name || ""}
                            onChange={(e) => handleChange('site_name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Logo URL</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.logo_url || ""}
                            onChange={(e) => handleChange('logo_url', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Footer Text</label>
                    <input
                        type="text"
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.footer_text || ""}
                        onChange={(e) => handleChange('footer_text', e.target.value)}
                    />
                </div>

                <div className="space-y-2 pt-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Footer Links (JSON Format)</label>
                    <textarea
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20 font-mono text-xs"
                        rows={4}
                        placeholder='[{"label": "Privacy", "url": "/privacy"}, {"label": "Terms", "url": "/terms"}]'
                        value={formData.footer_links || ""}
                        onChange={(e) => handleChange('footer_links', e.target.value)}
                    />
                    <p className="text-xs text-white/30 px-2">Enter links as a JSON array of objects with label and url.</p>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 pt-6 border-t border-white/10">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Contact Email</label>
                        <input
                            type="email"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.contact_email || ""}
                            onChange={(e) => handleChange('contact_email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Contact Phone</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.contact_phone || ""}
                            onChange={(e) => handleChange('contact_phone', e.target.value)}
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 pt-6 border-t border-white/10">Social Media</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Facebook URL</label>
                        <input
                            type="url"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.social_facebook || ""}
                            onChange={(e) => handleChange('social_facebook', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Twitter URL</label>
                        <input
                            type="url"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.social_twitter || ""}
                            onChange={(e) => handleChange('social_twitter', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Instagram URL</label>
                        <input
                            type="url"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.social_instagram || ""}
                            onChange={(e) => handleChange('social_instagram', e.target.value)}
                        />
                    </div>
                </div>

            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full orange-gradient text-white font-black py-5 rounded-2xl transition transform active:scale-95 shadow-orange text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative z-10"
            >
                {loading ? "Saving Changes..." : "Update Settings"}
            </button>
        </form>
    );
}
