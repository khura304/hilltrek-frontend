"use client";

import { Map, CalendarCheck, Camera, ArrowRight, Footprints } from "lucide-react";

const steps = [
    {
        icon: <Map className="w-8 h-8 text-primary" />,
        title: "Choose Destination",
        desc: "Browse our curated list of expeditions and tours across the Karakoram and Himalayas."
    },
    {
        icon: <CalendarCheck className="w-8 h-8 text-primary" />,
        title: "Book Your Slot",
        desc: "Secure your spot with our seamless online booking system. It takes less than 2 minutes."
    },
    {
        icon: <Footprints className="w-8 h-8 text-primary" />,
        title: "Travel & Explore",
        desc: "Meet your guide, pack your gear, and embark on the adventure of a lifetime."
    }
];

export default function Process() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                        How It <span className="text-gradient">Works</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Your journey to the top of the world is just three simple steps away.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent border-t border-dashed border-white/20 z-0"></div>

                    {steps.map((step, idx) => (
                        <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-[#1e293b] rounded-full border border-white/10 flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300 relative">
                                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {step.icon}
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm border-4 border-[#0F172A]">
                                    {idx + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
