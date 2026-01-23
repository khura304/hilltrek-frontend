"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api, { Accommodation } from "@/lib/api";
import {
    Home,
    Plus,
    Edit2,
    Trash2,
    MapPin,
    DollarSign,
    Clock,
    Search,
    Loader2,
    Calendar,
    ChevronRight,
    Users
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useNotification } from "@/contexts/NotificationContext";

export default function AdminAccommodationsPage() {
    const { showToast, confirm } = useNotification();
    const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAccommodations();
    }, []);

    const fetchAccommodations = async () => {
        try {
            const response = await api.get('/accommodations');
            setAccommodations(response.data);
        } catch (err) {
            console.error("Failed to fetch accommodations:", err);
            setError("Failed to load accommodation assets.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        confirm(
            "Delete Accommodation Asset?",
            "Are you sure you want to delete this accommodation? This action cannot be undone.",
            async () => {
                try {
                    await api.delete(`/accommodations/${id}`);
                    setAccommodations(accommodations.filter(a => a.id !== id));
                    showToast("success", "Accommodation asset deleted successfully");
                } catch (err) {
                    console.error("Delete failed:", err);
                    showToast("error", "Failed to delete accommodation.");
                }
            }
        );
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <Home size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Lodging Inventory</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        System <span className="text-primary italic">Stays</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Managing premium stays and resort associations
                    </p>
                </div>

                <Link
                    href="/admin/accommodations/create"
                    className="orange-gradient text-white px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-orange flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition"
                >
                    <Plus size={16} strokeWidth={3} />
                    <span>Register Stay</span>
                </Link>
            </div>

            {error && (
                <div className="mb-6">
                    <Alert type="error" message={error} />
                </div>
            )}

            {/* List/Table */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Asset Designation</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Operation Region</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Deployment Rate</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Specs</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-8 py-6">
                                            <div className="h-4 bg-white/5 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : accommodations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                                        No active lodging assets detected.
                                    </td>
                                </tr>
                            ) : (
                                accommodations.map((accommodation) => (
                                    <tr key={accommodation.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-12 h-12 shrink-0 group-hover:scale-110 transition-transform duration-500">
                                                    <img src={accommodation.image_url} alt="" className="w-full h-full rounded-xl object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all shadow-lg" />
                                                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10"></div>
                                                </div>
                                                <div>
                                                    <span className="font-black text-base text-white tracking-tight uppercase group-hover:text-primary transition-colors block leading-none mb-1">{accommodation.title}</span>
                                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">ID: AC-{accommodation.id.toString().padStart(4, '0')}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <MapPin size={12} className="text-primary/60" />
                                                <span className="text-xs font-bold uppercase tracking-tight">{accommodation.destination?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 font-black text-white tracking-tighter text-base">
                                                <span className="text-primary/60 text-xs">$</span>
                                                {accommodation.price.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col gap-1 text-gray-500">
                                                <div className="flex items-center gap-2">
                                                    <Users size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">{accommodation.max_guests} Guests Max</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock size={12} />
                                                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">{accommodation.total_nights} Nights Package</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/accommodations/${accommodation.id}/edit`}
                                                    className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 transition-all"
                                                    title="Modify Stay"
                                                >
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(accommodation.id)}
                                                    className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 transition-all"
                                                    title="Decommission Stay"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
