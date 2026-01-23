"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
    Clock,
    Users,
    MapPin,
    CheckCircle2,
    Star,
    Calendar,
    MessageSquare,
    ShieldCheck,
    Phone,
    Mail,
    Loader2,
    ArrowRight,
    Mountain,
    AlertCircle,
    Compass,
    Target,
    Home
} from "lucide-react";
import api, { Accommodation } from "@/lib/api";
import ImmersiveHero from "@/components/layout/ImmersiveHero";
import { useNotification } from "@/contexts/NotificationContext";
import Alert, { AlertType } from "@/components/ui/Alert";

export default function AccommodationDetailClient({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const { showToast, confirm } = useNotification();
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [travelDate, setTravelDate] = useState("");
    const [numTravelers, setNumTravelers] = useState(1);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingStatus, setBookingStatus] = useState<{ type: AlertType, message: string } | null>(null);

    const [numGuests, setNumGuests] = useState(1);
    const [travelerDetails, setTravelerDetails] = useState<any[]>([{ name: '', email: '', phone: '', age: '', passport_number: '' }]);

    useEffect(() => {
        setTravelerDetails(prev => {
            const newCount = Math.max(1, numGuests);
            if (prev.length === newCount) return prev;
            if (prev.length < newCount) {
                const added = Array(newCount - prev.length).fill(null).map(() => ({ name: '', email: '', phone: '', age: '', passport_number: '' }));
                return [...prev, ...added];
            }
            return prev.slice(0, newCount);
        });
    }, [numGuests]);

    const handleTravelerChange = (index: number, field: string, value: string) => {
        setTravelerDetails(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const [reviews, setReviews] = useState<any[]>([]);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState("");

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/reviews?accommodation_id=${resolvedParams.id}`);
            setReviews(response.data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await api.post('/auth/me');
                setCurrentUserId(response.data.id);
            }
        } catch (err) {
            console.error("Failed to fetch user:", err);
        }
    };

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStatus(null);

        const token = localStorage.getItem('token');
        if (!token) {
            const currentPath = window.location.pathname;
            window.location.href = `/login?returnUrl=${currentPath}`;
            return;
        }

        if (!travelDate) {
            setBookingStatus({ type: 'error', message: "Selection Required: Select a check-in date." });
            return;
        }

        setBookingLoading(true);
        try {
            const bookingResponse = await api.post('/bookings', {
                accommodation_id: accommodation?.id,
                travel_date: travelDate,
                num_travelers: numTravelers,
                travelers: travelerDetails
            });

            const bookingId = bookingResponse.data.id;
            const paymentResponse = await api.post('/payments/create-session', {
                booking_id: bookingId
            });

            if (paymentResponse.data.url) {
                window.location.href = paymentResponse.data.url;
            } else {
                setBookingStatus({ type: 'error', message: "Payment Initialization Failed." });
            }

        } catch (err: any) {
            if (err.response?.status === 401) {
                const currentPath = window.location.pathname;
                window.location.href = `/login?returnUrl=${currentPath}`;
                return;
            }
            setBookingStatus({ type: 'error', message: err.response?.data?.message || "Booking Request Failed: Try again later." });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            showToast("warning", "Sign In Required: Please sign in to review.");
            return;
        }

        setReviewLoading(true);
        try {
            await api.post('/reviews', {
                accommodation_id: accommodation?.id,
                rating: reviewRating,
                comment: reviewComment
            });
            setReviewComment("");
            setReviewRating(5);
            fetchReviews();
            showToast("success", "Review published successfully!");
        } catch (err) {
            showToast("error", "Review Failed: Could not publish.");
        } finally {
            setReviewLoading(false);
        }
    };

    const handleEditReview = (review: any) => {
        setEditingReviewId(review.id);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    const handleUpdateReview = async (reviewId: number) => {
        try {
            await api.put(`/reviews/${reviewId}`, {
                rating: editRating,
                comment: editComment
            });
            setEditingReviewId(null);
            fetchReviews();
            showToast("success", "Review updated successfully");
        } catch (err) {
            showToast("error", "Failed to update review");
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        confirm(
            "Delete Review?",
            "Are you sure you want to delete this review? This action cannot be undone.",
            async () => {
                try {
                    await api.delete(`/reviews/${reviewId}`);
                    fetchReviews();
                    showToast("success", "Review deleted successfully");
                } catch (err) {
                    showToast("error", "Failed to delete review");
                }
            }
        );
    };

    const handleCancelEdit = () => {
        setEditingReviewId(null);
        setEditRating(5);
        setEditComment("");
    };

    useEffect(() => {
        const fetchAccommodation = async () => {
            try {
                const response = await api.get(`/accommodations/${resolvedParams.id}`);
                setAccommodation(response.data);
            } catch (err) {
                setError("Accommodation Not Found.");
            } finally {
                setLoading(false);
            }
        };
        fetchAccommodation();
        fetchReviews();
        fetchCurrentUser();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="animate-spin text-primary mb-4" size={32} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading...</p>
            </main>
        );
    }

    if (error || !accommodation) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-background text-center">
                <Home size={48} className="text-gray-700 mb-6" />
                <h1 className="text-3xl font-black text-white mb-4 uppercase">Accommodation Not Found</h1>
                <Link href="/accommodations" className="text-primary hover:text-primary-hover text-sm font-bold uppercase tracking-widest underline underline-offset-4">
                    Return to Stays
                </Link>
            </main>
        );
    }

    const features = typeof accommodation.features === 'string' ? JSON.parse(accommodation.features) : accommodation.features;

    return (
        <main className="flex-grow bg-background min-h-screen">
            <ImmersiveHero
                title={accommodation.title}
                subtitle={`Luxury Stay in ${accommodation.destination?.name || 'Pakistan'}`}
                image={accommodation.image_url || "/images/gallery-naran.jpg"}
                badge="Luxury Collection"
                stats={[
                    { label: "Duration", value: `${accommodation.total_nights} Nights`, icon: <Clock size={20} /> },
                    { label: "Max Guests", value: `${accommodation.max_guests} Guests`, icon: <Users size={20} /> },
                    { label: "Category", value: "Premium Resort", icon: <Home size={20} /> },
                    { label: "Comfort", value: "Ultra", icon: <Star size={20} className="fill-primary" /> }
                ]}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Accommodation Overview</h2>
                            <p className="text-gray-400 text-lg leading-relaxed font-light whitespace-pre-line">
                                {accommodation.description || "No description available."}
                            </p>
                        </section>

                        {/* Features Grid */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Amenities & Features</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {features && Array.isArray(features) ? features.map((feat: string, idx: number) => (
                                    <div key={idx} className="flex items-center gap-3 bg-secondary/30 px-4 py-3 rounded-xl border border-white/5">
                                        <CheckCircle2 size={18} className="text-primary shrink-0" />
                                        <span className="text-gray-300 text-sm font-medium">{feat}</span>
                                    </div>
                                )) : <p className="text-gray-500">Premium amenities included.</p>}
                            </div>
                        </section>

                        {/* Reviews */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-white tracking-tight">Guest Reviews</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                {reviews.length > 0 ? reviews.map((rev) => (
                                    <div key={rev.id} className="bg-secondary/20 p-6 rounded-2xl border border-white/5">
                                        {editingReviewId === rev.id ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <label className="text-xs font-bold text-gray-500 uppercase">Rating</label>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((s) => (
                                                            <button
                                                                key={s}
                                                                type="button"
                                                                onClick={() => setEditRating(s)}
                                                                className={`text-xl transition-colors ${s <= editRating ? 'text-primary' : 'text-white/10'}`}
                                                            >
                                                                ★
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    className="w-full bg-background border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                                    rows={3}
                                                    value={editComment}
                                                    onChange={(e) => setEditComment(e.target.value)}
                                                ></textarea>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateReview(rev.id)} className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all">Save</button>
                                                    <button onClick={handleCancelEdit} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">
                                                            {rev.user?.name?.charAt(0) || "U"}
                                                        </div>
                                                        <div>
                                                            <p className="text-white text-sm font-bold">{rev.user?.name}</p>
                                                            <div className="flex text-primary">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={10} className={i < rev.rating ? 'fill-primary' : 'text-white/10'} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-400 text-sm italic leading-relaxed mb-4">"{rev.comment}"</p>
                                                {currentUserId && rev.user_id === currentUserId && (
                                                    <div className="flex gap-2 pt-4 border-t border-white/5">
                                                        <button onClick={() => handleEditReview(rev)} className="text-xs text-primary hover:text-white uppercase font-bold tracking-wider transition-colors">Edit</button>
                                                        <button onClick={() => handleDeleteReview(rev.id)} className="text-xs text-red-500 hover:text-red-400 uppercase font-bold tracking-wider transition-colors">Delete</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )) : <p className="text-gray-600 text-sm">No reviews yet.</p>}
                            </div>

                            <div className="bg-secondary/30 p-8 rounded-2xl border border-white/5">
                                <h3 className="text-lg font-bold text-white mb-6">Rate your Stay</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Rating</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setReviewRating(s)}
                                                    className={`text-xl transition-colors ${s <= reviewRating ? 'text-primary' : 'text-white/10'}`}
                                                >
                                                    ★
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full bg-background border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-gray-700"
                                        rows={3}
                                        placeholder="Share your stay experience..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={reviewLoading}
                                        className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                                    >
                                        {reviewLoading ? 'Publishing...' : 'Submit Review'}
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Booking Card */}
                        <div className="bg-secondary border border-white/10 rounded-[4rem] p-12 shadow-2xl">
                            <div className="mb-8 pb-8 border-b border-white/5">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest block mb-2">Rates From</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-black text-white">${accommodation.price}</span>
                                    <span className="text-gray-500 text-xs font-bold">/ Night</span>
                                </div>
                            </div>

                            <form onSubmit={handleBooking} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Check-in Date</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                                        <input
                                            type="date"
                                            className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 font-medium text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all [color-scheme:dark]"
                                            value={travelDate}
                                            onChange={(e) => setTravelDate(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Nights</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 font-medium text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                            value={numTravelers || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNumTravelers(isNaN(val) ? 0 : val);
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Guests</label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                                        <input
                                            type="number"
                                            min="1"
                                            max={accommodation.max_guests || 10}
                                            className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 font-medium text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                            value={numGuests || ''}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                setNumGuests(isNaN(val) ? 0 : val);
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Traveler Details Section */}
                                <div className="space-y-4 pt-4 border-t border-white/5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Guest Details</h4>
                                    {travelerDetails.map((traveler, idx) => (
                                        <div key={idx} className="space-y-4 p-6 bg-background/50 rounded-2xl border border-white/5">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Guest #{idx + 1}</p>
                                            <div className="grid grid-cols-1 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Full Name *"
                                                    required
                                                    className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                                    value={traveler.name}
                                                    onChange={(e) => handleTravelerChange(idx, 'name', e.target.value)}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="email"
                                                        placeholder="Email"
                                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                                        value={traveler.email}
                                                        onChange={(e) => handleTravelerChange(idx, 'email', e.target.value)}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Phone"
                                                        className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                                        value={traveler.phone}
                                                        onChange={(e) => handleTravelerChange(idx, 'phone', e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {bookingStatus && (
                                    <div className="mb-4">
                                        <Alert type={bookingStatus.type} message={bookingStatus.message} />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={bookingLoading}
                                    className="w-full orange-gradient text-white font-bold py-4 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-orange/20 text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:brightness-110"
                                >
                                    {bookingLoading ? (
                                        <Loader2 className="animate-spin" size={18} />
                                    ) : (
                                        <>
                                            <span>Secure Booking</span>
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                            <div className="mt-6 flex items-center justify-center gap-2 text-gray-600">
                                <ShieldCheck size={14} />
                                <span className="text-[10px] uppercase font-bold tracking-widest">Instant Confirmation</span>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-secondary/30 rounded-3xl p-6 border border-white/5">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-primary"><MessageSquare size={20} /></div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">Need Help?</h4>
                                    <p className="text-gray-500 text-xs">Concierge support 24/7</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <Mail size={14} /> <span>concierge@hilltrek.com</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                                    <Phone size={14} /> <span>+92 300 0000002</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
