import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ArticleContent from "@/components/ArticleContent";
import type { Metadata } from "next";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  
  if (!article) {
    return {
      title: "Article Not Found - SwiftHerb",
    };
  }

  return {
    title: `${article.title} - SwiftHerb`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const relatedArticles = article ? getRelatedArticles(slug, 3) : [];

  if (!article) {
    notFound();
  }

  return <ArticleContent article={article} relatedArticles={relatedArticles} />;
}
