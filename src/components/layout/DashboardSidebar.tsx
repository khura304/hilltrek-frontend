"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    User,
    Heart,
    LogOut,
    Home,
    Compass
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const menuItems = [
        { label: "My Trips", icon: <LayoutDashboard size={20} />, href: "/dashboard" },
        { label: "My Profile", icon: <User size={20} />, href: "/dashboard/profile" },
    ];

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    return (
        <aside className="w-80 glass flex flex-col h-full lg:min-h-screen p-6 border-r border-white/5 relative bg-[#0f172a] lg:bg-[#0f172a]/80 backdrop-blur-2xl overflow-y-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-[0.05] blur-[40px] rounded-full -mr-10 -mt-10"></div>

            {/* Sidebar Branding - More prominent on mobile */}
            <div className="mb-10 px-2 flex items-center gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                </div>
                <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-widest leading-none">Hilltrek</h2>
                    <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Adventure Agency</p>
                </div>
            </div>

            <nav className="flex-grow space-y-1.5 px-1 mt-4">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {item.icon}
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/5 uppercase tracking-widest text-[9px] font-black text-gray-500 mb-4 px-4">
                Account Settings
            </div>

            <button
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all border border-red-400/10 text-sm mb-2"
            >
                <LogOut size={18} />
                Sign Out
            </button>
        </aside>
    );
}
