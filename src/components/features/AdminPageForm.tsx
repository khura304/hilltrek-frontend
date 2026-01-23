"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api, { PageContent, updatePageContent } from "@/lib/api";

interface AdminPageFormProps {
    page?: PageContent;
    isCreate?: boolean;
}

export default function AdminPageForm({ page, isCreate = false }: AdminPageFormProps) {
    const router = useRouter();
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
                alert("Page created successfully!");
                router.push('/admin/pages');
            } else {
                if (!page?.slug) return;
                await updatePageContent(page.slug, {
                    ...formData,
                    content: blocks
                });
                alert("Page updated successfully!");
                router.push('/admin/pages');
            }
        } catch (err: any) {
            console.error("Form submission failed:", err);
            alert(err.response?.data?.message || "Failed to save page.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Page Title (Internal)</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    {isCreate && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Slug</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            />
                        </div>
                    )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 pt-6 border-t border-white/10">Hero Section</h3>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Hero Title</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.hero_title}
                            onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Hero Subtitle</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.hero_subtitle}
                            onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Hero Image URL</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.hero_image}
                            onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                        />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-6 pt-6 border-t border-white/10">Content Blocks</h3>

                <div className="space-y-4">
                    {blocks.map((block, index) => (
                        <div key={index} className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 group">
                            <div className="flex items-center justify-between text-xs uppercase tracking-widest font-bold text-white/40">
                                <span>{block.type} Block</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(index, 'up')}
                                        disabled={index === 0}
                                        className="hover:text-white disabled:opacity-20"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveBlock(index, 'down')}
                                        disabled={index === blocks.length - 1}
                                        className="hover:text-white disabled:opacity-20"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeBlock(index)}
                                        className="text-red-400 hover:text-red-300 ml-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>

                            {block.type === 'image' ? (
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-3 text-white text-sm"
                                    value={block.value}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                />
                            ) : (block.type === 'heading' ? (
                                <input
                                    type="text"
                                    placeholder="Heading Text"
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-3 text-white font-bold text-lg"
                                    value={block.value}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                />
                            ) : (
                                <textarea
                                    placeholder="Paragraph text..."
                                    rows={3}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-lg p-3 text-white text-sm"
                                    value={block.value}
                                    onChange={(e) => updateBlock(index, e.target.value)}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => addBlock('heading')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-bold transition-all">+ Heading</button>
                    <button type="button" onClick={() => addBlock('text')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-bold transition-all">+ Text</button>
                    <button type="button" onClick={() => addBlock('image')} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-bold transition-all">+ Image</button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full orange-gradient text-white font-black py-5 rounded-2xl transition transform active:scale-95 shadow-orange text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative z-10"
            >
                {loading ? "Saving..." : (isCreate ? "Create Page" : "Update Page")}
            </button>
        </form>
    );
}
