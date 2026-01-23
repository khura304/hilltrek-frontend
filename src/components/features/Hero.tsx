"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, ShieldCheck, Search, MapPin, Calendar, Clock } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";

interface HeroProps {
    slug?: string;
}

export default function Hero({ slug = 'home' }: HeroProps) {
    const { page } = usePageContent(slug);
    const router = useRouter();
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState("2026-06-01");
    const [endDate, setEndDate] = useState("2026-07-01");

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.append('destination', destination);
        if (startDate) params.append('start_date', startDate);
        if (endDate) params.append('end_date', endDate);

        router.push(`/tours?${params.toString()}`);
    };

    if (!page) {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 bg-slate-900"></div>
                <div className="relative z-10 text-white">Loading...</div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Immersive Background */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0 scale-105 animate-slow-zoom"
                style={{ backgroundImage: `url('${page.hero_image || "/images/hero-bg.jpg"}')` }}
            >
                {/* Dual Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center mt-12 md:mt-0">

                {/* Badge */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-8 shadow-xl hover:bg-white/15 transition-colors cursor-default">
                        <Star className="w-4 h-4 text-primary fill-primary animate-pulse" />
                        <span className="text-white font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">
                            #1 Travel Agency in Pakistan
                        </span>
                    </div>
                </div>

                {/* Main Heading */}
                {/* Main Heading */}
                <h1 className="animate-fade-in-up text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.1] uppercase drop-shadow-2xl" style={{ animationDelay: '0.2s' }}>
                    {page.hero_title ? (
                        <span dangerouslySetInnerHTML={{ __html: page.hero_title.replace(/\n/g, '<br/>') }} />
                    ) : (
                        <>
                            Discover the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400">Untamed Beauty</span>
                        </>
                    )}
                </h1>

                {/* Subheading */}
                <p className="animate-fade-in-up text-lg md:text-xl text-gray-200 mb-10 max-w-3xl font-medium leading-relaxed drop-shadow-lg" style={{ animationDelay: '0.3s' }}>
                    {page.hero_subtitle || "Experience the majesty of Pakistan with Hilltrek. From the peaks of K2 to the valleys of Hunza, we curate journeys that redefine adventure."}
                </p>

                {/* Search Bar */}
                <div className="animate-fade-in-up w-full max-w-5xl" style={{ animationDelay: '0.45s' }}>
                    <div className="glass rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-2xl border border-white/10">
                        <h2 className="text-white text-lg md:text-2xl font-bold mb-6 text-left px-2">
                            Find what makes you happy <span className="text-primary">anytime, anywhere</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            {/* Location */}
                            <div className="text-left space-y-2 group">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1 group-hover:text-primary transition-colors">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input
                                        type="text"
                                        placeholder="Where are you going?"
                                        value={destination}
                                        onChange={(e) => setDestination(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Date */}
                            <div className="text-left space-y-2 group">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1 group-hover:text-primary transition-colors">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Check Out */}
                            <div className="text-left space-y-2 group">
                                <label className="text-gray-400 text-xs font-bold uppercase tracking-wider ml-1 group-hover:text-primary transition-colors">Check out</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="h-full">
                                <button
                                    onClick={handleSearch}
                                    className="w-full h-[54px] orange-gradient hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    <Search className="w-5 h-5" />
                                    <span>Search Now</span>
                                </button>
                            </div>
                        </div>

                        {/* Date Range Hint */}
                        <div className="mt-4 flex items-center gap-2 text-gray-500 text-[10px] md:text-xs font-medium ml-1">
                            <Clock className="w-3 h-3" />
                            <span>06/01/2026 12:00 am - 07/01/2026 11:59 pm</span>
                        </div>
                    </div>
                </div>


                {/* Trust Badges */}
                <div className="animate-fade-in-up mt-12 flex flex-wrap justify-center gap-6 opacity-80" style={{ animationDelay: '0.6s' }}>
                    {['Licensed Operators', '24/7 Support', 'Secure Booking', 'Best Price Guarantee'].map((text, i) => (
                        <div key={i} className="flex items-center gap-2 text-white/80 text-xs font-bold uppercase tracking-wider">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                <div className="w-8 h-12 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
                    <div className="w-1 h-3 bg-primary rounded-full animate-scroll"></div>
                </div>
            </div>
        </section>
    );
}


