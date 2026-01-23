"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, MapPin, DollarSign, Clock, Send, CheckCircle2, Loader2, LogIn } from "lucide-react";
import api from "@/lib/api";
import { useNotification } from "@/contexts/NotificationContext";
import Alert from "@/components/ui/Alert";

export default function CustomBookingForm() {
    const router = useRouter();
    const { showToast } = useNotification();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travel_date: "",
        num_travelers: "1",
        duration_days: "",
        budget: "",
        special_requirements: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Check if user is logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        setCheckingAuth(false);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            // Convert empty strings to null for optional fields
            const submitData = {
                ...formData,
                destination: formData.destination || null,
                travel_date: formData.travel_date || null,
                duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
                budget: formData.budget ? parseFloat(formData.budget) : null,
                special_requirements: formData.special_requirements || null,
                num_travelers: parseInt(formData.num_travelers),
            };

            await api.post("/custom-bookings", submitData);
            setSuccess(true);
            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
                destination: "",
                travel_date: "",
                num_travelers: "1",
                duration_days: "",
                budget: "",
                special_requirements: "",
            });

            // Scroll to success message
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 100);
        } catch (err: any) {
            console.error("Submission error:", err);

            // Check if it's an authentication error
            if (err.response?.status === 401) {
                showToast("error", "You must be logged in to submit a custom booking request. Redirecting to login page...");
                setTimeout(() => {
                    router.push('/login');
                }, 1500);
            } else {
                setError(err.response?.data?.message || "Failed to submit request. Please try again.");
                showToast("error", "Failed to submit request.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 backdrop-blur-xl rounded-[3rem] border border-emerald-500/20 p-12 md:p-16 text-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                    <CheckCircle2 size={40} className="text-emerald-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-4">
                    Request Received!
                </h3>
                <p className="text-lg text-gray-300 font-medium mb-8 max-w-2xl mx-auto">
                    Thank you for your custom tour request! Our team will review your requirements and get back to you within 24 hours with a personalized proposal.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest border border-white/20 transition-all"
                >
                    Submit Another Request
                </button>
            </div>
        );
    }

    // Show loading while checking auth
    if (checkingAuth) {
        return (
            <div className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] border border-white/10 p-12 md:p-16 text-center shadow-2xl">
                <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" strokeWidth={2.5} />
                <p className="text-gray-400 font-medium">Checking authentication...</p>
            </div>
        );
    }

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl rounded-[3rem] border border-amber-500/20 p-12 md:p-16 text-center shadow-2xl">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
                    <LogIn size={40} className="text-amber-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-4">
                    Login Required
                </h3>
                <p className="text-lg text-gray-300 font-medium mb-8 max-w-2xl mx-auto">
                    You need to be logged in to submit a custom tour request. This helps us track your bookings and provide you with better service.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => router.push('/login')}
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-105"
                    >
                        <LogIn size={18} strokeWidth={3} />
                        Login to Continue
                    </button>
                    <button
                        onClick={() => router.push('/register')}
                        className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest border border-white/20 transition-all hover:scale-105"
                    >
                        Create Account
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/[0.03] backdrop-blur-xl rounded-[3rem] border border-white/10 p-8 md:p-12 shadow-2xl">
            {error && (
                <div className="mb-8">
                    <Alert type="error" message={error} dismissible onDismiss={() => setError("")} />
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information Section */}
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <div className="h-1 w-8 bg-primary rounded"></div>
                        Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                    </div>
                </div>

                {/* Trip Details Section */}
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <div className="h-1 w-8 bg-primary rounded"></div>
                        Trip Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <MapPin size={12} />
                                Preferred Destination
                            </label>
                            <input
                                type="text"
                                name="destination"
                                value={formData.destination}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="e.g. Hunza Valley, K2 Base Camp"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Calendar size={12} />
                                Preferred Travel Date
                            </label>
                            <input
                                type="date"
                                name="travel_date"
                                value={formData.travel_date}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Users size={12} />
                                Number of Travelers <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="num_travelers"
                                value={formData.num_travelers}
                                onChange={handleChange}
                                required
                                min="1"
                                max="50"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Clock size={12} />
                                Duration (Days)
                            </label>
                            <input
                                type="number"
                                name="duration_days"
                                value={formData.duration_days}
                                onChange={handleChange}
                                min="1"
                                max="365"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="e.g. 7"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <DollarSign size={12} />
                                Estimated Budget (USD)
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={formData.budget}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                                placeholder="e.g. 2000"
                            />
                        </div>
                    </div>
                </div>

                {/* Special Requirements Section */}
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-6 flex items-center gap-2">
                        <div className="h-1 w-8 bg-primary rounded"></div>
                        Additional Details
                    </h3>
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Special Requirements or Preferences
                        </label>
                        <textarea
                            name="special_requirements"
                            value={formData.special_requirements}
                            onChange={handleChange}
                            rows={5}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition-all font-medium resize-none"
                            placeholder="Tell us about any dietary restrictions, special accommodations, activities of interest, or other requirements..."
                        ></textarea>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-primary text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" strokeWidth={3} />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send size={18} strokeWidth={3} />
                                Submit Custom Tour Request
                            </>
                        )}
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-4 font-medium">
                        We'll respond within 24 hours with a personalized quote
                    </p>
                </div>
            </form>
        </div>
    );
}
