"use client";

import { useEffect, useState, use } from "react";
import AdminVehicleForm from "@/components/features/AdminVehicleForm";
import api, { Vehicle } from "@/lib/api";
import { Car, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const response = await api.get(`/vehicles/${resolvedParams.id}`);
                setVehicle(response.data);
            } catch (err) {
                console.error("Failed to fetch vehicle:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicle();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Accessing Asset Data...</p>
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="text-center py-20">
                <Car size={48} className="mx-auto text-gray-700 mb-6" />
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Asset Not Located</h2>
                <Link href="/admin/vehicles" className="text-primary font-bold uppercase tracking-widest text-xs underline underline-offset-4">Return to Inventory</Link>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <Link
                        href="/admin/vehicles"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-4 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Back to Inventory</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
                            <Car size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                                Modify <span className="text-primary italic">Vehicle</span>
                            </h1>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px] mt-1">
                                Updating parameters for asset {vehicle.title}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <AdminVehicleForm vehicle={vehicle} isEditing={true} />
            </div>
        </div>
    );
}
