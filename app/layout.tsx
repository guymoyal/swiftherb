import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BuyMeACoffee from "@/components/BuyMeACoffee";
import StructuredData from "@/components/StructuredData";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SwiftHerb - AI Pharmacist Assistant",
    template: "%s | SwiftHerb",
  },
  description: "AI-powered supplement recommendation platform. Get personalized natural health product recommendations from our AI pharmacist assistant.",
  keywords: ["supplements", "vitamins", "natural health", "AI pharmacist", "iHerb", "health products", "wellness"],
  authors: [{ name: "SwiftHerb" }],
  creator: "SwiftHerb",
  publisher: "SwiftHerb",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "SwiftHerb",
    title: "SwiftHerb - AI Pharmacist Assistant",
    description: "AI-powered supplement recommendation platform. Get personalized natural health product recommendations.",
    images: [
      {
        url: `${SITE_URL}/images/swiftherb-logo.png`,
        width: 1200,
        height: 630,
        alt: "SwiftHerb Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftHerb - AI Pharmacist Assistant",
    description: "AI-powered supplement recommendation platform.",
    images: [`${SITE_URL}/images/swiftherb-logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add Google Search Console verification when available
    // google: "your-verification-code",
    other: {
      "impact-site-verification": "d77a181b-c932-4e31-8d8a-b57df50a65dd",
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="impact-site-verification" content="d77a181b-c932-4e31-8d8a-b57df50a65dd" />
      </head>
      <body className="flex flex-col min-h-screen">
        <StructuredData data={[getOrganizationSchema(), getWebSiteSchema()]} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BuyMeACoffee />
      </body>
    </html>
  );
}
