import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import PageContentRenderer from "@/components/PageContent";

export const metadata: Metadata = {
  title: "About Us - SwiftHerb",
  description: "Learn about SwiftHerb, our mission, and how we help you discover natural health products.",
};

export default function AboutPage() {
  const content = getPageContent("about");

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Content not found.</p>
      </div>
    );
  }

  return <PageContentRenderer content={content} />;
}
