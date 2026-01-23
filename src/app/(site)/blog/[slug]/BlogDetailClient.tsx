"use client";

import { useEffect, useState, use } from "react";
import api, { Blog } from "@/lib/api";
import { Link as UserIcon, Calendar, ArrowLeft, Clock } from "lucide-react";
import ImmersiveHero from "@/components/layout/ImmersiveHero";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function BlogDetailClient({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = use(params);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get(`/blogs/${resolvedParams.slug}`);
                setBlog(response.data);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [resolvedParams.slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
            </div>
        );
    }

    return (
        <main className="flex-grow bg-background min-h-screen pb-20">
            <ImmersiveHero
                title={blog.title}
                subtitle={blog.excerpt || "A story from the mountains."}
                image={blog.image_url || "/images/hero-blog.jpg"}
                badge="Travel Journal"
                stats={[
                    { label: "Published", value: new Date(blog.created_at).toLocaleDateString(), icon: <Calendar size={20} /> },
                    { label: "Author", value: blog.author?.name || "Hilltrek", icon: <UserIcon size={20} /> },
                    { label: "Read Time", value: `${Math.ceil(blog.content.length / 1000)} min`, icon: <Clock size={20} /> },
                ]}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-primary transition-colors">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                </div>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-3xl prose-p:leading-relaxed prose-p:text-gray-400">
                    <div dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }} />
                </div>

                {/* Footer / Author Block could be added here later */}
                <div className="mt-16 pt-8 border-t border-white/10 flex items-center justify-between">
                    <p className="text-gray-500 text-sm">
                        Shared by <span className="text-white font-bold">{blog.author?.name}</span> on {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-4">
                        {/* Placeholder for social share if desired */}
                    </div>
                </div>
            </div>
        </main>
    );
}
