"use client";

import AdminAccommodationForm from "@/components/features/AdminAccommodationForm";
import { Home, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateAccommodationPage() {
    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <Link
                        href="/admin/accommodations"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Inventory</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                            <Home size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                                Register <span className="text-primary italic">Stay</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px] mt-1">
                                Initializing a new lodging asset for the system
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <AdminAccommodationForm />
            </div>
        </div>
    );
}
