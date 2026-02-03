import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { getSiteSettings } from "@/lib/api";
import HeadTagInjector from "@/components/features/HeadTagInjector";


const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Hilltrek & Tours | Expedition & Adventure",
  description: "Elite mountain expeditions and luxury tours in Gilgit-Baltistan. Book your next tour to the peaks of Pakistan.",
  icons: {
    icon: "/favicon.ico", // This will be the generated logo
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings: any = await getSiteSettings().catch(() => ({}));

  // Migration/Fallback logic: check for new injections field, or fall back to old format
  let headInjections = settings.custom_head_injections;
  if (!headInjections && settings.custom_head_tags) {
    // If old tags exist but no new list, create a "Default Injection"
    headInjections = JSON.stringify([{
      id: "legacy",
      name: "Legacy Injection",
      tags: settings.custom_head_tags,
      pages: JSON.parse(settings.custom_head_pages || "[]")
    }]);
  }

  return (
    <html lang="en">
      <head>
        <HeadTagInjector
          injections={headInjections || "[]"}
        />
      </head>
      <body
        className={`${poppins.className} antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}

