"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminPageForm from "@/components/features/AdminPageForm";

export default function AdminPageCreate() {
    return (
        <div className="space-y-8">
            <Link href="/admin/pages" className="inline-flex items-center text-white/50 hover:text-white transition-colors gap-2">
                <ArrowLeft size={16} />
                Back to Pages
            </Link>

            <div>
                <h1 className="text-4xl font-black text-white tracking-tight">Create New Page</h1>
            </div>

            <AdminPageForm isCreate={true} />
        </div>
    );
}
