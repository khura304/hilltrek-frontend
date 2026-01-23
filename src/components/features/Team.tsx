"use client";

import { Instagram, Twitter, Linkedin } from "lucide-react";

const team = [
    {
        name: "Ali Raza",
        role: "Chief Expedition Officer",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Ali has summited 5 of the 8,000m peaks and leads our most challenging expeditions."
    },
    {
        name: "Sara Khan",
        role: "Head of Operations",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Ensuring every logistical detail is perfect, from basecamp supplies to flight bookings."
    },
    {
        name: "Hassan Baig",
        role: "Senior Trekking Guide",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Born in Hunza, Hassan knows the mountains like the back of his hand."
    },
    {
        name: "Zara Ahmed",
        role: "Cultural Liaison",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bio: "Bridging the gap between travelers and local communities for authentic experiences."
    }
];

export default function Team() {
    return (
        <section className="py-24 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Meet The <span className="text-gradient">Experts</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">The passionate individuals behind every safe and unforgettable journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, idx) => (
                        <div key={idx} className="group relative">
                            <div className="relative overflow-hidden rounded-[2rem] h-96 w-full shadow-2xl">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover lg:grayscale lg:group-hover:grayscale-0 transition-all duration-500 scale-100 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                                    <p className="text-primary font-bold text-xs uppercase tracking-widest mb-4">{member.role}</p>
                                    <p className="text-gray-300 text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-3">
                                        {member.bio}
                                    </p>

                                    <div className="flex gap-4 mt-4 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 delay-200">
                                        {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                                            <a key={i} href="#" className="text-white hover:text-primary transition-colors">
                                                <Icon size={16} />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
