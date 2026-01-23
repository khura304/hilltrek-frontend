"use client";

import { useEffect, useState, useRef } from "react";
import { Users, MapPin, Award, Calendar } from "lucide-react";

const stats = [
    { label: "Happy Travelers", value: 5000, suffix: "+", icon: <Users /> },
    { label: "Destinations", value: 40, suffix: "+", icon: <MapPin /> },
    { label: "Tours Completed", value: 1200, suffix: "+", icon: <Calendar /> },
    { label: "Awards Won", value: 15, suffix: "", icon: <Award /> },
];

export default function Stats() {
    return (
        <section className="py-20 bg-secondary relative border-y border-white/5">
            <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] opacity-5"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="flex flex-col items-center justify-center text-center p-6 hover:bg-white/5 rounded-3xl transition-colors duration-300">
                            <div className="text-primary mb-4 opacity-80 scale-125">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                                {stat.value}{stat.suffix}
                            </h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
