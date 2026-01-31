"use client";

import Link from "next/link";

/**
 * Buy Me a Coffee button - fixed at bottom right
 */
export default function BuyMeACoffee() {
  return (
    <Link
      href="https://buymeacoffee.com/guymo"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Buy me a coffee"
    >
      <div className="flex items-center gap-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-3 border border-gray-200 hover:border-green-400">
        {/* Coffee icon */}
        <svg
          className="w-5 h-5 text-amber-600 group-hover:text-amber-700 transition-colors"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 21h18v-2H2v2zm1-4h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2zm0-11h16v9H3V6zm12 5V8h-4v3h4z" />
        </svg>
        <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
          Buy me a coffee
        </span>
      </div>
    </Link>
  );
}
