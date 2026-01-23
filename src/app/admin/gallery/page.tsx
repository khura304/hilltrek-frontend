"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Link as LinkIcon,
    Upload,
    X,
    Loader2,
    Edit2,
} from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";

interface GalleryItem {
    id: number;
    title: string | null;
    description: string | null;
    type: 'local' | 'url';
    path: string;
    image_url: string;
    is_active: boolean;
}

export default function AdminGalleryPage() {
    const { showToast, confirm } = useNotification();
    const [images, setImages] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
    const [uploadType, setUploadType] = useState<'local' | 'url'>('local');

    // Form States
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await api.get('/admin/gallery');
            setImages(response.data);
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        confirm(
            "Delete Image?",
            "Are you sure you want to delete this image from the gallery?",
            async () => {
                try {
                    await api.delete(`/admin/gallery/${id}`);
                    setImages(images.filter(img => img.id !== id));
                    showToast("success", "Image deleted successfully");
                } catch (error) {
                    console.error("Failed to delete image:", error);
                    showToast("error", "Failed to delete image.");
                }
            }
        );
    };

    const handleEdit = (item: GalleryItem) => {
        setEditingItem(item);
        setTitle(item.title || "");
        setDescription(item.description || "");
        setUploadType(item.type);
        if (item.type === 'url') {
            setUrl(item.path);
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        try {
            if (editingItem) {
                const response = await api.put(`/admin/gallery/${editingItem.id}`, {
                    title,
                    description,
                    is_active: editingItem.is_active
                });

                setImages(images.map(img => img.id === editingItem.id ? { ...response.data, image_url: img.image_url } : img));
            } else {
                if (uploadType === 'local') {
                    if (!selectedFile) {
                        showToast("warning", "Please select an image");
                        setSubmitting(false);
                        return;
                    }
                    formData.append('image', selectedFile);
                } else {
                    if (!url) {
                        showToast("warning", "Please enter an image URL");
                        setSubmitting(false);
                        return;
                    }
                    formData.append('url', url);
                }

                const response = await api.post('/admin/gallery', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setImages([response.data, ...images]);
            }

            setShowModal(false);
            resetForm();
            showToast("success", editingItem ? "Image updated successfully" : "Image added successfully");
        } catch (error) {
            console.error("Failed to save image:", error);
            showToast("error", "Failed to save image. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setUrl("");
        setSelectedFile(null);
        setUploadType('local');
        setEditingItem(null);
    };

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <ImageIcon size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Media Assets</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        Gallery <span className="text-primary italic">Manager</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Curate your visual storytelling
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="orange-gradient text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-orange flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition"
                >
                    <Plus size={16} strokeWidth={3} />
                    <span>Add Media</span>
                </button>
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Array(8).fill(0).map((_, i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : images.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
                    <ImageIcon size={48} className="mx-auto text-white/20 mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No images in gallery</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                            <img
                                src={img.image_url}
                                alt={img.title || "Gallery Image"}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                                {img.title && (
                                    <p className="text-white font-bold text-sm mb-2">{img.title}</p>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 bg-white/10 px-2 py-1 rounded">
                                        {img.type}
                                    </span>
                                    <button
                                        onClick={() => handleEdit(img)}
                                        className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(img.id)}
                                        className="ml-auto p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-8">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-6">Add New Image</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Image Source</label>
                                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setUploadType('local')}
                                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${uploadType === 'local' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <Upload size={14} /> Local Upload
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setUploadType('url')}
                                            className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${uploadType === 'url' ? 'bg-primary text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                                }`}
                                        >
                                            <LinkIcon size={14} /> Remote URL
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Title (Location)</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder-white/20"
                                        placeholder="e.g. Paris, France"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder-white/20 h-24 resize-none"
                                        placeholder="Describe the moment..."
                                    />
                                </div>

                                {!editingItem && (
                                    uploadType === 'local' ? (
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Select File</label>
                                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-primary/50 transition-colors bg-white/[0.02]">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                    className="hidden"
                                                    id="file-upload"
                                                />
                                                <label htmlFor="file-upload" className="cursor-pointer block">
                                                    {selectedFile ? (
                                                        <div className="text-primary font-bold">{selectedFile.name}</div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                                            <Upload size={24} />
                                                            <span className="text-xs font-bold uppercase tracking-wider">Click to browse</span>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">Image URL</label>
                                            <input
                                                type="url"
                                                value={url}
                                                onChange={(e) => setUrl(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors placeholder-white/20"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    )
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full orange-gradient text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-orange hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    {submitting ? <Loader2 size={16} className="animate-spin" /> : (editingItem ? <Edit2 size={16} /> : <Plus size={16} strokeWidth={3} />)}
                                    {submitting ? 'Saving...' : (editingItem ? 'Save Changes' : 'Add to Gallery')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
