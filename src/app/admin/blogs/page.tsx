"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { FileText, Edit2, Plus, Trash2 } from "lucide-react";
import { useNotification } from "@/contexts/NotificationContext";

interface Blog {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    image_url?: string;
    created_at: string;
}

export default function AdminBlogList() {
    const { showToast, confirm } = useNotification();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await api.get('/admin/blogs');
            // Pagination response logic if needed, assuming data directly or data.data
            setBlogs(response.data.data ? response.data.data : response.data);
        } catch (error) {
            console.error("Failed to fetch blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        confirm(
            "Delete Blog Post?",
            "Are you sure you want to delete this blog post? This action cannot be undone.",
            async () => {
                try {
                    await api.delete(`/admin/blogs/${id}`);
                    setBlogs(blogs.filter(b => b.id !== id));
                    showToast("success", "Blog post deleted successfully");
                } catch (error) {
                    console.error("Failed to delete blog:", error);
                    showToast("error", "Failed to delete blog.");
                }
            }
        );
    };

    if (loading) {
        return <div className="text-white">Loading blogs...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Blog Management</h1>
                    <p className="text-gray-400 mt-2">Manage your blog posts and articles.</p>
                </div>
                <Link
                    href="/admin/blogs/create"
                    className="orange-gradient text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-glow transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus size={16} strokeWidth={3} />
                    <span>Create Post</span>
                </Link>
            </div>

            {blogs.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
                    <FileText size={48} className="mx-auto text-white/20 mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No blog posts found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="group bg-white/5 border border-white/5 hover:border-primary/50 p-6 rounded-[2rem] transition-all hover:bg-white/10 flex flex-col h-full">

                            {blog.image_url && (
                                <div className="w-full h-40 mb-4 rounded-xl overflow-hidden">
                                    <img src={blog.image_url} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${blog.is_published ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {blog.is_published ? 'Published' : 'Draft'}
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        href={`/admin/blogs/${blog.id}/edit`}
                                        className="p-2 bg-white/5 hover:bg-primary rounded-lg text-white/50 hover:text-white transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 bg-red-500/10 hover:bg-red-500 rounded-lg text-red-400 hover:text-white transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                            <p className="text-white/40 text-xs mb-4 mt-auto">/{blog.slug}</p>
                            <p className="text-white/20 text-[10px] font-mono">
                                {new Date(blog.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div >
    );
}
