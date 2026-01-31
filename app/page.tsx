import ChatInterface from "@/components/ChatInterface";
import StructuredData from "@/components/StructuredData";
import { getFAQSchema } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SwiftHerb - AI Pharmacist Assistant for Natural Health Products",
  description: "Get personalized supplement recommendations from our AI pharmacist assistant. Find the best vitamins, minerals, and natural health products from iHerb.",
  keywords: ["AI pharmacist", "supplement recommendations", "natural health", "vitamins", "supplements", "iHerb", "health products"],
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
];

export default function Home() {
  return (
    <>
      <StructuredData data={getFAQSchema(faqs)} />
      <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <main className="flex-1 overflow-hidden">
          <ChatInterface />
        </main>
      </div>
    </>
  );
}
