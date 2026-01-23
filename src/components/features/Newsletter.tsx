"use client";

import { Send, Mail } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement newsletter subscription logic
        console.log("Subscribing email:", email);
        setEmail("");
        alert("Thanks for subscribing!");
    };

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5"></div>
            {/* Background Graphic */}
            <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #f97316 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="bg-[#1e293b] border border-white/10 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
                    {/* Glow effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-4 group hover:bg-white/10 transition-colors">
                            <Mail className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                            Join Our <span className="text-primary">Adventure</span> Club
                        </h2>
                        <p className="text-gray-400 text-lg max-w-lg mx-auto">
                            Get exclusive travel offers, hidden gems, and expert tips delivered straight to your inbox.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-grow bg-white/5 border border-white/10 text-white placeholder-gray-500 rounded-xl px-6 py-4 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-lg active:scale-95"
                            >
                                <span>Subscribe</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
