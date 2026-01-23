import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased min-h-screen flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}

