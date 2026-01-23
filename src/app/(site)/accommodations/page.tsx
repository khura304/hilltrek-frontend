import { Metadata } from "next";
import AccommodationListingClient from "./AccommodationListingClient";

export const metadata: Metadata = {
    title: "Luxury Accommodations | Hilltrek & Tours",
    description: "Discover luxury stay options in the heart of the mountains with Hilltrek & Tours.",
};

export default function AccommodationListingPage() {
    return <AccommodationListingClient />;
}
