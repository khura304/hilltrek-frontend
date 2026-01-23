"use client";

import AdminDestinationForm from "@/components/features/AdminDestinationForm";

export default function CreateDestinationPage() {
    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="pb-6 border-b border-white/5">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">New Entry Creation</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                    Add New <span className="text-primary italic">Destination</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Initializing a new travel hub in the system
                </p>
            </div>

            <div className="max-w-4xl">
                <AdminDestinationForm />
            </div>
        </div>
    );
}
