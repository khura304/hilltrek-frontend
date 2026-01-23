"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mountain, ArrowRight, Loader2, ShieldCheck, Target, MoveLeft } from "lucide-react";
import api from "@/lib/api";
import Alert from "@/components/ui/Alert";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await api.post('/auth/register', { name, email, password });
            const { token } = response.data.authorization;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            router.push('/dashboard');
        } catch (err: any) {
            console.error("Registration failed:", err);
            const newErrors: typeof errors = {};

            if (err.response?.status === 422 || err.response?.status === 400) {
                // Handle Laravel validation errors or manual 400s
                const responseErrors = err.response.data.errors || err.response.data;

                if (typeof responseErrors === 'object') {
                    Object.keys(responseErrors).forEach((key) => {
                        if (Array.isArray(responseErrors[key])) {
                            newErrors[key as keyof typeof errors] = responseErrors[key][0];
                        } else if (typeof responseErrors[key] === 'string') {
                            newErrors[key as keyof typeof errors] = responseErrors[key];
                        }
                    });
                }
                if (Object.keys(newErrors).length === 0) {
                    newErrors.general = err.response?.data?.message || "Registration failed. Please check your inputs.";
                }

            } else {
                newErrors.general = err.response?.data?.message || "Something went wrong. Please try again later.";
            }
            setErrors(newErrors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen bg-background flex flex-col lg:flex-row overflow-hidden">
            {/* Left Side: Immersive Onboarding Experience */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[12000ms] scale-110 hover:scale-100"
                    style={{ backgroundImage: "url('/images/tour-detail-cta.jpg')" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent"></div>
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative h-full z-10 p-20 flex flex-col justify-between">
                    <Link href="/" className="flex items-center gap-4 group w-fit">
                        <div className="bg-primary p-3 rounded-2xl shadow-lg transition-transform group-hover:rotate-12">
                            <Mountain className="text-white size-8" />
                        </div>
                        <span className="text-3xl font-bold text-white tracking-widest uppercase">
                            Hilltrek<span className="text-primary italic">&</span>Tours
                        </span>
                    </Link>

                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl px-6 py-3 rounded-full border border-white/20 mb-8">
                            <Target size={16} className="text-primary animate-pulse" />
                            <span className="text-white font-bold text-xs tracking-widest uppercase">Join Our Community</span>
                        </div>
                        <h2 className="text-6xl font-extrabold text-white tracking-tight leading-tight uppercase mb-8">
                            Create Your <br />
                            <span className="text-white">Account</span>
                        </h2>
                        <p className="text-xl text-gray-200 font-medium leading-relaxed">
                            Unlock exclusive tour packages, expert guides, and unforgettable experiences. Your journey starts here.
                        </p>
                    </div>

                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-primary shadow-2xl">
                                <ShieldCheck size={24} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-white font-bold uppercase text-xs tracking-widest leading-none">Verified</p>
                                <p className="text-gray-300 font-medium uppercase text-[10px] tracking-widest mt-1">Secure Sign Up</p>
                            </div>
                        </div>
                        <div className="h-10 w-px bg-white/20"></div>
                        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest max-w-[150px]">Instant Access</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Registration Form */}
            <div className="flex-grow flex items-center justify-center p-8 md:p-16 lg:p-24 relative">
                {/* Mobile Header Link */}
                <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <MoveLeft size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Back to Home</span>
                </Link>

                <div className="w-full max-w-md">
                    <div className="text-center lg:text-left mb-12">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            Sign <span className="text-primary">Up</span>
                        </h1>
                        <p className="text-gray-400 font-medium text-sm tracking-wide">Start your adventure with us today</p>
                    </div>

                    <div className="bg-[#1e293b]/50 backdrop-blur-2xl p-10 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden group">

                        {errors.general && (
                            <div className="mb-8">
                                <Alert type="error" message={errors.general} />
                            </div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    disabled={loading}
                                    className={`w-full bg-white/5 border rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium ${errors.name ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="Your Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && (
                                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    disabled={loading}
                                    className={`w-full bg-white/5 border rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={loading}
                                        className={`w-full bg-white/5 border rounded-xl p-4 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium pr-12 ${errors.password ? 'border-red-500/50' : 'border-white/10'}`}
                                        placeholder="Minimum 8 Characters"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <span className="text-xs font-bold uppercase">Hide</span>
                                        ) : (
                                            <span className="text-xs font-bold uppercase">Show</span>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-xs mt-1 font-medium">{errors.password}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl transition-all transform active:scale-[0.98] shadow-lg text-sm uppercase tracking-wider mt-6 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={20} />
                                ) : (
                                    <>
                                        <span>Create Account</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-10 text-center border-t border-white/10 pt-8">
                            <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                Already have an account?
                                <Link href="/login" className="text-primary hover:text-primary-hover transition-colors ml-2 font-bold">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

