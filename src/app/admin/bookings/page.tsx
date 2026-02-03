"use client";

import { useEffect, useState } from "react";
import {
    CalendarCheck,
    Search,
    Filter,
    MoreVertical,
    ArrowRight,
    User,
    Mail,
    Phone,
    MapPin,
    Clock,
    ShieldCheck,
    AlertCircle,
    Download,
    Trash2,
    XCircle,
    Loader2,
    X,
    Globe,
    Users,
    CreditCard
} from "lucide-react";
import api from "@/lib/api";
import Link from "next/link";
import { useNotification } from "@/contexts/NotificationContext";

export default function AdminBookingsPage() {
    const { showToast, confirm } = useNotification();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/admin/bookings');
            setBookings(response.data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: number) => {
        confirm(
            "Cancel Booking?",
            "Are you sure you want to cancel this booking? This action cannot be undone.",
            async () => {
                try {
                    await api.delete(`/admin/bookings/${id}`);
                    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
                    showToast("success", "Booking cancelled successfully");
                } catch (err) {
                    console.error("Cancellation failed:", err);
                    showToast("error", "Failed to cancel booking.");
                }
            }
        );
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        }
    };

    const getPaymentStyle = (status: string) => {
        return status.toLowerCase() === 'paid'
            ? 'bg-emerald-500/10 text-emerald-500'
            : 'bg-red-500/10 text-red-500';
    };

    const filteredBookings = bookings.filter(booking => {
        const title = booking.tour?.title || booking.vehicle?.title || booking.accommodation?.title || "";
        const matchesSearch =
            booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.id.toString().includes(searchTerm);

        const matchesFilter = filterStatus === "all" || booking.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <CalendarCheck size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Booking Management</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        System <span className="text-primary italic">Bookings</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Review and manage all tour reservations
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 border-dashed text-right">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Active Reservations</p>
                        <p className="text-xl font-black text-white leading-none">{bookings.length}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by user, tour or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-initial">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-[10px] font-black text-white uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="all" className="bg-secondary text-white">All Status</option>
                            <option value="pending" className="bg-secondary text-white">Pending</option>
                            <option value="confirmed" className="bg-secondary text-white">Confirmed</option>
                            <option value="cancelled" className="bg-secondary text-white">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white/5 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Booking Info</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Traveler Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Tour & Date</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Financials</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-8 py-6">
                                            <div className="h-4 bg-white/5 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-600">
                                                <AlertCircle size={24} />
                                            </div>
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No bookings matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-xs font-black text-white tracking-tighter mb-1 uppercase">ID: BR-{booking.id.toString().padStart(4, '0')}</p>
                                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ref: {booking.id * 123456}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                                                    {booking.user?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{booking.user?.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.05em]">{booking.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <MapPin size={10} />
                                                    <p className="text-xs font-black text-white uppercase tracking-tighter">
                                                        {booking.tour?.title || booking.vehicle?.title || booking.accommodation?.title}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock size={10} />
                                                    <p className="text-[10px] font-bold uppercase tracking-widest">
                                                        {booking.travel_date}
                                                        <span className="ml-2 text-white/30 text-[8px]">
                                                            ({booking.tour_id ? 'Tour' : booking.vehicle_id ? 'Vehicle' : 'Stay'})
                                                        </span>
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div>
                                                <p className="text-sm font-black text-white tracking-tighter leading-none mb-2">${booking.total_price}</p>
                                                <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border border-white/5 ${getPaymentStyle(booking.payment_status)}`}>
                                                    {booking.payment_status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors ${getStatusStyle(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg border border-white/10 transition-all"
                                                    title="View Details"
                                                >
                                                    <ArrowRight size={14} strokeWidth={3} />
                                                </button>
                                                {booking.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 transition-all"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircle size={14} strokeWidth={3} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] bg-white/[0.01]">
                    <p>Showing {filteredBookings.length} of {bookings.length} Bookings</p>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 opacity-50 cursor-not-allowed">Prev</button>
                        <button className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 opacity-50 cursor-not-allowed">Next</button>
                    </div>
                </div>
            </div>
            {/* Booking Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
                        onClick={() => setSelectedBooking(null)}
                    />

                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl shadow-primary/5 p-8 md:p-12 animate-in zoom-in-95 duration-300 no-scrollbar">
                        {/* Modal Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-4">
                                    <ShieldCheck size={10} className="text-primary" />
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Verified Booking Details</span>
                                </div>
                                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
                                    Booking <span className="text-primary not-italic">Ref: {selectedBooking.id * 123456}</span>
                                </h2>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="p-4 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl border border-white/10 transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Main Info Column */}
                            <div className="lg:col-span-2 space-y-12">
                                {/* Service Info Card */}
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Service Overview</p>
                                    <div className="flex gap-6 items-start">
                                        <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-white/10 overflow-hidden flex-shrink-0">
                                            {(selectedBooking.tour?.image_url || selectedBooking.vehicle?.image_url || selectedBooking.accommodation?.image_url) ? (
                                                <img
                                                    src={selectedBooking.tour?.image_url || selectedBooking.vehicle?.image_url || selectedBooking.accommodation?.image_url}
                                                    alt="Service"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-700">
                                                    <Globe size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                                                {selectedBooking.tour?.title || selectedBooking.vehicle?.title || selectedBooking.accommodation?.title}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 items-center">
                                                <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                                                    <MapPin size={12} />
                                                    {selectedBooking.tour?.destination?.name || selectedBooking.vehicle?.destination?.name || selectedBooking.accommodation?.destination?.name || 'Global'}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                                    <CalendarCheck size={12} />
                                                    {selectedBooking.travel_date}
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                                    <Users size={12} />
                                                    {selectedBooking.num_travelers} Travelers
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Traveler List Card */}
                                <div className="space-y-6">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-2 uppercase">Traveler Information</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedBooking.travelers?.map((traveler: any, idx: number) => (
                                            <div key={idx} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 hover:border-primary/20 transition-all group">
                                                <p className="text-[8px] font-black text-primary/50 uppercase tracking-widest mb-3">Traveler #{idx + 1}</p>
                                                <p className="text-sm font-black text-white uppercase mb-4 tracking-tight group-hover:text-primary transition-colors">{traveler.name}</p>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        <Mail size={12} className="text-gray-600" />
                                                        {traveler.email || 'No email provided'}
                                                    </div>
                                                    <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                        <Phone size={12} className="text-gray-600" />
                                                        {traveler.phone || 'No phone provided'}
                                                    </div>
                                                    {traveler.passport_number && (
                                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                                            <ShieldCheck size={12} className="text-gray-600" />
                                                            Passport: {traveler.passport_number}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Column */}
                            <div className="space-y-8">
                                {/* Booking Status */}
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Booking Status</p>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2">Current Lifecycle</label>
                                            <div className={`inline-flex px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(selectedBooking.status)}`}>
                                                {selectedBooking.status}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-2">Payment Health</label>
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getPaymentStyle(selectedBooking.payment_status)} border-white/5`}>
                                                <CreditCard size={12} />
                                                {selectedBooking.payment_status}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8">
                                    <p className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] mb-6 tracking-[0.3em]">Financial Summary</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Base Price</span>
                                            <span className="text-white">${selectedBooking.total_price / selectedBooking.num_travelers}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            <span>Qty Travelers</span>
                                            <span className="text-white">x{selectedBooking.num_travelers}</span>
                                        </div>
                                        <div className="h-px bg-white/5 my-2" />
                                        <div className="flex justify-between items-end pt-2">
                                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Total Value</span>
                                            <span className="text-3xl font-black text-white leading-none tracking-tighter">${selectedBooking.total_price}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Customer Contact */}
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-6 uppercase">Primary Customer</p>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-primary font-black text-[10px]">
                                                {selectedBooking.user?.name?.charAt(0)}
                                            </div>
                                            <p className="text-xs font-black text-white uppercase tracking-tight">{selectedBooking.user?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                                            <Mail size={12} />
                                            {selectedBooking.user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
