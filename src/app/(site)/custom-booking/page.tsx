import { Metadata } from "next";
import CustomBookingPageClient from "./CustomBookingPageClient";

export const metadata: Metadata = {
    title: "Custom Tour Booking | Hilltrek & Tours",
    description: "Can't find your perfect adventure? Request a custom tour tailored to your preferences, budget, and schedule. Let us create your dream journey.",
};

export default function CustomBookingPage() {
    return <CustomBookingPageClient />;
}
