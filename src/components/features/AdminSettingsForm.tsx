"use client";

import { useState, useEffect } from "react";
import api, { getSiteSettings, updateSiteSettings, SiteSetting, getPages, PageContent } from "@/lib/api";
import { Plus, Trash2, MoveUp, MoveDown, Settings, Code, Layers } from "lucide-react";

interface NavLink {
    label: string;
    url: string;
}

interface HeadInjection {
    id: string;
    name: string;
    tags: string;
    pages: string[];
}

function LinkListManager({
    label,
    links,
    onChange
}: {
    label: string;
    links: NavLink[];
    onChange: (links: NavLink[]) => void;
}) {
    const addLink = () => {
        onChange([...links, { label: "", url: "" }]);
    };

    const removeLink = (index: number) => {
        onChange(links.filter((_, i) => i !== index));
    };

    const updateLink = (index: number, field: keyof NavLink, value: string) => {
        const newLinks = [...links];
        newLinks[index][field] = value;
        onChange(newLinks);
    };

    const moveLink = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === links.length - 1) return;
        const newLinks = [...links];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newLinks[index], newLinks[swapIndex]] = [newLinks[swapIndex], newLinks[index]];
        onChange(newLinks);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{label}</label>
                <button
                    type="button"
                    onClick={addLink}
                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors"
                >
                    <Plus size={14} /> Add Link
                </button>
            </div>
            <div className="space-y-3">
                {links.map((link, index) => (
                    <div key={index} className="flex gap-4 items-center bg-slate-900/50 p-4 rounded-2xl border border-white/5 group">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Label (e.g. About)"
                                className="bg-transparent border-b border-white/10 p-2 text-white text-sm outline-none focus:border-primary transition-all"
                                value={link.label}
                                onChange={(e) => updateLink(index, 'label', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="URL (e.g. /about)"
                                className="bg-transparent border-b border-white/10 p-2 text-white text-sm outline-none focus:border-primary transition-all"
                                value={link.url}
                                onChange={(e) => updateLink(index, 'url', e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button type="button" onClick={() => moveLink(index, 'up')} disabled={index === 0} className="p-2 text-gray-500 hover:text-white disabled:opacity-0"><MoveUp size={14} /></button>
                            <button type="button" onClick={() => moveLink(index, 'down')} disabled={index === links.length - 1} className="p-2 text-gray-500 hover:text-white disabled:opacity-0"><MoveDown size={14} /></button>
                            <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
                {links.length === 0 && (
                    <div className="text-center py-8 text-white/20 border-2 border-dashed border-white/5 rounded-2xl text-xs">
                        No links added yet. Click "+ Add Link" to get started.
                    </div>
                )}
            </div>
        </div>
    );
}

function HeadInjectionManager({
    injections,
    pages,
    onChange
}: {
    injections: HeadInjection[];
    pages: PageContent[];
    onChange: (injections: HeadInjection[]) => void;
}) {
    const addInjection = () => {
        onChange([...injections, { id: Math.random().toString(36).substr(2, 9), name: "New Injection", tags: "", pages: [] }]);
    };

    const removeInjection = (index: number) => {
        if (confirm("Are you sure you want to remove this injection?")) {
            onChange(injections.filter((_, i) => i !== index));
        }
    };

    const updateInjection = (index: number, field: keyof HeadInjection, value: any) => {
        const newList = [...injections];
        newList[index] = { ...newList[index], [field]: value };
        onChange(newList);
    };

    const togglePage = (index: number, slug: string) => {
        const injection = injections[index];
        const newPages = injection.pages.includes(slug)
            ? injection.pages.filter(p => p !== slug)
            : [...injection.pages, slug];
        updateInjection(index, 'pages', newPages);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Manage Scripts & Tags</label>
                <button
                    type="button"
                    onClick={addInjection}
                    className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors"
                >
                    <Plus size={14} /> Add New Script
                </button>
            </div>
            <div className="space-y-4">
                {injections.map((inj, idx) => (
                    <div key={inj.id} className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 space-y-4 relative group">
                        <button
                            type="button"
                            onClick={() => removeInjection(idx)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition-colors p-2"
                        >
                            <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest px-1">Injection Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-3 text-white text-sm outline-none focus:border-primary transition-all"
                                    value={inj.name}
                                    onChange={(e) => updateInjection(idx, 'name', e.target.value)}
                                    placeholder="e.g. Google Analytics"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Tags (HTML/Script)</label>
                            <textarea
                                className="w-full bg-slate-950/50 border border-white/5 rounded-xl p-4 text-white font-mono text-xs outline-none focus:border-primary transition-all min-h-[100px]"
                                value={inj.tags}
                                onChange={(e) => updateInjection(idx, 'tags', e.target.value)}
                                placeholder="<script>...</script>"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest px-1">Apply To Pages</label>
                            <div className="flex flex-wrap gap-2">
                                {pages.map(page => {
                                    const isSelected = inj.pages.includes(page.slug);
                                    return (
                                        <button
                                            key={page.slug}
                                            type="button"
                                            onClick={() => togglePage(idx, page.slug)}
                                            className={`px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider transition-all border ${isSelected ? 'bg-primary/20 border-primary text-white' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}
                                        >
                                            {page.title}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ))}
                {injections.length === 0 && (
                    <div className="text-center py-12 text-white/20 border-2 border-dashed border-white/5 rounded-3xl text-xs uppercase font-black tracking-widest">
                        No scripts defined. Click "+ Add New Script" to begin injection.
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminSettingsForm() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState<SiteSetting>({});
    const [pages, setPages] = useState<PageContent[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsData, pagesData] = await Promise.all([
                    getSiteSettings(),
                    getPages()
                ]);

                // Migration logic for old fields
                if (!settingsData.custom_head_injections && settingsData.custom_head_tags) {
                    const legacyInj: HeadInjection = {
                        id: "legacy",
                        name: "Legacy Injection",
                        tags: settingsData.custom_head_tags,
                        pages: JSON.parse(settingsData.custom_head_pages || "[]")
                    };
                    settingsData.custom_head_injections = JSON.stringify([legacyInj]);
                }

                setFormData(settingsData);
                setPages(pagesData);
            } catch (err) {
                console.error("Failed to fetch settings or pages:", err);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleLinksChange = (key: 'navbar_links' | 'footer_links' | 'footer_bottom_links', links: NavLink[]) => {
        setFormData(prev => ({ ...prev, [key]: JSON.stringify(links) }));
    };

    const handleInjectionsChange = (injections: HeadInjection[]) => {
        setFormData(prev => ({ ...prev, custom_head_injections: JSON.stringify(injections) }));
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

                <h3 className="text-2xl font-bold text-white mb-6 pt-6 border-t border-white/10">Navigation Management</h3>

                <div className="space-y-8">
                    <LinkListManager
                        label="Navbar Links"
                        links={(() => {
                            try { return JSON.parse(formData.navbar_links || "[]"); }
                            catch (e) { return []; }
                        })()}
                        onChange={(links) => handleLinksChange('navbar_links', links)}
                    />

                    <LinkListManager
                        label="Footer Main Links (Quick Links)"
                        links={(() => {
                            try { return JSON.parse(formData.footer_links || "[]"); }
                            catch (e) { return []; }
                        })()}
                        onChange={(links) => handleLinksChange('footer_links', links)}
                    />

                    <LinkListManager
                        label="Footer Bottom Links (Privacy, Terms, etc.)"
                        links={(() => {
                            try { return JSON.parse(formData.footer_bottom_links || "[]"); }
                            catch (e) { return []; }
                        })()}
                        onChange={(links) => handleLinksChange('footer_bottom_links', links)}
                    />
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

            <div className="flex justify-between items-center border-b border-white/5 pb-4 pt-6">
                <h3 className="text-2xl font-bold text-white">Head Section Injection</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <Code size={14} className="text-primary" />
                    <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Advanced Tool</span>
                </div>
            </div>

            <div className="space-y-8">
                <HeadInjectionManager
                    injections={(() => {
                        try { return JSON.parse(formData.custom_head_injections || "[]"); }
                        catch (e) { return []; }
                    })()}
                    pages={pages}
                    onChange={handleInjectionsChange}
                />

                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-orange-500/20 rounded-lg text-orange-500">
                        <Settings size={18} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Configuration Note</h4>
                        <p className="text-[9px] text-gray-400 leading-relaxed italic">Multiple scripts will be accumulated and injected together on overlapping target pages. Changes are permanent after saving.</p>
                    </div>
                </div>
            </div>

            <div className="pt-6"></div>

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
