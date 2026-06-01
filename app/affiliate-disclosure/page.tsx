import type { Metadata } from "next";
import { getPageContent } from "@/lib/content";
import PageContentRenderer from "@/components/PageContent";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "How SwiftHerb earns from iHerb via Impact.com, direct product links today, and planned Impact tracking for the AI Advisor.",
};

export default function AffiliateDisclosurePage() {
  const content = getPageContent("affiliate-disclosure");

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Content not found.</p>
      </div>
    );
  }

  return <PageContentRenderer content={content} />;
}
