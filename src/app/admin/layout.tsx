"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            router.push('/login');
            return;
        }

        try {
            const userData = JSON.parse(user);
            if (userData.role !== 'admin') {
                router.push('/');
                return;
            }
            setIsAuthorized(true);
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-white font-bold uppercase tracking-widest text-xs">Verifying Credentials...</p>
                </div>
            </div>
        );
    }

    return (
        <NotificationProvider>
            <div className="h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
                {/* Mobile Admin Header */}
                <header className="lg:hidden h-20 bg-background border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-50">
                    <div className="flex items-center gap-3">
                        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                        <span className="text-lg font-black text-white tracking-tighter uppercase">Hilltrek<span className="text-primary italic">HQ</span></span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-white/5 rounded-lg border border-white/10 text-white"
                    >
                        <div className="w-5 h-4 flex flex-col justify-between items-end">
                            <span className={`h-0.5 bg-white transition-all duration-300 ${isSidebarOpen ? 'w-5 translate-y-1.5 -rotate-45' : 'w-5'}`}></span>
                            <span className={`h-0.5 bg-white transition-all duration-300 ${isSidebarOpen ? 'opacity-0' : 'w-3'}`}></span>
                            <span className={`h-0.5 bg-white transition-all duration-300 ${isSidebarOpen ? 'w-5 -translate-y-2 rotate-45' : 'w-4'}`}></span>
                        </div>
                    </button>
                </header>

                {/* Sidebar Overlay for Mobile */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}

                {/* Admin Sidebar Wrapper */}
                <div className={`
                fixed inset-y-0 left-0 transform transition-transform duration-500 ease-in-out z-[70] lg:z-auto lg:static lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                w-80 h-full shrink-0
            `}>
                    <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
                </div>

                {/* Main Admin Area */}
                <main className="flex-grow w-full h-full flex flex-col overflow-hidden">
                    {/* Desktop Admin Header */}
                    <header className="hidden lg:flex h-20 bg-background/50 backdrop-blur-2xl border-b border-white/5 items-center justify-between px-12 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Operations Center</span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-xs font-black text-white uppercase tracking-tighter leading-none mb-1">Command HQ</p>
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">Root Access Level</p>
                            </div>
                            <div className="w-10 h-10 orange-gradient rounded-xl flex items-center justify-center text-white text-xs font-black shadow-orange rotate-3">
                                HQ
                            </div>
                        </div>
                    </header>

                    <div className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.03),transparent_40%)]">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </NotificationProvider>
    );
}

