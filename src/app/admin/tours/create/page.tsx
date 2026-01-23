"use client";

import AdminTourForm from "@/components/features/AdminTourForm";

export default function CreateTourPage() {
    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="pb-6 border-b border-white/5">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Expedition Deployment</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                    Create New <span className="text-primary italic">Tour Package</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Engineering a new premium expedition experience for the platform
                </p>
            </div>

            <div className="max-w-4xl">
                <AdminTourForm />
            </div>
        </div>
    );
}
