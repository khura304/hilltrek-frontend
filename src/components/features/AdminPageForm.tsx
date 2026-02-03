"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { PageContent, updatePageContent } from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import { Plus, Trash2, MoveUp, MoveDown, Image as ImageIcon, Type, Heading as HeadingIcon } from "lucide-react";

interface AdminPageFormProps {
    page?: PageContent;
    isCreate?: boolean;
}

export default function AdminPageForm({ page, isCreate = false }: AdminPageFormProps) {
    const router = useRouter();
    const { showToast } = useNotification();
    const [loading, setLoading] = useState(false);

    const [blocks, setBlocks] = useState<any[]>(() => {
        if (page?.content && Array.isArray(page.content)) {
            return page.content;
        }
        return [];
    });

    const [formData, setFormData] = useState({
        title: page?.title || "",
        slug: page?.slug || "",
        hero_title: page?.hero_title || "",
        hero_subtitle: page?.hero_subtitle || "",
        hero_image: page?.hero_image || "",
    });

    const [imagePreview, setImagePreview] = useState<string | null>(page?.hero_image || null);

    useEffect(() => {
        setImagePreview(formData.hero_image || null);
    }, [formData.hero_image]);

    const addBlock = (type: 'text' | 'image' | 'heading') => {
        setBlocks([...blocks, { type, value: '' }]);
    };

    const updateBlock = (index: number, value: string) => {
        const newBlocks = [...blocks];
        newBlocks[index].value = value;
        setBlocks(newBlocks);
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === blocks.length - 1) return;

        const newBlocks = [...blocks];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
        setBlocks(newBlocks);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isCreate) {
                await api.post('/admin/pages', {
                    ...formData,
                    content: blocks
                });
                showToast("success", "Page created successfully!");
                router.push('/admin/pages');
            } else {
                if (!page?.slug) return;
                await updatePageContent(page.slug, {
                    ...formData,
                    content: blocks
                });
                showToast("success", "Page updated successfully!");
                router.push('/admin/pages');
            }
        } catch (err: any) {
            console.error("Form submission failed:", err);
            showToast("error", err.response?.data?.message || "Failed to save page.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="space-y-8 relative z-10">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Primary Configuration</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Page Title (Internal)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. About Us"
                        />
                    </div>
                    {isCreate && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">System Slug</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="e.g. about-us"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center border-b border-white/5 pb-4 pt-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Hero Section Configuration</h3>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Display Title</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                                value={formData.hero_title}
                                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                                placeholder="e.g. Discover Our Story"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Display Subtitle</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                                value={formData.hero_subtitle}
                                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                                placeholder="e.g. Exploring the peaks since 1995"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Background Asset URL</label>
                            <input
                                type="text"
                                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                                value={formData.hero_image}
                                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                                placeholder="/images/hero-bg.jpg"
                            />
                        </div>
                        <div className="w-full md:w-48 h-32 bg-slate-950/80 border border-white/10 rounded-2xl overflow-hidden relative group self-end">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600 text-[8px] font-black uppercase tracking-widest text-center px-2">
                                    No Image Preview
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center border-b border-white/5 pb-4 pt-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest px-2">Adaptive Content Blocks</h3>
                    <div className="flex gap-2">
                        <button type="button" onClick={() => addBlock('heading')} className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white uppercase tracking-wider transition-colors"><Plus size={14} /> Heading</button>
                        <button type="button" onClick={() => addBlock('text')} className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white uppercase tracking-wider transition-colors"><Plus size={14} /> Text</button>
                        <button type="button" onClick={() => addBlock('image')} className="flex items-center gap-2 text-[10px] font-black text-primary hover:text-white uppercase tracking-wider transition-colors"><Plus size={14} /> Image</button>
                    </div>
                </div>

                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <div key={index} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 relative group hover:bg-white/[0.08] transition-all">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                                    {block.type === 'heading' && <HeadingIcon size={14} />}
                                    {block.type === 'text' && <Type size={14} />}
                                    {block.type === 'image' && <ImageIcon size={14} />}
                                    {block.type} Element
                                </div>
                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                    <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0} className="p-2 text-gray-500 hover:text-white disabled:opacity-0 transition-colors"><MoveUp size={14} /></button>
                                    <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === blocks.length - 1} className="p-2 text-gray-500 hover:text-white disabled:opacity-0 transition-colors"><MoveDown size={14} /></button>
                                    <button type="button" onClick={() => removeBlock(index)} className="p-2 text-red-500 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            {block.type === 'image' ? (
                                <div className="flex gap-4">
                                    <input
                                        type="text"
                                        placeholder="Visual Asset URL"
                                        className="flex-1 bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-medium text-xs"
                                        value={block.value}
                                        onChange={(e) => updateBlock(index, e.target.value)}
                                    />
                                    {block.value && (
                                        <div className="w-16 h-10 bg-black rounded-lg overflow-hidden border border-white/10">
                                            <img src={block.value} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            ) : block.type === 'heading' ? (
                                <input
                                    type="text"
                                    placeholder="Component Heading Title"
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-bold text-sm"
                                    value={block.value}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                />
                            ) : (
                                <textarea
                                    placeholder="Compose detailed narrative..."
                                    rows={4}
                                    className="w-full bg-slate-950/80 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-primary/50 transition-all font-medium text-xs leading-relaxed"
                                    value={block.value}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                    {blocks.length === 0 && (
                        <div className="text-center py-12 text-white/10 border-2 border-dashed border-white/5 rounded-[2rem] text-xs font-black uppercase tracking-widest">
                            No content modules initialized. Select an element above to begin.
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full orange-gradient text-white font-black py-5 rounded-2xl transition transform active:scale-95 shadow-orange text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative z-10"
            >
                {loading ? "Transmitting Site Data..." : (isCreate ? "Deploy New Site Content" : "Finalize Content Updates")}
            </button>
        </form>
    );
}
