import { Metadata } from "next";
import AccommodationDetailClient from "./AccommodationDetailClient";
import api from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    try {
        const accommodation = await api.get(`/accommodations/${resolvedParams.id}`);
        return {
            title: `${accommodation.data.title} | Hilltrek & Tours`,
            description: accommodation.data.description?.substring(0, 160),
        };
    } catch (e) {
        return {
            title: "Accommodation Details | Hilltrek & Tours",
        };
    }
}

export default function AccommodationDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <AccommodationDetailClient params={params} />;
}
