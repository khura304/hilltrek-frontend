
import { Metadata } from "next";
import BlogListingClient from "./BlogListingClient";

export const metadata: Metadata = {
    title: "Travel Journal | Hilltrek & Tours",
    description: "Read our latest stories, guides, and travel tips for your next adventure in Northern Pakistan.",
};

export default function BlogListingPage() {
    return <BlogListingClient />;
}
