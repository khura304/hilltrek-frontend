"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Upload, X, Loader2, Link as LinkIcon } from "lucide-react";

interface Blog {
    id?: number;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    image?: string;
    image_url?: string;
    meta_title?: string;
    meta_description?: string;
    is_published: boolean;
}

interface AdminBlogFormProps {
    blog?: Blog;
    isCreate?: boolean;
}

export default function AdminBlogForm({ blog, isCreate = false }: AdminBlogFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploadType, setUploadType] = useState<'local' | 'url'>('local'); // Default to local, or check valid URL vs path
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(blog?.image_url || null);

    // Determine initial upload type based on existing image
    useEffect(() => {
        if (blog?.image && blog.image.startsWith('http')) {
            setUploadType('url');
        } else if (blog?.image) {
            setUploadType('local');
        }
    }, [blog]);

    const [formData, setFormData] = useState<Partial<Blog>>({
        title: blog?.title || "",
        slug: blog?.slug || "",
        excerpt: blog?.excerpt || "",
        content: blog?.content || "",
        image: blog?.image || "", // Store URL here if type is 'url'
        meta_title: blog?.meta_title || "",
        meta_description: blog?.meta_description || "",
        is_published: blog?.is_published || false,
    });

    // Auto-set SEO fields
    useEffect(() => {
        if (!blog && isCreate) {
            // Only auto-set if it's a new post or fields are empty to avoid overwriting user edits
            if (!formData.meta_title || formData.meta_title === (formData.title || "").slice(0, -1)) { // rudimentary check if it was matching previous title
                setFormData(prev => ({ ...prev, meta_title: prev.title }));
            }
        }
    }, [formData.title, isCreate, blog, formData.meta_title]);

    useEffect(() => {
        if (!blog && isCreate) {
            if (!formData.meta_description) {
                setFormData(prev => ({ ...prev, meta_description: prev.excerpt }));
            }
        }
    }, [formData.excerpt, isCreate, blog, formData.meta_description]);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'is_published') {
                data.append(key, formData[key] ? '1' : '0');
            } else if (key === 'image' && uploadType === 'local') {
                // Skip adding 'image' text field if local upload is selected, handled by file
            } else {
                data.append(key, (formData as any)[key] || '');
            }
        });

        if (uploadType === 'local' && selectedFile) {
            data.append('image', selectedFile);
        }

        // If uploadType is 'url', formData.image should contain the URL string, which we appended above.

        try {
            if (isCreate) {
                await api.post('/admin/blogs', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Blog created successfully!");
                router.push('/admin/blogs');
            } else {
                if (!blog?.id) return;
                data.append('_method', 'PUT');
                await api.post(`/admin/blogs/${blog.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Blog updated successfully!");
                router.push('/admin/blogs');
            }
        } catch (err: any) {
            console.error("Form submission failed:", err);
            alert(err.response?.data?.message || "Failed to save blog.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-white/5 p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.02] blur-[80px] rounded-full -mr-32 -mt-32"></div>

            <div className="space-y-6 relative z-10">
                {/* Main Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Blog Title</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value, meta_title: !blog ? e.target.value : formData.meta_title })}
                        />
                        {/* Note: I added manual sync directly in onChange for responsiveness if auto-effect is too slow or confusing */}
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Slug (Optional)</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="auto-generated-from-title"
                        />
                    </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Excerpt</label>
                    <textarea
                        rows={2}
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value, meta_description: !blog ? e.target.value : formData.meta_description })}
                    />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Content (HTML or Markdown)</label>
                    <textarea
                        rows={10}
                        required
                        className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20 font-mono text-sm"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                {/* Image Upload/Link */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Cover Image</label>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit mb-4">
                        <button
                            type="button"
                            onClick={() => setUploadType('local')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${uploadType === 'local' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Upload size={14} /> Upload
                        </button>
                        <button
                            type="button"
                            onClick={() => setUploadType('url')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${uploadType === 'url' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <LinkIcon size={14} /> Remote URL
                        </button>
                    </div>

                    {uploadType === 'local' ? (
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors bg-white/[0.02]">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="blog-image-upload"
                            />
                            <label htmlFor="blog-image-upload" className="cursor-pointer block">
                                {previewUrl ? (
                                    <div className="relative">
                                        <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-cover rounded-xl" />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedFile(null);
                                                setPreviewUrl(null);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-400">
                                        <Upload size={24} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Click to upload cover image</span>
                                    </div>
                                )}
                            </label>
                        </div>
                    ) : (
                        <input
                            type="url"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            placeholder="https://example.com/image.jpg"
                            value={typeof formData.image === 'string' ? formData.image : ''}
                            onChange={(e) => {
                                setFormData({ ...formData, image: e.target.value });
                                setPreviewUrl(e.target.value);
                            }}
                        />
                    )}
                    {uploadType === 'url' && previewUrl && (
                        <div className="mt-4">
                            <img src={previewUrl} alt="Preview" className="h-48 object-cover rounded-xl border border-white/10" />
                        </div>
                    )}
                </div>

                <div className="border-t border-white/10 pt-6"></div>
                <h3 className="text-xl font-bold text-white">SEO Settings</h3>

                {/* SEO */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Meta Title</label>
                        <input
                            type="text"
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.meta_title}
                            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Meta Description</label>
                        <textarea
                            rows={3}
                            className="w-full bg-slate-950/80 border border-white/10 rounded-2xl p-4 text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium placeholder:text-white/20"
                            value={formData.meta_description}
                            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                        />
                    </div>
                </div>

                {/* Publishing */}
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                    <input
                        type="checkbox"
                        id="is_published"
                        className="w-5 h-5 accent-primary rounded cursor-pointer"
                        checked={formData.is_published}
                        onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    />
                    <label htmlFor="is_published" className="text-sm font-bold text-white uppercase tracking-wider cursor-pointer">
                        Publish this blog post
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full orange-gradient text-white font-black py-5 rounded-2xl transition transform active:scale-95 shadow-orange text-[10px] uppercase tracking-[0.2em] disabled:opacity-50 relative z-10 flex items-center justify-center gap-2"
            >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Saving..." : (isCreate ? "Create Blog Post" : "Update Blog Post")}
            </button>
        </form>
    );
}
