import Image from "next/image";

/**
 * Logo component displaying the SwiftHerb logo image
 * Fixed height of 44px with responsive width
 */
export default function Logo() {
  return (
    <div className="flex items-center">
      <Image
        src="/images/swiftherb-logo.png"
        alt="SwiftHerb Logo"
        width={220}
        height={44}
        className="h-[44px] w-auto object-contain"
        priority
      />
    </div>
  );
}
