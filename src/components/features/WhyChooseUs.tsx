"use client";

import { Shield, Banknote, Map, CheckCircle2, Award, Zap } from "lucide-react";

const features = [
    {
        icon: <Shield className="w-6 h-6 text-primary" strokeWidth={2.5} />,
        title: "Safe & Secure Travel",
        description: "We prioritize your safety with experienced local guides and reliable transport for peace of mind."
    },
    {
        icon: <Banknote className="w-6 h-6 text-primary" strokeWidth={2.5} />,
        title: "Best Price Guarantee",
        description: "Competitive rates for premium experiences. No hidden charges, just transparent pricing."
    },
    {
        icon: <Map className="w-6 h-6 text-primary" strokeWidth={2.5} />,
        title: "Customized Itineraries",
        description: "Tailor-made tour packages to suit your budget and travel preferences perfectly."
    },
    {
        icon: <Award className="w-6 h-6 text-primary" strokeWidth={2.5} />,
        title: "Award Winning Service",
        description: "Recognized for excellence in hospitality and tour management across Pakistan."
    },
    {
        icon: <Zap className="w-6 h-6 text-primary" strokeWidth={2.5} />,
        title: "Instant Booking",
        description: "Seamless online booking process with immediate confirmation and digital tickets."
    }
];

export default function WhyChooseUs() {
    return (
        <section className="py-24 relative bg-secondary/30 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Side Content */}
                    <div className="space-y-8 animate-fade-in-left">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                            <CheckCircle2 size={14} className="text-primary" />
                            <span className="text-primary font-bold uppercase text-xs tracking-widest">Why Travel With Us?</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight uppercase">
                            Experience Pakistan <br /> Like Never <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Before</span>
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                            We don't just organize tours; we craft memories. Our team of experts ensures every detail is perfect, allowing you to immerse yourself fully in the journey.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            {features.slice(0, 4).map((feature, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <div className="flex-shrink-0 w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-white mb-1 uppercase tracking-wide group-hover:text-primary transition-colors">{feature.title}</h4>
                                        <p className="text-gray-500 font-medium leading-snug text-xs">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Visual */}
                    <div className="relative animate-fade-in-right">
                        <div className="absolute inset-0 orange-gradient blur-[60px] opacity-20 rounded-full"></div>

                        <div className="relative z-10 grid grid-cols-2 gap-4">
                            <div className="space-y-4 translate-y-8">
                                <div className="w-full h-64 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                                    <img
                                        src="/images/trekking.jpg"
                                        alt="Mountain Trekking"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                                    <img
                                        src="/images/culture.jpg"
                                        alt="Cultural Experience"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="w-full h-48 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                                    <img
                                        src="/images/camping.jpg"
                                        alt="Camping in Hunza"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <div className="w-full h-64 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                                    <img
                                        src="/images/jeep-safari.jpg"
                                        alt="Jeep Safari"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            {/* Central Emblem */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#1e293b] rounded-full border-4 border-white/10 shadow-2xl flex items-center justify-center z-20">
                                <div className="text-center">
                                    <span className="block text-2xl font-black text-white leading-none">5k+</span>
                                    <span className="block text-[8px] font-bold text-primary uppercase">Happy Clients</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
