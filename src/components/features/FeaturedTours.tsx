"use client";

import { useEffect, useState } from "react";
import { MoveRight, Star, Clock, MapPin, Loader2, Compass, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getFeaturedTours, Tour } from "@/lib/api";
import Alert from "@/components/ui/Alert";

export default function FeaturedTours() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const data = await getFeaturedTours();
                setTours(data);
            } catch (err) {
                console.error("Failed to fetch featured tours:", err);
                setError("Could not load featured tours.");
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-background flex flex-col items-center">
                <Loader2 className="animate-spin text-primary mb-4" size={40} strokeWidth={3} />
                <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Scanning for Peaks...</p>
            </section>
        );
    }

    return (
        <section id="featured-tours" className="py-24 bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {error && (
                    <div className="mb-8">
                        <Alert type="error" message={error} />
                    </div>
                )}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-4">
                            <Compass size={14} className="text-primary" />
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">Best Selling Trips</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none uppercase">
                            Featured <span className="text-primary">Tour Packages</span>
                        </h2>
                    </div>
                    <Link href="/tours" className="group flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-full font-bold text-sm uppercase tracking-wider text-white hover:bg-white/10 transition-all animate-fade-in-up delay-100">
                        <span>View All Tours</span>
                        <MoveRight className="text-primary group-hover:translate-x-1 transition-transform" size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map((tour, idx) => (
                        <Link key={tour.id} href={`/tours/${tour.id}`} className={`group relative rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-orange/20 transition-all duration-700 hover:-translate-y-2`}>
                            <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                                <img
                                    src={tour.image_url || "/images/dest-placeholder.jpg"}
                                    alt={tour.title}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-500"></div>

                                {/* Hover Reveal Content */}
                                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-90 transition-opacity duration-500 mix-blend-multiply"></div>

                                {/* Floating Badges */}
                                <div className="absolute top-6 left-6 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 inline-flex items-center gap-2">
                                        <MapPin size={10} className="text-white" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{tour.destination?.name || "Pakistan"}</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-[2px] w-8 bg-primary"></div>
                                        <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                            {tour.duration_days} Days Adventure
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase leading-none">{tour.title}</h3>

                                    <div className="flex flex-wrap gap-4 mb-8 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Clock size={14} className="text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{tour.duration_days} Days</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Users size={14} className="text-primary" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Max {tour.max_travelers || 12}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/80">
                                            <Star size={14} className="text-primary fill-primary" />
                                            <span className="text-xs font-bold uppercase tracking-wider">{Number(tour.reviews_avg_rating || 0).toFixed(1)} ({tour.reviews_count || 0})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="w-full pt-4 border-t border-white/20 flex items-center justify-between">
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-white/60 font-bold">Starting From</p>
                                                <p className="text-xl font-black text-white tracking-tighter">${tour.price}</p>
                                            </div>
                                            <div className="bg-white text-secondary p-3 rounded-full transform group-hover:rotate-45 transition-transform duration-500">
                                                <ArrowRight size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {tours.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No tours available at the moment.</p>
                    </div>
                )}
            </div>
        </section >
    );
}



