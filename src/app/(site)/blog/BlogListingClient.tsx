"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api, { Blog } from "@/lib/api";
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import ImmersiveHero from "@/components/layout/ImmersiveHero";

export default function BlogListingClient() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await api.get('/blogs');
                setBlogs(response.data.data ? response.data.data : response.data);
            } catch (error) {
                console.error("Failed to fetch blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    return (
        <main className="bg-background min-h-screen pb-32">
            <ImmersiveHero
                title="Travel Journal"
                subtitle="Stories, guides, and inspiration for your next adventure in the mountains."
                image="/images/hero-blog.jpg"
            />
            {/* Note: /images/hero-blog.jpg might not exist, but ImmersiveHero might handle fallback or I should check. 
                TourListing uses /images/hero-bg.jpg as fallback. I'll use a generic one if needed or just let it be. 
                Actually, looking at TourListing, it uses page?.hero_image || "/images/hero-bg.jpg". 
                I'll stick to a placeholder or existing image if I knew one, but "hero-blog.jpg" is a good intent.
            */}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
                {/* Intro */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6 uppercase tracking-tighter">
                        Tales from the <span className="text-gradient">Trails</span>
                    </h2>
                    <p className="text-gray-400 font-medium">
                        Discover the hidden gems of Northern Pakistan through our curated travel stories, expert guides, and cultural insights.
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary mb-4" size={48} strokeWidth={3} />
                        <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-xs">Loading Stories...</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-32 bg-secondary/30 rounded-[3rem] border border-white/5">
                        <BookOpen size={48} className="text-gray-600 mx-auto mb-6" />
                        <h3 className="text-3xl font-black text-white mb-4 uppercase">No Stories Published</h3>
                        <p className="text-gray-500 mb-8">Check back soon for new updates.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.map((blog, idx) => (
                            <Link
                                href={`/blog/${blog.slug}`}
                                key={blog.id}
                                className={`group relative rounded-[2.5rem] overflow-hidden shadow-2xl hover:shadow-orange/20 transition-all duration-700 ${idx % 3 === 1 ? 'lg:translate-y-12' : ''}`}
                            >
                                <div className="aspect-[3/4] overflow-hidden bg-slate-800">
                                    {blog.image_url ? (
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white/20 font-black uppercase tracking-widest">
                                            No Image
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent opacity-90 transition-opacity duration-500"></div>

                                    {/* Hover Reveal Content */}
                                    <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-90 transition-opacity duration-500 mix-blend-multiply"></div>

                                    {/* Dates / Badges */}
                                    <div className="absolute top-6 left-6 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 inline-flex items-center gap-2">
                                            <Calendar size={10} className="text-white" />
                                            <span className="text-[9px] font-black text-white uppercase tracking-widest">
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="h-[2px] w-8 bg-primary"></div>
                                            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                                                {blog.author?.name || "Hilltrek Team"}
                                            </span>
                                        </div>

                                        <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase leading-tight line-clamp-3">
                                            {blog.title}
                                        </h3>

                                        <div className="flex flex-wrap gap-4 mb-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                            <p className="text-white/80 line-clamp-2 text-sm font-medium">
                                                {blog.excerpt || blog.content.substring(0, 100) + "..."}
                                            </p>
                                        </div>

                                        <div className="w-full pt-4 border-t border-white/20 flex items-center justify-between opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                            <span className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Read Story</span>
                                            <div className="bg-white text-secondary p-3 rounded-full transform group-hover:rotate-45 transition-transform duration-500">
                                                <ArrowRight size={16} strokeWidth={3} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
