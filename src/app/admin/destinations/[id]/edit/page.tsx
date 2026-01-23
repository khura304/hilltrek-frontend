"use client";

import { useEffect, useState, use } from "react";
import AdminDestinationForm from "@/components/features/AdminDestinationForm";
import api, { Destination } from "@/lib/api";

export default function EditDestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [destination, setDestination] = useState<Destination | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestination = async () => {
            try {
                const response = await api.get(`/destinations/${resolvedParams.id}`);
                setDestination(response.data);
            } catch (err) {
                console.error("Failed to fetch destination:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDestination();
    }, [resolvedParams.id]);

    if (loading) return (
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white font-bold uppercase tracking-widest text-xs">Accessing Records...</p>
            </div>
        </div>
    );

    if (!destination) return <div className="p-12 text-center text-red-500 font-black uppercase tracking-widest text-xs">Destination not found in sector.</div>;

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="pb-6 border-b border-white/5">
                <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                    <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Record Modification</span>
                </div>
                <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                    Edit <span className="text-primary italic">Destination</span>
                </h1>
                <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                    Updating parameters for: {destination.name}
                </p>
            </div>

            <div className="max-w-4xl">
                <AdminDestinationForm destination={destination} isEditing={true} />
            </div>
        </div>
    );
}
