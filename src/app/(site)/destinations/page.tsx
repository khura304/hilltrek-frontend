import { Metadata } from "next";
import DestinationListingClient from "./DestinationListingClient";

export const metadata: Metadata = {
    title: "Popular Travel Destinations | Hilltrek & Tours",
    description: "Discover the most breathtaking destinations in Pakistan, from Hunza Valley to Skardu and beyond.",
};

export default function DestinationListingPage() {
    return <DestinationListingClient />;
}
