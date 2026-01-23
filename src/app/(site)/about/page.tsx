import { Metadata } from "next";
import { Mountain, Target, ShieldCheck, Users, Milestone, ArrowRight, Award, Heart } from "lucide-react";
import Link from "next/link";
import ImmersiveHero from "@/components/layout/ImmersiveHero";
import Team from "@/components/features/Team";

export const metadata: Metadata = {
    title: "About Us | Hilltrek & Tours",
    description: "Learn more about Hilltrek & Tours, our mission, and our passion for adventure in the mountains of Pakistan.",
};

export default function AboutPage() {
    return (
        <main className="bg-background min-h-screen pb-24">
            <ImmersiveHero
                title="Born In The Mountains"
                subtitle="We are a collective of explorers, climbers, and storytellers dedicated to sharing the raw beauty of Pakistan with the world."
                image="/images/header-about.png"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
                {/* Story Section */}
                <div className="bg-secondary/80 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] border border-white/10 shadow-2xl mb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-6">
                                <span className="w-8 h-[2px] bg-primary"></span>
                                The Hilltrek Story
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase leading-tight">
                                From Passion <br /> To <span className="text-gradient">Profession</span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed font-medium mb-6">
                                Hilltrek was founded not in a boardroom, but at a basecamp at 4,500 meters. What started as a group of friends sharing their love for the Karakoram has evolved into Pakistan's premier adventure travel company.
                            </p>
                            <p className="text-gray-400 leading-relaxed font-medium mb-10">
                                We believe that true adventure is not just about reaching the summit, but about the connections you make along the way—with nature, with local communities, and with yourself. Every itinerary we craft is a personal invitation to experience the mountains as we do: with respect, awe, and an unyielding spirit of exploration.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-3 text-white font-bold uppercase tracking-[0.2em] text-xs hover:text-primary transition-colors">
                                Meet The Team <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <img src="/images/climbing.jpg" className="rounded-[2rem] transform translate-y-12 shadow-2xl" alt="Climbing" />
                                <img src="/images/gallery-naran.jpg" className="rounded-[2rem] shadow-2xl" alt="Hiking" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Values Grid */}
                <div className="mb-24">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-black text-white mb-6 tracking-tighter uppercase">Our Core Values</h2>
                        <p className="text-gray-400">The principles that guide every step we take.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <ShieldCheck size={32} />, title: "Safety First", desc: "We adhere to international climbing and trekking safety standards without compromise." },
                            { icon: <Heart size={32} />, title: "Community First", desc: "We hire locally and invest in the villages we trek through, ensuring sustainable tourism." },
                            { icon: <Mountain size={32} />, title: "Authentic Adventure", desc: "No watered-down experiences. We take you to the real, raw heart of the mountains." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-[#1e293b] p-10 rounded-[2.5rem] border border-white/5 hover:border-primary/20 hover:-translate-y-2 transition-all duration-300 group">
                                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white mb-4 tracking-tight uppercase">{item.title}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Team Section */}
                    <Team />
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-br from-primary to-orange-600 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden shadow-orange/30 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('/images/cubes.png')] opacity-10 mix-blend-overlay"></div>
                    <div className="relative z-10">
                        <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter uppercase drop-shadow-lg">Start Your Journey</h3>
                        <Link href="/tours" className="inline-flex items-center gap-4 bg-white text-secondary px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition active:scale-95">
                            Browse Tours
                            <ArrowRight size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
