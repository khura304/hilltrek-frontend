"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Star, Quote } from "lucide-react";


interface Testimonial {
    id: number;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string | null;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await api.get('/testimonials');
                setTestimonials(response.data);
            } catch (err) {
                console.error("Failed to fetch testimonials:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    if (loading) return null;
    if (testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-4">
                        <Quote size={14} className="text-primary" />
                        <span className="text-primary font-bold tracking-widest uppercase text-xs">Testimonials</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none uppercase">
                        What Our <span className="text-primary">Travelers Say</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-[#1e293b] p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative group">
                            <div className="absolute top-8 right-8 text-white/5 group-hover:text-primary/10 transition-colors">
                                <Quote size={64} />
                            </div>

                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={`fill-current ${i < testimonial.rating ? "text-primary" : "text-gray-600"}`} />
                                ))}
                            </div>

                            <p className="text-gray-300 mb-8 leading-relaxed font-medium relative z-10">"{testimonial.content}"</p>

                            <div className="flex items-center gap-4">
                                {testimonial.image ? (
                                    <img
                                        src={testimonial.image}
                                        alt=""
                                        className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-primary/20 flex items-center justify-center text-primary font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-white font-bold text-sm uppercase tracking-wide">{testimonial.name}</h4>
                                    <p className="text-primary text-xs font-bold uppercase tracking-wider">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none"></div>
        </section>
    );
}
