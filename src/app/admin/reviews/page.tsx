"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
    MessageSquare,
    Star,
    User,
    Mountain,
    CheckCircle,
    XCircle,
    Trash2,
    Loader2,
    Filter,
    Clock,
    ShieldCheck,
    AlertCircle
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import { useNotification } from "@/contexts/NotificationContext";

type ReviewStatus = 'all' | 'pending' | 'approved' | 'rejected';

interface Review {
    id: number;
    user: {
        name: string;
        email: string;
    };
    tour: {
        id: number;
        title: string;
    };
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export default function AdminReviewsPage() {
    const { showToast, confirm } = useNotification();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<ReviewStatus>('all');
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    const fetchReviews = async (status?: string) => {
        try {
            setLoading(true);
            const params = status && status !== 'all' ? { status } : {};
            const response = await api.get('/admin/reviews', { params });
            setReviews(response.data);
            setError(null);
        } catch (err: any) {
            console.error("Failed to fetch reviews:", err);
            setError(err.response?.data?.message || "Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(filterStatus === 'all' ? undefined : filterStatus);
    }, [filterStatus]);

    const handleApprove = async (id: number) => {
        setActionLoading(id);
        try {
            await api.patch(`/admin/reviews/${id}/approve`, {});
            fetchReviews(filterStatus === 'all' ? undefined : filterStatus);
            showToast("success", "Review approved successfully");
        } catch (err: any) {
            console.error("Failed to approve review:", err);
            showToast("error", `Failed to approve: ${err.response?.data?.message || err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id: number) => {
        setActionLoading(id);
        try {
            await api.patch(`/admin/reviews/${id}/reject`, {});
            fetchReviews(filterStatus === 'all' ? undefined : filterStatus);
            showToast("success", "Review rejected successfully");
        } catch (err: any) {
            console.error("Failed to reject review:", err);
            showToast("error", `Failed to reject: ${err.response?.data?.message || err.message}`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        confirm(
            "Delete Review?",
            "Are you sure you want to delete this review? This action cannot be undone.",
            async () => {
                setActionLoading(id);
                try {
                    await api.delete(`/admin/reviews/${id}`);
                    fetchReviews(filterStatus === 'all' ? undefined : filterStatus);
                    showToast("success", "Review deleted successfully");
                } catch (err) {
                    console.error("Failed to delete review:", err);
                    showToast("error", "Failed to delete review");
                } finally {
                    setActionLoading(null);
                }
            }
        );
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: {
                icon: <Clock size={10} />,
                color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
                label: 'Pending'
            },
            approved: {
                icon: <CheckCircle size={10} />,
                color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
                label: 'Approved'
            },
            rejected: {
                icon: <XCircle size={10} />,
                color: 'text-red-500 bg-red-500/10 border-red-500/20',
                label: 'Rejected'
            }
        };

        const badge = badges[status as keyof typeof badges] || {
            icon: <AlertCircle size={10} />,
            color: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
            label: 'Unknown'
        };

        return (
            <span className={`inline-flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border ${badge.color}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    const filterTabs = [
        { value: 'all', label: 'All Reviews', icon: <MessageSquare size={12} /> },
        { value: 'pending', label: 'Pending', icon: <Clock size={12} /> },
        { value: 'approved', label: 'Approved', icon: <CheckCircle size={12} /> },
        { value: 'rejected', label: 'Rejected', icon: <XCircle size={12} /> },
    ];

    const stats = {
        total: reviews.length,
        pending: reviews.filter(r => r.status === 'pending').length,
        approved: reviews.filter(r => r.status === 'approved').length,
        rejected: reviews.filter(r => r.status === 'rejected').length,
    };

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

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <ShieldCheck size={10} className="text-primary" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Content Moderation</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        Review <span className="text-primary italic">Moderation</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Manage and moderate user reviews across all tours
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Total', value: stats.total, color: 'text-white' },
                        { label: 'Pending', value: stats.pending, color: 'text-yellow-500' },
                        { label: 'Approved', value: stats.approved, color: 'text-emerald-500' },
                        { label: 'Rejected', value: stats.rejected, color: 'text-red-500' },
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                            <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className={`text-xl font-black ${stat.color} tracking-tighter leading-none`}>{stat.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                <Filter size={14} className="text-gray-500" />
                {filterTabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilterStatus(tab.value as ReviewStatus)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all whitespace-nowrap ${filterStatus === tab.value
                            ? 'orange-gradient text-white shadow-orange'
                            : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Reviews Table */}
            <div className="bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
                {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <MessageSquare size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">No reviews found</p>
                        <p className="text-[10px] font-bold mt-2">Try changing the filter</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-gray-500 text-[9px] uppercase tracking-[0.2em] border-b border-white/5 font-black bg-white/[0.02]">
                                    <th className="px-8 py-5">User</th>
                                    <th className="px-8 py-5">Tour</th>
                                    <th className="px-8 py-5">Rating</th>
                                    <th className="px-8 py-5">Comment</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {reviews.map((review) => (
                                    <tr key={review.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-white tracking-tight leading-none mb-1">
                                                        {review.user?.name || 'Unknown'}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                                                        {review.user?.email || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 max-w-[200px]">
                                                <Mountain size={12} className="text-primary flex-shrink-0" />
                                                <p className="text-xs font-black text-white uppercase tracking-tighter truncate">
                                                    {review.tour?.title || 'N/A'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={12}
                                                        className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs text-gray-400 font-medium max-w-[300px] truncate">
                                                {review.comment}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            {getStatusBadge(review.status)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center justify-end gap-2">
                                                {actionLoading === review.id ? (
                                                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                                                ) : (
                                                    <>
                                                        {review.status !== 'approved' && (
                                                            <button
                                                                onClick={() => handleApprove(review.id)}
                                                                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
                                                                title="Approve Review"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </button>
                                                        )}
                                                        {review.status !== 'rejected' && (
                                                            <button
                                                                onClick={() => handleReject(review.id)}
                                                                className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border border-yellow-500/20 transition-colors"
                                                                title="Reject Review"
                                                            >
                                                                <XCircle size={14} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(review.id)}
                                                            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                                                            title="Delete Review"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
