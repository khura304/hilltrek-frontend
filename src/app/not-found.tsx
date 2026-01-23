"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-[120px] font-black text-white/5 leading-none">404</h1>
            <h2 className="text-2xl font-bold text-white mb-2 -mt-10 relative z-10">This page could not be found.</h2>
            <p className="text-gray-400 mb-8 max-w-md">The page you are looking for does not exist or has been moved.</p>

            <button
                onClick={() => router.back()}
                className="orange-gradient text-white px-8 py-3 rounded-xl font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-glow transition-all active:scale-95"
            >
                Go Back
            </button>
        </div>
    );
}
