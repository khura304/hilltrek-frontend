"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Lock,
    ShieldCheck,
    Save,
    AlertCircle,
    CheckCircle2,
    Loader2,
    UserCircle,
    Camera
} from "lucide-react";
import api from "@/lib/api";

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!storedUser || !token) {
            router.push('/login');
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
            ...formData,
            name: userData.name || "",
            email: userData.email || ""
        });
        setLoading(false);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setUpdating(true);
        setMessage(null);

        try {
            const response = await api.put('/auth/update-profile', {
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined
            });

            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });

            // Clear password fields after successful update
            setFormData(prev => ({
                ...prev,
                password: "",
                confirmPassword: ""
            }));
        } catch (err: any) {
            console.error("Update failed:", err);
            const errorMessage = err.response?.data?.message || err.response?.data?.email?.[0] || 'Failed to update profile. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section - Same as Dashboard */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/10 w-fit mb-4">
                        <User size={10} className="text-primary animate-pulse" />
                        <span className="text-[8px] font-black text-white/50 uppercase tracking-[0.2em]">Traveler Profile</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">
                        My <span className="text-primary italic">Profile</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] text-[10px]">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 border-dashed">
                    <div className="w-12 h-12 orange-gradient rounded-xl flex items-center justify-center text-white text-xl font-black shadow-orange">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight leading-none">{user?.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.05em] mt-2">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {message && (
                <div className={`p-4 rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success'
                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-xs font-bold uppercase tracking-wider">{message.text}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Stats / Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-6">
                        <div className="text-center pb-6 border-b border-white/5">
                            <div className="relative inline-block group mb-4">
                                <div className="w-24 h-24 rounded-3xl orange-gradient flex items-center justify-center text-white text-4xl font-black shadow-orange mx-auto">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-secondary border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-colors">
                                    <Camera size={14} />
                                </button>
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{user?.name}</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Traveler Member</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-gray-500">Member Since</span>
                                <span className="text-white">Jan 2024</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-gray-500">Account Type</span>
                                <span className="text-primary italic">Premium</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-4 border-t border-white/5">
                                <div className="flex items-center gap-2 text-green-500">
                                    <ShieldCheck size={12} />
                                    <span>Verified Account</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-opacity"></div>
                        <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Pro Tip</h4>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                            Keep your profile updated to receive personalized tour recommendations and exclusive travel deals!
                        </p>
                    </div>
                </div>

                {/* Edit Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white/5 rounded-[2rem] p-8 border border-white/5 shadow-2xl space-y-8">
                        {/* Personal Info */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/10">
                                    <UserCircle size={16} strokeWidth={3} />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Personal Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <User size={16} />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <Mail size={16} />
                                        </div>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Password Change */}
                        <div className="space-y-6 pt-8 border-t border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary border border-white/10">
                                    <Lock size={16} strokeWidth={3} />
                                </div>
                                <h2 className="text-lg font-black text-white uppercase tracking-tighter">Security Settings</h2>
                            </div>

                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest -mt-2">Leave blank if you don't want to change password</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={updating}
                                className="w-full md:w-auto orange-gradient text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-orange flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {updating ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} strokeWidth={3} />
                                        <span>Update Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
