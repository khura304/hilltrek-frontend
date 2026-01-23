"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoveUpRight, Loader2, Map } from "lucide-react";
import { getPopularDestinations, Destination } from "@/lib/api";

export default function PopularDestinations() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await getPopularDestinations();
                setDestinations(data);
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-background flex flex-col items-center">
                <Loader2 className="animate-spin text-primary mb-4" size={40} strokeWidth={3} />
                <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Triangulating Coordinates...</p>
            </section>
        );
    }

    return (
        <section id="destinations" className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                        <Map size={14} className="text-primary" />
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Explore Pakistan</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
                        Popular <span className="text-primary">Destinations</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations.map((dest, idx) => (
                        <Link
                            key={dest.id}
                            href={`/destinations/${dest.id}`}
                            className={`group relative rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 h-[28rem] shadow-lg animate-fade-in-up`}
                            style={{ animationDelay: `${idx * 0.1}s` }}
                        >
                            <img
                                src={dest.image_url || "/images/dest-placeholder.jpg"}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt={dest.name}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                        <p className="text-gray-300 font-bold uppercase tracking-wider text-[10px]">{dest.tours_count || 0} Tours Available</p>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white leading-tight uppercase mb-4">{dest.name}</h3>

                                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                                        <span>View Details</span>
                                        <MoveUpRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {destinations.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No destinations found.</p>
                    </div>
                )}
            </div>

            {/* Background elements */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-primary opacity-5 blur-[100px] pointer-events-none"></div>
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-64 bg-primary opacity-5 blur-[100px] pointer-events-none"></div>
        </section>
    );
}



