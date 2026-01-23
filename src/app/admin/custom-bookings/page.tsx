"use client";

import { useEffect, useState } from "react";
import {
    Sparkles,
    Search,
    Filter,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Clock,
    DollarSign,
    Users,
    AlertCircle,
    Trash2,
    Eye,
    Loader2,
    ChevronDown,
    X
} from "lucide-react";
import api from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";

interface CustomBooking {
    id: number;
    name: string;
    email: string;
    phone: string;
    destination: string | null;
    travel_date: string | null;
    num_travelers: number;
    duration_days: number | null;
    budget: number | null;
    special_requirements: string | null;
    status: string;
    created_at: string;
}

export default function AdminCustomBookingsPage() {
    const { showToast, confirm } = useNotification();
    const [bookings, setBookings] = useState<CustomBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedBooking, setSelectedBooking] = useState<CustomBooking | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            console.log('Fetching custom bookings...');
            const response = await api.get('/admin/custom-bookings');
            console.log('Custom bookings response:', response.data);
            setBookings(response.data);
        } catch (err: any) {
            console.error("Failed to fetch custom bookings:", err);
            console.error("Error response:", err.response?.data);
            console.error("Error status:", err.response?.status);

            // Show alert with error details
            // Show toast with error details
            if (err.response?.status === 401) {
                showToast("error", 'Authentication error: Please make sure you are logged in as admin.');
            } else if (err.response?.status === 404) {
                showToast("error", 'API endpoint not found. Please check backend routes.');
            } else {
                showToast("error", `Error loading custom bookings: ${err.response?.data?.message || err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        confirm(
            "Delete Request?",
            "Are you sure you want to delete this custom booking request?",
            async () => {
                try {
                    await api.delete(`/admin/custom-bookings/${id}`);
                    setBookings(bookings.filter(b => b.id !== id));
                    if (selectedBooking?.id === id) {
                        setShowDetails(false);
                        setSelectedBooking(null);
                    }
                    showToast("success", "Custom booking deleted successfully");
                } catch (err) {
                    console.error("Deletion failed:", err);
                    showToast("error", "Failed to delete custom booking.");
                }
            }
        );
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/admin/custom-bookings/${id}/status`, { status: newStatus });
            setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
            if (selectedBooking?.id === id) {
                setSelectedBooking({ ...selectedBooking, status: newStatus });
            }
            showToast("success", "Status updated successfully");
        } catch (err) {
            console.error("Status update failed:", err);
            showToast("error", "Failed to update status.");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status.toLowerCase()) {
            case 'contacted': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone?.includes(searchTerm) ||
            booking.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        <Sparkles size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Custom Booking Requests</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        Custom <span className="text-primary italic">Tour Requests</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Manage personalized tour booking inquiries
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 border-dashed text-right">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Requests</p>
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
                        placeholder="Search by name, email, destination..."
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
                            <option value="contacted" className="bg-secondary text-white">Contacted</option>
                            <option value="completed" className="bg-secondary text-white">Completed</option>
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
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Customer</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Destination</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Details</th>
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
                                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No custom booking requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-white tracking-tighter uppercase">CB-{booking.id.toString().padStart(4, '0')}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm border border-primary/20">
                                                    {booking.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">{booking.name}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.05em]">{booking.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-primary">
                                                    <MapPin size={10} />
                                                    <p className="text-xs font-black text-white uppercase tracking-tighter">
                                                        {booking.destination || 'Not specified'}
                                                    </p>
                                                </div>
                                                {booking.travel_date && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Calendar size={10} />
                                                        <p className="text-[10px] font-bold uppercase tracking-widest">{booking.travel_date}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-1 text-[10px] text-gray-400 font-bold">
                                                <div className="flex items-center gap-2">
                                                    <Users size={10} />
                                                    <span>{booking.num_travelers} travelers</span>
                                                </div>
                                                {booking.duration_days && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={10} />
                                                        <span>{booking.duration_days} days</span>
                                                    </div>
                                                )}
                                                {booking.budget && (
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign size={10} />
                                                        <span>${booking.budget}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <select
                                                value={booking.status}
                                                onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                                                className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-colors cursor-pointer bg-transparent ${getStatusStyle(booking.status)}`}
                                            >
                                                <option value="pending" className="bg-secondary text-white">Pending</option>
                                                <option value="contacted" className="bg-secondary text-white">Contacted</option>
                                                <option value="completed" className="bg-secondary text-white">Completed</option>
                                                <option value="cancelled" className="bg-secondary text-white">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedBooking(booking);
                                                        setShowDetails(true);
                                                    }}
                                                    className="p-2 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg border border-white/10 transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} strokeWidth={3} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(booking.id)}
                                                    className="p-2 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-lg border border-white/10 transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} strokeWidth={3} />
                                                </button>
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
                    <p>Showing {filteredBookings.length} of {bookings.length} Requests</p>
                </div>
            </div>

            {/* Details Modal */}
            {showDetails && selectedBooking && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-secondary border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
                        <button
                            onClick={() => setShowDetails(false)}
                            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all"
                        >
                            <X size={20} className="text-white" />
                        </button>

                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-4">
                                <Sparkles size={10} className="text-primary" />
                                <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">Custom Booking Details</span>
                            </div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                                Request CB-{selectedBooking.id.toString().padStart(4, '0')}
                            </h2>
                            <p className="text-xs text-gray-500 font-bold uppercase">
                                Submitted {new Date(selectedBooking.created_at).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-sm font-black text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <User size={14} className="text-primary" />
                                    Customer Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Name</p>
                                        <p className="text-white font-bold">{selectedBooking.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Email</p>
                                        <p className="text-white font-bold">{selectedBooking.email}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Phone</p>
                                        <p className="text-white font-bold">{selectedBooking.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <h3 className="text-sm font-black text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <MapPin size={14} className="text-primary" />
                                    Trip Details
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Destination</p>
                                        <p className="text-white font-bold">{selectedBooking.destination || 'Not specified'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Travel Date</p>
                                        <p className="text-white font-bold">{selectedBooking.travel_date || 'Flexible'}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Number of Travelers</p>
                                        <p className="text-white font-bold">{selectedBooking.num_travelers}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Duration</p>
                                        <p className="text-white font-bold">{selectedBooking.duration_days ? `${selectedBooking.duration_days} days` : 'Not specified'}</p>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Budget</p>
                                        <p className="text-white font-bold">{selectedBooking.budget ? `$${selectedBooking.budget}` : 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Special Requirements */}
                            {selectedBooking.special_requirements && (
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wide mb-4">Special Requirements</h3>
                                    <p className="text-sm text-gray-300 font-medium whitespace-pre-wrap">{selectedBooking.special_requirements}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
