import Link from "next/link";

/**
 * Footer component with legal links and affiliate disclosure
 */
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link href="/" className="hover:text-green-600 transition-colors font-medium">
              Get recommendations
            </Link>
            <Link href="/articles" className="hover:text-green-600 transition-colors">
              Articles
            </Link>
            <Link href="/compare" className="hover:text-green-600 transition-colors">
              Compare
            </Link>
            <Link href="/how-it-works" className="hover:text-green-600 transition-colors">
              How It Works
            </Link>
            <Link href="/faq" className="hover:text-green-600 transition-colors">
              FAQ
            </Link>
            <Link href="/about" className="hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-green-600 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-green-600 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-green-600 transition-colors">
              Terms
            </Link>
            <Link href="/affiliate-disclosure" className="hover:text-green-600 transition-colors">
              Disclosure
            </Link>
            <span className="text-gray-400">•</span>
            <span>© {new Date().getFullYear()} SwiftHerb</span>
          </div>
          <div className="flex flex-col sm:items-end gap-2">
            <Link
              href="/"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Get personalized recommendations →
            </Link>
            <div className="flex gap-3 text-gray-400" aria-label="Social links">
              <a href="https://twitter.com/swiftherb" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors" aria-label="Twitter">Twitter</a>
              <a href="https://github.com/swiftherb" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors" aria-label="GitHub">GitHub</a>
            </div>
            <p className="text-xs text-gray-500">Not medical advice. Commissions may be earned.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
