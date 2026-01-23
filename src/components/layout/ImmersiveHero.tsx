"use client";

import { ReactNode } from "react";
import { ArrowDown } from "lucide-react";

interface Stat {
    label: string;
    value: string;
    icon?: ReactNode;
}

interface ImmersiveHeroProps {
    title: string;
    subtitle: string;
    image: string;
    stats?: Stat[];
    badge?: string;
}

export default function ImmersiveHero({ title, subtitle, image, stats, badge }: ImmersiveHeroProps) {
    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight * 0.8,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative min-h-[85vh] w-full overflow-hidden flex flex-col justify-center">
            {/* Background Parallax Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
            >
                <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col justify-center">
                <div className="max-w-5xl space-y-6 animate-fade-in-up">
                    {badge && (
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full mb-4">
                            <span className="text-white font-bold text-[10px] uppercase tracking-[0.2em]">
                                {badge}
                            </span>
                        </div>
                    )}

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1] uppercase drop-shadow-2xl">
                        {title.split(" ").map((word, i) => (
                            <span key={i} className={i === 1 ? "text-gradient inline-block mr-4" : "inline-block mr-4"}>{word}</span>
                        ))}
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl leading-relaxed tracking-wide pl-2 border-l-2 border-primary/50">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Glass Stats Bar */}
            {stats && stats.length > 0 && (
                <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/60 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="py-8 px-6 flex items-center gap-4 group hover:bg-white/5 transition-colors cursor-default">
                                    {stat.icon && (
                                        <div className="text-primary opacity-80 group-hover:scale-110 transition-transform">
                                            {stat.icon}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll Indicator */}
            {!stats && (
                <button
                    onClick={scrollToContent}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce"
                >
                    <ArrowDown size={32} />
                </button>
            )}
        </div>
    );
}
