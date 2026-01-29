import { PageContent } from "@/lib/content";
import { formatContent } from "@/lib/content";
import Link from "next/link";

interface PageContentProps {
  content: PageContent;
}

/**
 * Renders page content from JSON data
 * Formats sections with proper typography
 */
export default function PageContentRenderer({ content }: PageContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            {content.title}
          </h1>
          {content.lastUpdated && (
            <p className="text-gray-600 text-sm">
              Last updated: {content.lastUpdated}
            </p>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          {content.sections.map((section, index) => {
            const paragraphs = formatContent(section.content);
            
            return (
              <section
                key={index}
                className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 border-b border-green-100 pb-2">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {paragraphs.map((paragraph, pIndex) => {
                    // Check if paragraph is a list item
                    if (paragraph.trim().startsWith("•") || paragraph.trim().startsWith("-")) {
                      return (
                        <div key={pIndex} className="flex items-start">
                          <span className="text-green-600 mr-2 mt-1">•</span>
                          <span className="flex-1">{paragraph.replace(/^[•-]\s*/, "")}</span>
                        </div>
                      );
                    }
                    // Check if paragraph is bold
                    if (paragraph.includes("**")) {
                      const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={pIndex} className="text-base sm:text-lg">
                          {parts.map((part, partIndex) => {
                            if (part.startsWith("**") && part.endsWith("**")) {
                              return (
                                <strong
                                  key={partIndex}
                                  className="font-bold text-gray-900"
                                >
                                  {part.slice(2, -2)}
                                </strong>
                              );
                            }
                            return <span key={partIndex}>{part}</span>;
                          })}
                        </p>
                      );
                    }
                    // Regular paragraph
                    return (
                      <p key={pIndex} className="text-base sm:text-lg">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Back to Home Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
