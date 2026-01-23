"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminBlogForm from "@/components/features/AdminBlogForm";
import api from "@/lib/api";
import { useParams } from "next/navigation";

export default function AdminBlogEdit() {
    const params = useParams();
    const [blog, setBlog] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await api.get(`/admin/blogs/${params.id}`);
                setBlog(response.data);
            } catch (error) {
                console.error("Failed to fetch blog:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    if (loading) {
        return <div className="text-white flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>;
    }

    if (!blog) return <div className="text-white">Blog not found</div>;

    return (
        <div className="space-y-8">
            <Link href="/admin/blogs" className="inline-flex items-center text-white/50 hover:text-white transition-colors gap-2">
                <ArrowLeft size={16} />
                Back to Blogs
            </Link>

            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Edit Blog Post</h1>
            </div>

            <AdminBlogForm blog={blog} isCreate={false} />
        </div>
    );
}
