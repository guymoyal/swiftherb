import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import PageContentRenderer from "@/components/PageContent";

export const metadata: Metadata = {
  title: "Editorial Standards | SwiftHerb",
  description:
    "How SwiftHerb presents supplement information, outbound links to iHealth retailers, and our approach to transparency.",
};

export default function EditorialStandardsPage() {
  const content = getPageContent("editorial-standards");

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Content not found.</p>
      </div>
    );
  }

  return <PageContentRenderer content={content} />;
}
