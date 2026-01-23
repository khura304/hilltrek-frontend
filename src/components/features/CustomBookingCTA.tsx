"use client";

import Link from "next/link";
import { Calendar, Users, MapPin, ArrowRight, Sparkles } from "lucide-react";

export default function CustomBookingCTA() {
    return (
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-orange-600/5 pointer-events-none"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-[3rem] border border-white/10 p-12 md:p-16 lg:p-20 shadow-2xl overflow-hidden relative">
                    {/* Decorative corner accents */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-bl-full"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/10 rounded-tr-full"></div>

                    <div className="relative z-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-8">
                            <Sparkles size={14} className="text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                                Personalized Adventures
                            </span>
                        </div>

                        {/* Content Grid */}
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Column - Text Content */}
                            <div>
                                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-none mb-6">
                                    Can't Find Your <span className="text-gradient italic">Dream Tour?</span>
                                </h2>
                                <p className="text-lg text-gray-300 font-medium mb-8 leading-relaxed">
                                    Let us craft a completely customized adventure tailored to your preferences, budget, and schedule. From intimate family getaways to grand expeditions—we make it happen.
                                </p>

                                {/* Features List */}
                                <div className="grid sm:grid-cols-2 gap-4 mb-10">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <Calendar size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Flexible Dates</p>
                                            <p className="text-xs text-gray-400 font-medium">Choose your timeline</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <MapPin size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Any Destination</p>
                                            <p className="text-xs text-gray-400 font-medium">Go anywhere you desire</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <Users size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Group Size</p>
                                            <p className="text-xs text-gray-400 font-medium">Solo to large groups</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
                                            <Sparkles size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white uppercase tracking-tight">Custom Itinerary</p>
                                            <p className="text-xs text-gray-400 font-medium">Built around you</p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link
                                    href="/custom-booking"
                                    className="inline-flex items-center gap-3 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-primary/40 group"
                                >
                                    Request Custom Tour
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                </Link>
                            </div>

                            {/* Right Column - Visual Element */}
                            <div className="relative hidden lg:block">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-orange-600/20 border border-white/10 p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center mb-6 animate-pulse">
                                        <Sparkles size={40} className="text-white" strokeWidth={2.5} />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-3">
                                        Your Adventure,<br />Your Way
                                    </h3>
                                    <p className="text-sm text-gray-400 font-medium max-w-xs">
                                        Fill out a simple form and our expert team will contact you within 24 hours with a personalized proposal
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
