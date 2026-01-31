"use client";

import Link from "next/link";
import Image from "next/image";
import { Article } from "@/lib/articles";
import { formatContent } from "@/lib/content";
import ArticleCard from "./ArticleCard";

interface ArticleContentProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleContent({ article, relatedArticles }: ArticleContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-8">
          {/* Category & Read Time */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">
              {article.category}
            </span>
            <span className="text-sm text-gray-500">{article.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            {article.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 mb-6">
            {article.excerpt}
          </p>

          {/* Author & Date */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-lg font-semibold">
                {article.author.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.author.bio}</p>
            </div>
            <div className="ml-auto text-sm text-gray-500">
              {new Date(article.publishedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
          </div>

          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative w-full h-64 sm:h-96 rounded-xl overflow-hidden my-8">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}
        </header>

        {/* Content Sections */}
        <div className="prose prose-lg max-w-none">
          {article.sections.map((section, index) => {
            const paragraphs = formatContent(section.content);

            return (
              <section key={index} className="mb-10">
                <h2 className="text-3xl font-bold mb-4 text-gray-900 border-b border-green-100 pb-2">
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

        {/* Tags */}
        {article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle.id} article={relatedArticle} />
              ))}
            </div>
          </div>
        )}

        {/* Back to Articles */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>
        </div>
      </article>
    </div>
  );
}
