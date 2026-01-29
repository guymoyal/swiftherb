import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import PageContentRenderer from "@/components/PageContent";

export const metadata: Metadata = {
  title: "Privacy Policy - SwiftHerb",
  description: "SwiftHerb Privacy Policy - Learn how we protect your data and privacy.",
};

export default function PrivacyPage() {
  const content = getPageContent("privacy");

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Content not found.</p>
      </div>
    );
  }

  return <PageContentRenderer content={content} />;
}
