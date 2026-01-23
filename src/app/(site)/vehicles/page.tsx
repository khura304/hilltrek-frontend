import { Metadata } from "next";
import VehicleListingClient from "./VehicleListingClient";

export const metadata: Metadata = {
    title: "Premium Vehicle Rentals | Hilltrek & Tours",
    description: "Rent premium vehicles for your journey across the majestic landscapes of Gilgit-Baltistan.",
};

export default function VehicleListingPage() {
    return <VehicleListingClient />;
}