import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import PageContentRenderer from "@/components/PageContent";

export const metadata: Metadata = {
  title: "Terms of Service - SwiftHerb",
  description: "SwiftHerb Terms of Service - Read our terms and conditions.",
};

export default function TermsPage() {
  const content = getPageContent("terms");

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Content not found.</p>
      </div>
    );
  }

  return <PageContentRenderer content={content} />;
}
