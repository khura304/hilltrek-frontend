"use client";

import { useState, useEffect } from "react";
import { X, MapPin, Loader2 } from "lucide-react";
import ImmersiveHero from "@/components/layout/ImmersiveHero";
import api from "@/lib/api";

interface GalleryItem {
    id: number;
    image_url: string;
    title: string;
    description: string;
    location: string; // Backward compatibility if needed, but we'll use title as location
}

export default function GalleryClient() {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/gallery');
                setItems(response.data);
            } catch (error) {
                console.error("Failed to fetch gallery:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    return (
        <main className="bg-[#0f172a] min-h-screen pb-32">
            <ImmersiveHero
                title="Our Gallery"
                subtitle="A visual journey through the spectacular landscapes and unforgettable moments."
                image="/images/header-gallery.png"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-lg border border-white/5 bg-slate-800"
                                onClick={() => setSelectedItem(item)}
                            >
                                <div className="aspect-square overflow-hidden">
                                    <img
                                        src={item.image_url}
                                        alt={item.title || "Gallery Image"}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                    {item.title && (
                                        <p className="text-white font-bold text-sm flex items-center gap-1">
                                            <MapPin size={14} className="text-primary" />
                                            {item.title}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="relative bg-slate-900 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-red-500/80 transition-colors border border-white/20"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-2/3 max-h-[70vh] md:max-h-[80vh] overflow-hidden bg-black flex items-center justify-center">
                                <img
                                    src={selectedItem.image_url}
                                    alt={selectedItem.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <div className="md:w-1/3 p-8 flex flex-col justify-center bg-slate-900 border-l border-white/5">
                                {selectedItem.title && (
                                    <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">
                                        {selectedItem.title}
                                    </h3>
                                )}

                                <div className="h-1 w-20 bg-primary mb-6"></div>

                                {selectedItem.description && (
                                    <p className="text-gray-300 text-base leading-relaxed">
                                        {selectedItem.description}
                                    </p>
                                )}

                                <div className="mt-8 pt-6 border-t border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                                        Hilltrek & Tours Gallery
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
