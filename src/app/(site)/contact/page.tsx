"use client";

import { Mail, MapPin, Phone, Send, MessageSquare, Clock } from "lucide-react";
import ImmersiveHero from "@/components/layout/ImmersiveHero";

export default function ContactPage() {
    return (
        <main className="bg-background min-h-screen pb-24">
            <ImmersiveHero
                title="Let's Talk Adventure"
                subtitle="Whether you're planning a custom expedition or have a quick question. We are here to help you navigate your journey."
                image="/images/header-contact.png"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
                <div className="bg-secondary/90 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 flex flex-col lg:flex-row">
                    {/* Left: Info */}
                    <div className="lg:w-2/5 p-12 md:p-16 bg-[#0f172a] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Contact Info</h2>
                            <p className="text-gray-400 font-medium mb-12">
                                Visit our basecamps or transmit a digital signal. We are always listening.
                            </p>

                            <div className="space-y-8">
                                {[
                                    { icon: <Phone size={20} />, title: "Call Us", val: "+92 355 544 3322" },
                                    { icon: <Mail size={20} />, title: "Email Us", val: "info@hilltrek.com" },
                                    { icon: <MapPin size={20} />, title: "Visit Us", val: "Skardu, Gilgit-Baltistan" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-6 group">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-primary border border-white/5 group-hover:bg-white/10 group-hover:scale-110 transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{item.title}</p>
                                            <p className="text-white font-bold text-lg tracking-tight">{item.val}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-16 pt-12 border-t border-white/10">
                                <h3 className="text-white font-bold uppercase tracking-widest text-xs mb-6">Social Channels</h3>
                                <div className="flex gap-4">
                                    {["Fb", "Ig", "Tw", "Li"].map((social, i) => (
                                        <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:border-primary transition-all">
                                            {social}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="lg:w-3/5 p-12 md:p-16 bg-white/[0.02]">
                        <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase">Send a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">First Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">Last Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">Email Address</label>
                                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400 tracking-widest ml-4">Message</label>
                                <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all" placeholder="Tell us about your dream adventure..." />
                            </div>
                            <button className="w-full py-5 rounded-2xl orange-gradient font-black text-white uppercase tracking-[0.2em] shadow-orange hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                Send Message <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
