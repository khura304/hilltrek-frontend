"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import Alert from "@/components/ui/Alert";
import {
    LayoutDashboard,
    Mountain,
    MapPin,
    Users,
    DollarSign,
    CalendarCheck,
    ArrowRight,
    Loader2,
    ShieldCheck,
    MessageSquare,
    Settings,
    FileText,
    Car,
    Hotel,
    Clock,
    XCircle
} from "lucide-react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
                setError("You are not authorized to view this page.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex-grow flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
    );

    if (error) return (
        <div className="flex-grow flex items-center justify-center min-h-[400px] p-6">
            <Alert type="error" message={error} className="max-w-md w-full" />
        </div>
    );

    const statCards = [
        { label: 'Total Revenue', value: `$${stats.total_revenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: 'text-emerald-500', detail: 'Confirmed' },
        { label: 'Tour Bookings', value: stats.tour_bookings_count, icon: <Mountain size={18} />, color: 'text-primary' },
        { label: 'Vehicle Bookings', value: stats.vehicle_bookings_count, icon: <Car size={18} />, color: 'text-blue-500' },
        { label: 'Hotel Bookings', value: stats.accommodation_bookings_count, icon: <Hotel size={18} />, color: 'text-purple-500' },
        { label: 'Pending Payments', value: stats.pending_payments_count, icon: <Clock size={18} />, color: 'text-yellow-500', detail: 'Awaiting Pay' },
        { label: 'Cancelled count', value: stats.cancelled_bookings_count, icon: <XCircle size={18} />, color: 'text-red-500', detail: 'Bookings' },
        { label: 'Cancelled Revenue', value: `$${stats.cancelled_bookings_revenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: 'text-red-400', detail: 'Lost Revenue' },
        { label: 'Total Users', value: stats.total_users, icon: <Users size={18} />, color: 'text-gray-400' },
    ];

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <LayoutDashboard size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Platform Overview</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        Control <span className="text-primary italic">Center</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Analyzing real-time platform metrics and activity
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 border-dashed">
                    <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center text-white font-black shadow-orange">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">System Integrity</p>
                        <p className="text-xs font-black text-emerald-500 uppercase tracking-tighter">Verified Secure</p>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 group hover:bg-white/10 transition-all shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${s.color} border border-white/10 group-hover:scale-110 transition-transform`}>
                                {s.icon}
                            </div>
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">{s.detail || 'MTD Report'}</span>
                        </div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-3xl font-black text-white tracking-tighter leading-none">{s.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <section className="lg:col-span-2 bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-22xl">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                        <h2 className="text-lg font-black text-white uppercase tracking-tighter">Latest Bookings</h2>
                        <Link href="/admin/bookings" className="text-[10px] font-black text-primary hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                            View All <ArrowRight size={12} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-500 text-[9px] uppercase tracking-[0.2em] border-b border-white/5 font-black">
                                    <th className="px-8 py-5">Traveler</th>
                                    <th className="px-8 py-5">Expedition</th>
                                    <th className="px-8 py-5">Revenue</th>
                                    <th className="px-8 py-5 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {stats.recent_bookings.map((b: any) => (
                                    <tr key={b.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <p className="text-sm font-black text-white tracking-tight leading-none mb-1">{b.user?.name}</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{b.user?.email}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <MapPin size={10} className="text-primary" />
                                                <p className="text-xs font-black text-white uppercase tracking-tighter truncate max-w-[150px]">{b.tour?.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 font-black text-white tracking-tighter text-sm">${b.total_price}</td>
                                        <td className="px-8 py-5 text-right">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20">
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Management Column */}
                <aside className="space-y-6">
                    <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-[0.03] blur-[40px] rounded-full -mr-16 -mt-16"></div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tighter mb-8 relative z-10">Quick Actions</h2>
                        <div className="space-y-3 relative z-10">
                            {[
                                { label: 'Create New Tour', href: '/admin/tours/create', primary: true, icon: <Mountain size={14} /> },
                                { label: 'Add Destination', href: '/admin/destinations/create', primary: false, icon: <MapPin size={14} /> },
                                { label: 'Moderate Reviews', href: '/admin/reviews', primary: false, icon: <MessageSquare size={14} /> },
                                { label: 'Analyze Revenue', href: '/admin/bookings', primary: false, icon: <DollarSign size={14} /> },
                                { label: 'Page Management', href: '/admin/pages', primary: false, icon: <FileText size={14} /> },
                                { label: 'Site Settings', href: '/admin/settings', primary: false, icon: <Settings size={14} /> },
                            ].map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.href}
                                    className={`flex items-center justify-between w-full px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all group ${action.primary
                                        ? 'orange-gradient text-white shadow-orange hover:scale-[1.02] active:scale-95'
                                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                                        }`}
                                >
                                    <span className="flex items-center gap-3">
                                        {action.icon}
                                        {action.label}
                                    </span>
                                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-12 p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-[0.05] blur-[30px] rounded-full -mr-12 -mt-12 group-hover:opacity-[0.08] transition-opacity"></div>
                            <div className="flex items-center gap-3 text-emerald-500 mb-3">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Server Health</span>
                            </div>
                            <p className="text-[11px] text-gray-500 font-bold leading-relaxed mb-4">
                                All backend systems are operating within optimal latency parameters. No anomalies detected.
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Syncing with Node Cluster</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
