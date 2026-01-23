import { Metadata } from "next";
import api from "@/lib/api";
import TourDetailClient from "./TourDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    try {
        const response = await api.get(`/tours/${resolvedParams.id}`);
        const tour = response.data;
        return {
            title: `${tour.title} | Hilltrek & Tours`,
            description: tour.description?.substring(0, 160) || "Explore this amazing tour package with Hilltrek & Tours.",
            openGraph: {
                images: tour.image_url ? [tour.image_url] : [],
            },
        };
    } catch (e) {
        return { title: "Tour Details | Hilltrek & Tours" };
    }
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <TourDetailClient params={params} />;
}
