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
                    <FAQ />
                    <Footer />
                </>
            )}
        </NotificationProvider>
    );
}
