"use client";

import { useState } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import { Menu, X, Home, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden">
            {/* Mobile Header */}
            <header className="lg:hidden h-20 glass border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-50">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.png" alt="Logo" className="w-8 h-8" />
                    <span className="text-lg font-black text-white italic tracking-tighter">HILLTREK</span>
                </Link>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 bg-white/5 rounded-lg border border-white/10 text-white"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar Wrapper */}
            <div className={`
                fixed inset-y-0 left-0 transform transition-transform duration-500 ease-in-out z-[70] lg:z-auto lg:static lg:translate-x-0
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                w-80 h-full shrink-0
            `}>
                <DashboardSidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Main Content Area */}
            <main className="flex-grow w-full h-full flex flex-col overflow-hidden">
                {/* Desktop Top Bar */}
                <div className="hidden lg:flex h-20 px-12 items-center justify-between border-b border-white/5 shrink-0">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors uppercase tracking-[0.2em] flex items-center gap-2">
                            <Home size={12} />
                            <span>Back to Site</span>
                        </Link>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 md:p-8 lg:p-12 custom-scrollbar">
                    <div className="max-w-7xl w-full mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
