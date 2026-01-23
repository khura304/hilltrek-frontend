"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminBlogForm from "@/components/features/AdminBlogForm";

export default function AdminBlogCreate() {
    return (
        <div className="space-y-8">
            <Link href="/admin/blogs" className="inline-flex items-center text-white/50 hover:text-white transition-colors gap-2">
                <ArrowLeft size={16} />
                Back to Blogs
            </Link>

            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Create Blog Post</h1>
            </div>

            <AdminBlogForm isCreate={true} />
        </div>
    );
}
