import { Metadata } from "next";
import api from "@/lib/api";
import DestinationDetailClient from "./DestinationDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    try {
        const response = await api.get(`/destinations/${resolvedParams.id}`);
        const dest = response.data;
        return {
            title: `${dest.name} Travel Guide | Hilltrek & Tours`,
            description: dest.description?.substring(0, 160) || "Discover beautiful destinations in Gilgit-Baltistan.",
            openGraph: {
                images: dest.image_url ? [dest.image_url] : [],
            },
        };
    } catch (e) {
        return { title: "Destination Details | Hilltrek & Tours" };
    }
}

export default function DestinationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <DestinationDetailClient params={params} />;
}
