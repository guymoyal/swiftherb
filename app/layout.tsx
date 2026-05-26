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
    default: "SwiftHerb",
    template: "%s | SwiftHerb",
  },
  description:
    "SwiftHerb helps you browse supplements on iHerb: a simple catalog, short articles, and a chat assistant. Not medical advice. Read labels on iHerb before you buy.",
  keywords: [
    "supplements",
    "vitamins",
    "iHerb",
    "supplement guide",
    "wellness",
    "natural health",
  ],
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
    title: "SwiftHerb",
    description:
      "Browse supplements on iHerb with a little help from our catalog and chat. We are not doctors; always double-check the listing before you order.",
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
    title: "SwiftHerb",
    description: "Supplement discovery for iHerb: catalog, articles, and a chat assistant.",
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
    other: {
      "verify-admitad": "53694d76ea",
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
        <meta name="verify-admitad" content="53694d76ea" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="SwiftHerb llms.txt" />
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
