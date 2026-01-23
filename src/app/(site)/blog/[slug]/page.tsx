
import { Metadata } from "next";
import api from "@/lib/api";
import BlogDetailClient from "./BlogDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    try {
        const response = await api.get(`/blogs/${resolvedParams.slug}`);
        const blog = response.data;

        return {
            title: blog.meta_title || `${blog.title} | Hilltrek Blog`,
            description: blog.meta_description || blog.excerpt || blog.content.substring(0, 160),
            openGraph: {
                title: blog.meta_title || blog.title,
                description: blog.meta_description || blog.excerpt,
                images: blog.image_url ? [blog.image_url] : [],
                type: 'article',
                publishedTime: blog.created_at,
                authors: blog.author ? [blog.author.name] : [],
            },
        };
    } catch (e) {
        return {
            title: "Blog Post | Hilltrek & Tours",
        };
    }
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    return <BlogDetailClient params={params} />;
}
