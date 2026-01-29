import Link from "next/link";

/**
 * Footer component with legal links and affiliate disclosure
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/privacy" className="hover:text-green-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-green-600 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-400">•</span>
            <span>© {new Date().getFullYear()} SwiftHerb</span>
          </div>
          <div className="text-xs text-gray-500">
            Not medical advice. Commissions may be earned.
          </div>
        </div>
      </div>
    </footer>
  );
}
