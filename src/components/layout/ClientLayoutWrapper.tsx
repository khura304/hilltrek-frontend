"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FAQ from "@/components/features/FAQ";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function ClientLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const isAuthPage = pathname?.startsWith("/login") || pathname?.startsWith("/register");

    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <NotificationProvider>
            {isDashboard || isAdmin ? (
                <main className="flex-grow">
                    {children}
                </main>
            ) : isAuthPage ? (
                <main className="flex-grow">
                    {children}
                </main>
            ) : (
                <>
                    <Navbar />
                    <main className="flex-grow">
                        {children}
                    </main>
                    <FAQ page={
                        pathname === "/" ? "home" :
                            pathname?.startsWith("/tours") ? "tours" :
                                pathname?.startsWith("/destinations") ? "destinations" :
                                    pathname?.startsWith("/accommodations") ? "accommodations" :
                                        pathname?.startsWith("/vehicles") ? "vehicles" :
                                            pathname?.startsWith("/about") ? "about" :
                                                pathname?.startsWith("/contact") ? "contact" :
                                                    pathname?.startsWith("/custom-booking") ? "custom-booking" :
                                                        pathname?.startsWith("/blog") ? "blog" :
                                                            pathname?.startsWith("/gallery") ? "gallery" :
                                                                undefined
                    } />
                    <Footer />
                </>
            )}
        </NotificationProvider>
    );
}
