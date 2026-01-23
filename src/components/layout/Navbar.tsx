"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X, User, LayoutDashboard, LogOut, Compass, ChevronDown } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Navbar() {
    const { settings } = useSiteSettings();
    const [isOpen, setIsOpen] = useState(false);
    const [isPackagesOpen, setIsPackagesOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!token);
        if (user) {
            try {
                const userData = JSON.parse(user);
                setIsAdmin(userData.role === 'admin');
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when path changes
    useEffect(() => {
        setIsOpen(false);
        setIsPackagesOpen(false);
    }, [pathname]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        router.push('/');
    };

    const isActive = (path: string) => pathname === path;
    const isPackageActive = pathname.startsWith('/tours') || pathname.startsWith('/vehicles') || pathname.startsWith('/accommodations');

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Destinations", href: "/destinations" },
    ];

    const packageLinks = [
        { name: "Tours", href: "/tours" },
        { name: "Vehicles", href: "/vehicles" },
        { name: "Accommodations", href: "/accommodations" },
    ];

    const otherLinks = [
        { name: "Custom Booking", href: "/custom-booking" },
        { name: "Gallery", href: "/gallery" },
        { name: "Blog", href: "/blog" },
        { name: "About Us", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];
    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-4" : "py-6"}`}>
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`glass rounded-[2rem] px-6 lg:px-10 flex justify-between h-20 items-center shadow-premium transition-all duration-500 ${scrolled ? "border-white/10" : "bg-transparent border-transparent"}`}>
                    <div className="flex-shrink-0 flex items-center pr-4">
                        <Link href="/" className="flex items-center gap-4 group">
                            <div className="relative">
                                <img src={settings.logo_url || "/logo.png"} alt="Hilltrek Logo" className="w-12 h-12 object-contain relative z-10" />
                            </div>
                            <span className="text-xl font-bold text-white hidden sm:block">
                                {settings.site_name || "HillTrek"}
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8 items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-primary" : "text-gray-300 hover:text-white"}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="relative group">
                            <button className={`text-sm font-medium transition-colors flex items-center gap-1 py-4 ${isPackageActive ? "text-primary" : "text-gray-300 group-hover:text-white"}`}>
                                Packages
                                <Compass size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300">
                                <div className="glass rounded-2xl p-2 w-48 shadow-premium border-white/10 flex flex-col">
                                    {packageLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(link.href) ? "bg-primary/20 text-primary" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {otherLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-sm font-medium transition-colors ${isActive(link.href) ? "text-primary" : "text-gray-300 hover:text-white"}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-4 w-px bg-white/10 mx-2"></div>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                {isAdmin && (
                                    <Link href="/admin" className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors border border-primary/20 px-4 py-2 rounded-lg bg-primary/5">
                                        <LayoutDashboard size={14} />
                                        Admin Panel
                                    </Link>
                                )}
                                <Link href="/dashboard" className={`p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 group ${isActive('/dashboard') ? 'border-primary/50 text-primary' : ''}`}>
                                    <User size={18} />
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/10"
                                    title="Sign Out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/login" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-orange transition-transform active:scale-95">
                                Login / Sign Up
                            </Link>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-3 text-white hover:bg-white/5 rounded-xl transition-all border border-white/10"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`md:hidden fixed inset-0 z-40 bg-[#0f172a]/95 backdrop-blur-xl transition-all duration-500 ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}>
                <div className="flex flex-col h-full pt-24 pb-8 px-8 overflow-y-auto custom-scrollbar">
                    <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-2xl font-bold transition-colors ${isActive(link.href) ? "text-primary" : "text-white hover:text-primary"}`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Collapsible Packages for Mobile */}
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsPackagesOpen(!isPackagesOpen)}
                                className={`text-2xl font-bold transition-colors flex items-center justify-between w-full ${isPackageActive ? "text-primary" : "text-white"}`}
                            >
                                Packages
                                <ChevronDown className={`transition-transform duration-300 ${isPackagesOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`pl-6 space-y-4 transition-all duration-300 overflow-hidden ${isPackagesOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                                {packageLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`text-xl font-bold block transition-colors ${isActive(link.href) ? "text-primary/80" : "text-white/70 hover:text-white"}`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {otherLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`text-2xl font-bold transition-colors ${isActive(link.href) ? "text-primary" : "text-white hover:text-primary"}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/10">
                        {isLoggedIn ? (
                            <div className="flex flex-col gap-4">
                                {isAdmin && (
                                    <Link href="/admin" className="flex items-center justify-center gap-2 bg-primary/10 text-primary border border-primary/20 py-4 rounded-xl font-bold">
                                        <LayoutDashboard size={20} />
                                        Admin Panel
                                    </Link>
                                )}
                                <div className="flex gap-4">
                                    <Link href="/dashboard" className="flex-1 flex items-center justify-center gap-2 bg-white/5 text-white py-4 rounded-xl font-bold border border-white/10">
                                        <User size={20} /> Dashboard
                                    </Link>
                                    <button onClick={handleSignOut} className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-400 py-4 rounded-xl font-bold border border-red-500/10">
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="block w-full bg-primary text-white text-center py-5 rounded-2xl font-bold shadow-lg text-lg">
                                Login / Sign Up
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}


