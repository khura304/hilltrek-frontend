"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Compass, ArrowRight, Loader2, Users, Star, Sun, Snowflake, CloudRain, Calendar } from "lucide-react";
import api, { Destination } from "@/lib/api";
import ImmersiveHero from "@/components/layout/ImmersiveHero";

import { usePageContent } from "@/hooks/usePageContent";

export default function DestinationListingClient() {
    const { page } = usePageContent('destinations');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const response = await api.get('/destinations');
                setDestinations(response.data);
            } catch (err) {
                console.error("Failed to fetch destinations:", err);
                setError("Failed to load destinations.");
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, []);

    return (
        <main className="bg-background min-h-screen pb-32">
            <ImmersiveHero
                title={page?.hero_title || "Wander The Unknown"}
                subtitle={page?.hero_subtitle || "From the frozen peaks of the Karakoram to the lush valleys of Swat. Your journey into the extraordinary begins here."}
                image={page?.hero_image || "/images/header-destinations.png"}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
                {/* Intro Section */}
                <div className="bg-secondary/80 backdrop-blur-xl p-8 md:p-16 rounded-[3rem] border border-white/10 shadow-2xl mb-24 text-center max-w-5xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase">
                        Why Explore <span className="text-gradient">With Us?</span>
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium mb-12">
                        We don't just take you to places; we immerse you in them. Our destinations are hand-picked for their
                        raw beauty, cultural richness, and potential for adventure. Whether you are a seasoned mountaineer
                        or a leisure traveler, we have a horizon waiting for you.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { title: "Expert Guides", desc: "Natives of the mountains who know every hidden path." },
                            { title: "Premium Logistics", desc: "Top-tier equipment and comfortable basecamps." },
                            { title: "Sustainable Travel", desc: "Leaving no trace, preserving nature for generations." }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                                <h3 className="text-primary font-bold uppercase tracking-widest text-xs mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seasons Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {[
                        { icon: <Sun className="text-orange-400" />, title: "Summer (May-Aug)", desc: "Perfect for high-altitude trekking and K2 expeditions." },
                        { icon: <CloudRain className="text-blue-400" />, title: "Autumn (Sep-Oct)", desc: "Magical colors in Hunza & Skardu. Clear skies and crisp air." },
                        { icon: <Snowflake className="text-cyan-400" />, title: "Winter (Nov-Feb)", desc: "For extreme adventure lovers. Snow leopards and frozen waterfalls." }
                    ].map((season, i) => (
                        <div key={i} className="bg-[#0f172a]/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 flex items-start gap-6 hover:translate-y-[-5px] transition-transform duration-300">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                {season.icon}
                            </div>
                            <div>
                                <h4 className="text-white font-bold uppercase tracking-wider mb-2">{season.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{season.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={3} />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Loading Destinations...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest, idx) => (
                            <Link key={dest.id} href={`/destinations/${dest.id}`} className={`group relative rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-orange/20 transition-all duration-700 ${idx % 3 === 1 ? 'lg:translate-y-12' : ''}`}>
                                <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                                    <img
                                        src={dest.image_url || "/images/gallery-naran.jpg"}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                        alt={dest.name}
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-500"></div>

                                    {/* Hover Reveal Content */}
                                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-90 transition-opacity duration-500 mix-blend-multiply"></div>

                                    <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="h-[2px] w-8 bg-primary"></div>
                                            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                                Pakistan
                                            </span>
                                        </div>
                                        <h3 className="text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">{dest.name}</h3>
                                        <p className="text-gray-300 text-sm font-medium line-clamp-2 mb-8 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                            {dest.description || "Experience the breathtaking landscapes and rich culture of this region."}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-white/20 pt-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                            <span className="text-white font-bold text-xs uppercase tracking-widest">{dest.tours_count || 0} Tours</span>
                                            <div className="bg-white text-secondary p-3 rounded-full transform group-hover:rotate-45 transition-transform duration-500">
                                                <ArrowRight size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}

