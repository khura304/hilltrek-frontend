import { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
    title: "Gallery | Hilltrek & Tours",
    description: "Explore the breathtaking landscapes and moments captured on our tours.",
};

export default function GalleryPage() {
    return <GalleryClient />;
}
