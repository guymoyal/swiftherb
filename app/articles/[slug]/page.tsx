import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import ArticleContent from "@/components/ArticleContent";
import StructuredData from "@/components/StructuredData";
import { getArticleSchema, getBreadcrumbSchema } from "@/lib/seo";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://swiftherb.com";

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

  const articleUrl = `${SITE_URL}/articles/${slug}`;

  return {
    title: `${article.title} | SwiftHerb`,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      type: "article",
      url: articleUrl,
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedDate,
      modifiedTime: article.lastUpdated || article.publishedDate,
      authors: [article.author.name],
      images: [
        {
          url: article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      section: article.category,
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.featuredImage],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const relatedArticles = article ? getRelatedArticles(slug, 3) : [];

  if (!article) {
    notFound();
  }

  const breadcrumbs = getBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Articles", url: `${SITE_URL}/articles` },
    { name: article.title, url: `${SITE_URL}/articles/${slug}` },
  ]);

  return (
    <>
      <StructuredData data={[getArticleSchema(article), breadcrumbs]} />
      <ArticleContent article={article} relatedArticles={relatedArticles} />
    </>
  );
}
