"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import api, { Destination } from "@/lib/api";
import ImmersiveHero from "@/components/layout/ImmersiveHero";
import { Loader2, MapPin, Calendar, ArrowRight } from "lucide-react";

export default function DestinationDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await api.get(`/destinations/${resolvedParams.id}`);
                setDestination(response.data);
            } catch (err) {
                console.error("Failed to fetch destination:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDestination();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary mb-4" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Locating Destination...</p>
            </main>
        );
    }

    if (!destination) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-background">
                <h1 className="text-4xl font-black text-white mb-4">Destination Not Found</h1>
                <Link href="/destinations" className="text-primary hover:text-primary-hover underline underline-offset-4">
                    Return to Destinations
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            <ImmersiveHero
                title={destination.name}
                subtitle={`${destination.city}, ${destination.country}`}
                image={destination.image_url}
                badge="Premium Destination"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-12 orange-gradient rounded-full"></div>
                                <h2 className="text-4xl font-black text-white tracking-tight uppercase">Overview</h2>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg font-light whitespace-pre-line">
                                {destination.description}
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-1.5 h-12 orange-gradient rounded-full"></div>
                                <h2 className="text-4xl font-black text-white tracking-tight uppercase">Available Tours</h2>
                            </div>

                            {destination.tours && destination.tours.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {destination.tours.map((tour) => (
                                        <Link
                                            href={`/tours/${tour.id}`}
                                            key={tour.id}
                                            className="group relative bg-secondary/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2"
                                        >
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={tour.image_url}
                                                    alt={tour.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                                                    <span className="text-white font-bold text-sm">${tour.price}</span>
                                                </div>
                                            </div>

                                            <div className="p-8 relative">
                                                <h4 className="font-black text-xl text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                    {tour.title}
                                                </h4>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <Calendar size={14} className="text-primary" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">{tour.duration_days} Days</span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all">
                                                        <ArrowRight size={14} className="text-gray-400 group-hover:text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-secondary/30 rounded-3xl p-12 text-center border border-dashed border-white/10">
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">No tours available yet.</p>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        <section className="bg-secondary border border-white/5 rounded-3xl p-8 sticky top-32">
                            <h3 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-4 uppercase tracking-wide">Quick Facts</h3>
                            <div className="space-y-6">
                                <div className="flex gap-5 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/20 transition-colors">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Best Time</p>
                                        <p className="text-white font-bold">{destination.best_time_to_visit || "All Year Round"}</p>
                                    </div>
                                </div>
                                <div className="flex gap-5 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:border-primary/20 transition-colors">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Region</p>
                                        <p className="text-white font-bold">{destination.city}, {destination.country}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
            </div>
        </main>
    );
}
