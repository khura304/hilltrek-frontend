"use client";

import { useEffect, useState, use } from "react";
import { getPageContent, PageContent } from "@/lib/api";
import AdminPageForm from "@/components/features/AdminPageForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminPageEdit({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const [page, setPage] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const data = await getPageContent(slug);
                setPage(data);
            } catch (error) {
                console.error("Failed to fetch page:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPage();
    }, [slug]);

    if (loading) return <div className="text-white">Loading...</div>;
    if (!page) return <div className="text-white">Page not found</div>;

    return (
        <div className="space-y-8">
            <Link href="/admin/pages" className="inline-flex items-center text-white/50 hover:text-white transition-colors gap-2">
                <ArrowLeft size={16} />
                Back to Pages
            </Link>

            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Edit Page: {page.title}</h1>
            </div>

            <AdminPageForm page={page} />
        </div>
    );
}
