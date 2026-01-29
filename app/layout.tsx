import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SwiftHerb - AI Pharmacist Assistant",
  description: "Low-latency AI pharmacist assistant for iHerb product recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
