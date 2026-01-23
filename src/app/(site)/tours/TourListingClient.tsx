"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Clock, Star, MoveRight, Loader2, Compass, Users, ArrowRight, X, ChevronDown, Check } from "lucide-react";
import api, { Tour } from "@/lib/api";
import ImmersiveHero from "@/components/layout/ImmersiveHero";
import CustomBookingCTA from "@/components/features/CustomBookingCTA";

import { usePageContent } from "@/hooks/usePageContent";

function TourListingContent() {
    const { page } = usePageContent('tours');
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const router = useRouter();

    // Filter & Sort State
    const [showFilters, setShowFilters] = useState(false);
    const [showSort, setShowSort] = useState(false);

    // Filter Values
    const [budget, setBudget] = useState(searchParams.get('budget') || '');
    const [minDuration, setMinDuration] = useState(searchParams.get('min_duration') || '');
    const [maxDuration, setMaxDuration] = useState(searchParams.get('max_duration') || '');

    // Sort Values
    const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'created_at');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') || 'desc');

    const filterRef = useRef<HTMLDivElement>(null);
    const sortRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setShowFilters(false);
            }
            if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
                setShowSort(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                const dest = searchParams.get('destination');

                // Allow both 'date' and 'start_date' for start of the range
                const startDate = searchParams.get('date') || searchParams.get('start_date');
                const endDate = searchParams.get('end_date');
                const budget = searchParams.get('budget');

                const budgetParam = searchParams.get('budget');
                const minDur = searchParams.get('min_duration');
                const maxDur = searchParams.get('max_duration');
                const sortB = searchParams.get('sort_by');
                const sortO = searchParams.get('sort_order');

                if (dest) params.append('destination', dest);
                if (startDate) params.append('start_date', startDate);
                if (endDate) params.append('end_date', endDate);
                if (budgetParam) params.append('budget', budgetParam);
                if (minDur) params.append('min_duration', minDur);
                if (maxDur) params.append('max_duration', maxDur);
                if (sortB) params.append('sort_by', sortB);
                if (sortO) params.append('sort_order', sortO);

                const response = await api.get(`/tours?${params.toString()}`);
                setTours(response.data);
            } catch (err) {
                console.error("Failed to fetch tours:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (budget) params.set('budget', budget); else params.delete('budget');
        if (minDuration) params.set('min_duration', minDuration); else params.delete('min_duration');
        if (maxDuration) params.set('max_duration', maxDuration); else params.delete('max_duration');

        router.push(`/tours?${params.toString()}`);
        setShowFilters(false);
    };

    const handleSort = (field: string, order: string) => {
        setSortBy(field);
        setSortOrder(order);
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort_by', field);
        params.set('sort_order', order);
        router.push(`/tours?${params.toString()}`);
        setShowSort(false);
    };

    const clearFilters = () => {
        setBudget('');
        setMinDuration('');
        setMaxDuration('');
        const params = new URLSearchParams(searchParams.toString());
        params.delete('budget');
        params.delete('min_duration');
        params.delete('max_duration');
        router.push(`/tours?${params.toString()}`);
        setShowFilters(false);
    };

    return (
        <main className="bg-background min-h-screen pb-32">
            <ImmersiveHero
                title={page?.hero_title || "Curated Adventures"}
                subtitle={page?.hero_subtitle || "Select from our exclusive roster of premium expeditions. From light trekking to technical summits, find your path."}
                image={page?.hero_image || "/images/hero-bg.jpg"}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
                {/* Intro */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter">Find Your <span className="text-gradient">Perfect Path</span></h2>
                    <p className="text-gray-400 font-medium">
                        Whether you seek the adrenaline of a K2 expedition or the serenity of a Hunza cultural tour, our curated packages are designed to deliver the ultimate mountain experience.
                    </p>
                </div>

                {/* Filter / Info Bar */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] mb-16 flex flex-wrap items-center justify-between gap-6 shadow-2xl relative z-30">
                    <p className="text-gray-400 font-medium pl-4 border-l-2 border-primary">
                        Showing <span className="text-white font-bold">{tours.length}</span> active adventures
                    </p>

                    <div className="flex gap-4 relative">
                        {/* Filter Button & Dropdown */}
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-6 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-2 ${showFilters || budget || minDuration || maxDuration ? 'bg-primary border-primary' : 'bg-secondary border-white/5 hover:bg-white/10'}`}
                            >
                                Filter
                                {(budget || minDuration || maxDuration) && <span className="ml-1 w-2 h-2 rounded-full bg-white"></span>}
                            </button>

                            {showFilters && (
                                <div className="absolute top-full right-0 mt-2 w-72 bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl z-50 animate-fade-in-up">
                                    <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-b border-white/10 pb-2">Filter Tours</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-gray-400 text-[10px] uppercase font-bold mb-1 block">Max Budget ($)</label>
                                            <input
                                                type="number"
                                                value={budget}
                                                onChange={(e) => setBudget(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
                                                placeholder="e.g. 1000"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-gray-400 text-[10px] uppercase font-bold mb-1 block">Min Days</label>
                                                <input
                                                    type="number"
                                                    value={minDuration}
                                                    onChange={(e) => setMinDuration(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-gray-400 text-[10px] uppercase font-bold mb-1 block">Max Days</label>
                                                <input
                                                    type="number"
                                                    value={maxDuration}
                                                    onChange={(e) => setMaxDuration(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 flex gap-2">
                                            <button onClick={clearFilters} className="flex-1 py-2 text-gray-400 hover:text-white text-xs font-bold uppercase">Clear</button>
                                            <button onClick={applyFilters} className="flex-1 py-2 bg-primary rounded-lg text-white text-xs font-bold uppercase hover:bg-primary/90">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sort Button & Dropdown */}
                        <div className="relative" ref={sortRef}>
                            <button
                                onClick={() => setShowSort(!showSort)}
                                className={`px-6 py-3 rounded-xl text-white text-xs font-bold uppercase tracking-widest border transition-colors flex items-center gap-2 ${showSort ? 'bg-white/20 border-white/20' : 'bg-secondary border-white/5 hover:bg-white/10'}`}
                            >
                                Sort By
                                <ChevronDown size={14} />
                            </button>

                            {showSort && (
                                <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-fade-in-up">
                                    <div className="py-2">
                                        {[
                                            { label: 'Newest First', field: 'created_at', order: 'desc' },
                                            { label: 'Price: Low to High', field: 'price', order: 'asc' },
                                            { label: 'Price: High to Low', field: 'price', order: 'desc' },
                                            { label: 'Duration: Shortest', field: 'duration_days', order: 'asc' },
                                            { label: 'Duration: Longest', field: 'duration_days', order: 'desc' },
                                        ].map((opt) => (
                                            <button
                                                key={`${opt.field}-${opt.order}`}
                                                onClick={() => handleSort(opt.field, opt.order)}
                                                className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 hover:bg-white/5 hover:text-white flex items-center justify-between group"
                                            >
                                                {opt.label}
                                                {sortBy === opt.field && sortOrder === opt.order && <Check size={14} className="text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={3} />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Loading Tours...</p>
                    </div>
                ) : tours.length === 0 ? (
                    <div className="text-center py-32 bg-secondary/30 rounded-[3rem] border border-white/5">
                        <Search size={48} className="text-gray-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 uppercase">No Tours Found</h3>
                        <p className="text-gray-500 mb-8">Try adjusting your filters.</p>
                        <Link href="/tours" className="text-primary font-bold uppercase tracking-widest text-xs hover:underline">Reset Filters</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((tour, idx) => (
                            <Link key={tour.id} href={`/tours/${tour.id}`} className={`group relative rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-orange/20 transition-all duration-700 ${idx % 3 === 1 ? 'lg:translate-y-12' : ''}`}>
                                <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                                    <img
                                        src={tour.image_url || "/images/gallery-naran.jpg"}
                                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                        alt={tour.title}
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
                )}
            </div>

            {/* Custom Booking CTA */}
            <CustomBookingCTA />

        </main>
    );
}

export default function TourListingClient() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center font-bold text-gray-700 uppercase tracking-[0.5em] text-xs">Loading Tours...</div>}>
            <TourListingContent />
        </Suspense>
    );
}


