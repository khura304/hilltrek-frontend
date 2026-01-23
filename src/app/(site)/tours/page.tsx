import { Metadata } from "next";
import TourListingClient from "./TourListingClient";

export const metadata: Metadata = {
    title: "Adventure Tour Packages | Hilltrek & Tours",
    description: "Explore our curated collection of adventurous tour packages across the majestic landscapes of Gilgit-Baltistan.",
};

export default function TourListingPage() {
    return <TourListingClient />;
}
