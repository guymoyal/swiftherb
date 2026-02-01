"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * Logo component displaying the SwiftHerb logo image
 * Fixed height of 44px with responsive width
 * Links to home page and resets conversation
 */
export default function Logo() {
  const handleLogoClick = () => {
    // Dispatch custom event to reset conversation
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("swiftherb:reset-conversation"));
    }
  };

  return (
    <Link href="/" onClick={handleLogoClick} className="flex items-center hover:opacity-80 transition-opacity">
      <Image
        src="/images/swiftherb-logo.png"
        alt="SwiftHerb Logo"
        width={220}
        height={44}
        className="h-[44px] w-auto object-contain"
        priority
      />
    </Link>
  );
}
