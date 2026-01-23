import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export default function Footer() {
    const { settings } = useSiteSettings();

    return (
        <footer className="bg-secondary text-gray-300 pt-16 pb-8 overflow-hidden relative border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <div className="col-span-1 lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <img src={settings.logo_url || "/logo.png"} alt="Hilltrek Logo" className="w-8 h-8 object-contain" />
                            <span className="text-xl font-bold text-white">
                                {settings.site_name || "HillTrek"}
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm mb-6">
                            {settings.footer_text || "Leading travel agency in Pakistan, offering premium tours to the Northern Areas, Hunza, Skardu, and Kashmir."}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: Facebook, url: settings.social_facebook },
                                { icon: Instagram, url: settings.social_instagram },
                                { icon: Twitter, url: settings.social_twitter }
                            ].map((item, i) => (
                                item.url ? (
                                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/5">
                                        <item.icon size={14} />
                                    </a>
                                ) : null
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Destinations</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/destinations/hunza" className="text-gray-400 hover:text-primary transition-colors">Hunza Valley</Link></li>
                            <li><Link href="/destinations/skardu" className="text-gray-400 hover:text-primary transition-colors">Skardu</Link></li>
                            <li><Link href="/destinations/kashmir" className="text-gray-400 hover:text-primary transition-colors">Azad Kashmir</Link></li>
                            <li><Link href="/destinations/swat" className="text-gray-400 hover:text-primary transition-colors">Swat Valley</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Quick Links</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="text-gray-400 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/tours" className="text-gray-400 hover:text-primary transition-colors">All Packages</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">Travel Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-wider">Contact Us</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start space-x-3">
                                <MapPin size={16} className="text-primary mt-1" />
                                <span>Main Bazar, Gilgit, Pakistan</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={16} className="text-primary" />
                                <span>{settings.contact_phone || "+92 300 0000000"}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={16} className="text-primary" />
                                <span>{settings.contact_email || "info@hilltrek.com"}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© {new Date().getFullYear()} Hilltrek & Tours. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        {(() => {
                            let links = [];
                            try {
                                if (settings.footer_links) {
                                    links = JSON.parse(settings.footer_links);
                                }
                            } catch (e) {
                                console.error("Failed to parse footer links", e);
                            }

                            if (links.length === 0) {
                                links = [
                                    { label: "Privacy Policy", url: "/privacy" },
                                    { label: "Terms of Service", url: "/terms" }
                                ];
                            }

                            return links.map((link: any, i: number) => (
                                <Link key={i} href={link.url} className="hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            ));
                        })()}
                    </div>
                </div>
            </div>
        </footer>
    );
}


