"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getPages, PageContent, deletePage } from "@/lib/api";
import { FileText, Edit2, Trash2 } from "lucide-react";

export default function AdminPagesList() {
    const [pages, setPages] = useState<PageContent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const data = await getPages();
                setPages(data);
            } catch (error) {
                console.error("Failed to fetch pages:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPages();
    }, []);

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this page?")) return;

        try {
            await deletePage(slug);
            setPages(pages.filter(p => p.slug !== slug));
            alert("Page deleted successfully!");
        } catch (error) {
            console.error("Failed to delete page:", error);
            alert("Failed to delete page.");
        }
    };

    if (loading) {
        return <div className="text-white">Loading pages...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Pages Management</h1>
                    <p className="text-gray-400 mt-2">Manage content for static pages.</p>
                </div>
                <Link
                    href="/admin/pages/create"
                    className="orange-gradient text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider shadow-lg hover:shadow-orange-glow transition-all active:scale-95"
                >
                    + Create Page
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page) => (
                    <div key={page.slug} className="group bg-white/5 border border-white/5 hover:border-primary/50 p-6 rounded-[2rem] transition-all hover:bg-white/10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-primary/20 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <FileText size={24} />
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/admin/pages/${page.slug}`}
                                    className="p-2 bg-white/5 hover:bg-primary rounded-lg text-white/50 hover:text-white transition-all"
                                >
                                    <Edit2 size={18} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(page.slug)}
                                    className="p-2 bg-white/5 hover:bg-red-500 rounded-lg text-white/50 hover:text-white transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1 capitalize">{page.title}</h3>
                        <p className="text-white/40 text-sm mb-4">/{page.slug}</p>

                        <div className="space-y-2">
                            <div className="text-xs text-white/60">
                                <span className="text-white/30 uppercase tracking-wider font-bold mr-2">Hero Title:</span>
                                {page.hero_title || "N/A"}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
