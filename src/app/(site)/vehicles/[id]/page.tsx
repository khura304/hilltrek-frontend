import { Metadata } from "next";
import VehicleDetailClient from "./VehicleDetailClient";
import api from "@/lib/api";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    try {
        const vehicle = await api.get(`/vehicles/${resolvedParams.id}`);
        return {
            title: `${vehicle.data.title} | Hilltrek & Tours`,
            description: vehicle.data.description?.substring(0, 160),
        };
    } catch (e) {
        return {
            title: "Vehicle Details | Hilltrek & Tours",
        };
    }
}

export default function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
    return <VehicleDetailClient params={params} />;
}
