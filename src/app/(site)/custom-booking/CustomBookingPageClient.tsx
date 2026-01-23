"use client";

import ImmersiveHero from "@/components/layout/ImmersiveHero";
import CustomBookingForm from "@/components/features/CustomBookingForm";
import { Sparkles, CheckCircle2, Clock, HeadphonesIcon } from "lucide-react";

export default function CustomBookingPageClient() {
    return (
        <main className="bg-background min-h-screen pb-32">
            <ImmersiveHero
                title="Design Your Dream Adventure"
                subtitle="Our expert team will craft a personalized tour experience tailored exclusively to your desires, timeline, and budget."
                image="/images/hero-bg.jpg"
            />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative z-20">
                {/* Introduction */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20 mb-6">
                        <Sparkles size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                            100% Customizable
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter">
                        Tell Us What You <span className="text-gradient">Envision</span>
                    </h2>
                    <p className="text-gray-400 font-medium text-lg leading-relaxed">
                        Whether it's a family vacation, corporate retreat, or solo expedition—we'll build the perfect itinerary around you. Fill out the form below and our team will contact you within 24 hours.
                    </p>
                </div>

                {/* How It Works */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 group-hover:scale-110 transition-transform">
                            <Sparkles size={28} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">1. Share Your Vision</h3>
                        <p className="text-sm text-gray-400 font-medium">
                            Tell us your destination, dates, budget, and any special requirements
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 group-hover:scale-110 transition-transform">
                            <HeadphonesIcon size={28} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">2. We Connect</h3>
                        <p className="text-sm text-gray-400 font-medium">
                            Our experts review your request and contact you with questions and ideas
                        </p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-center hover:bg-white/10 transition-all group">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={28} className="text-primary" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">3. Finalize & Book</h3>
                        <p className="text-sm text-gray-400 font-medium">
                            Approve the custom itinerary and secure your personalized adventure
                        </p>
                    </div>
                </div>

                {/* Form */}
                <CustomBookingForm />

                {/* FAQ / Additional Info */}
                <div className="mt-16 bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 rounded-3xl">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-3">
                        <Clock size={24} className="text-primary" />
                        Quick Answers
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">How long does it take to get a quote?</h4>
                            <p className="text-sm text-gray-400 font-medium">
                                Our team typically responds within 24 hours with an initial proposal. Complex requests may take slightly longer.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">Is there a fee for custom tour planning?</h4>
                            <p className="text-sm text-gray-400 font-medium">
                                No, requesting a custom tour quote is completely free with no obligation.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">Can I modify a standard tour instead?</h4>
                            <p className="text-sm text-gray-400 font-medium">
                                Absolutely! If one of our existing tours is close to what you want, mention it in the special requirements and we'll customize it.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-white uppercase tracking-wide mb-2">What if I'm not sure about details yet?</h4>
                            <p className="text-sm text-gray-400 font-medium">
                                That's perfectly fine! Share what you know and leave the rest blank. We'll work with you to refine the details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
