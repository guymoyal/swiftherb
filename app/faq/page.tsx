import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { getFAQSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about SwiftHerb, our AI recommendations, and how we work with iHerb.",
};

const faqs = [
  {
    question: "What is SwiftHerb?",
    answer: "SwiftHerb is an AI-powered pharmacist assistant that helps you find the best natural health products and supplements. Our AI analyzes your needs and recommends personalized products from iHerb.",
  },
  {
    question: "How does SwiftHerb recommend products?",
    answer: "SwiftHerb uses advanced AI to understand your health goals, symptoms, or questions. Based on your input, our AI pharmacist suggests relevant supplements, vitamins, and natural health products.",
  },
  {
    question: "Are the recommendations medical advice?",
    answer: "No. SwiftHerb provides informational recommendations only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a healthcare provider before starting any supplement regimen.",
  },
  {
    question: "Where do the products come from?",
    answer: "SwiftHerb recommends products available on iHerb, a trusted online retailer of natural health products. We use affiliate links, which means we may earn a commission if you make a purchase.",
  },
  {
    question: "Is SwiftHerb free to use?",
    answer: "Yes, SwiftHerb is completely free to use. You can chat with our AI pharmacist assistant and get product recommendations at no cost.",
  },
  {
    question: "Why does SwiftHerb recommend multiple products?",
    answer: "We suggest wellness stacks (5–10 products) that work together. Many supplements are more effective in combination, and a complete stack better supports your goals than a single product.",
  },
  {
    question: "Do I pay more when using your links?",
    answer: "No. Prices on iHerb are the same whether you use our links or not. We earn a commission from iHerb at no extra cost to you, which helps us keep SwiftHerb free.",
  },
];

export default function FAQPage() {
  return (
    <>
      <StructuredData data={getFAQSchema(faqs)} />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Quick answers about SwiftHerb and our AI supplement recommendations.
          </p>
          <dl className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <dt className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </dt>
                <dd className="text-gray-700 leading-relaxed">{faq.answer}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try the AI Assistant
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
