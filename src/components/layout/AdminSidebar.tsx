"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    MapPin,
    Mountain,
    CalendarCheck,
    Users,
    LogOut,
    ArrowLeft,
    MessageSquare,
    Settings,
    FileText,
    HelpCircle,
    Image,
    Sparkles,
    Car,
    Home
} from "lucide-react";

export default function AdminSidebar({ onClose }: { onClose?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        { label: "Dashboard", icon: <LayoutDashboard size={20} />, href: "/admin" },
        { label: "Destinations", icon: <MapPin size={20} />, href: "/admin/destinations" },
        { label: "Tour Packages", icon: <Mountain size={20} />, href: "/admin/tours" },
        { label: "Vehicles", icon: <Car size={20} />, href: "/admin/vehicles" },
        { label: "Accommodations", icon: <Home size={20} />, href: "/admin/accommodations" },
        { label: "Bookings", icon: <CalendarCheck size={20} />, href: "/admin/bookings" },
        { label: "Custom Bookings", icon: <Sparkles size={20} />, href: "/admin/custom-bookings" },
        { label: "Blog", icon: <FileText size={20} />, href: "/admin/blogs" },
        { label: "Testimonials", icon: <MessageSquare size={20} />, href: "/admin/testimonials" },
        { label: "FAQs", icon: <HelpCircle size={20} />, href: "/admin/faqs" },
        { label: "Gallery", icon: <Image size={20} />, href: "/admin/gallery" },
        { label: "Reviews", icon: <MessageSquare size={20} />, href: "/admin/reviews" },
        { label: "Site Pages", icon: <FileText size={20} />, href: "/admin/pages" },
        { label: "Settings", icon: <Settings size={20} />, href: "/admin/settings" },
    ];

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    return (
        <aside className="w-80 glass flex flex-col h-full lg:min-h-screen p-8 border-r border-white/5 relative bg-[#0f172a] lg:bg-background overflow-y-auto">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-[0.05] blur-[40px] rounded-full -mr-10 -mt-10"></div>

            <div className="mb-12 px-2 relative z-10">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative">
                        <img src="/logo.png" className="w-9 h-9 object-contain relative z-10" alt="Logo" />
                        <div className="absolute inset-0 bg-primary blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white uppercase leading-none">
                        HILLTREK<span className="text-primary italic">HQ</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-grow space-y-2 relative z-10">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl font-bold transition-all ${isActive
                                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <span className={isActive ? "text-white" : "text-primary/60 group-hover:text-primary transition-colors"}>{item.icon}</span>
                            <span className="text-sm tracking-tight">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-8 space-y-3 pt-6 border-t border-white/5 relative z-10">
                <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm"
                >
                    <ArrowLeft size={18} />
                    Back to Website
                </Link>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-xl font-bold text-red-500/80 hover:text-red-500 hover:bg-red-500/10 transition-all border border-red-500/10 text-sm"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
