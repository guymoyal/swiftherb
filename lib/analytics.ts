/**
 * Basic analytics and tracking utilities
 * Uses localStorage for client-side tracking
 * In production, consider integrating with a proper analytics service
 */

interface ClickEvent {
  productId: string;
  productTitle: string;
  timestamp: number;
  affiliateLink: string;
}

const STORAGE_KEY = "swiftherb_analytics";
const MAX_EVENTS = 1000; // Limit stored events

/**
 * Track a product link click
 * 
 * @param productId - Product identifier
 * @param productTitle - Product title
 * @param affiliateLink - The affiliate link that was clicked
 */
export function trackProductClick(
  productId: string,
  productTitle: string,
  affiliateLink: string
): void {
  try {
    const event: ClickEvent = {
      productId,
      productTitle,
      timestamp: Date.now(),
      affiliateLink,
    };

    // Get existing events
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: ClickEvent[] = stored ? JSON.parse(stored) : [];

    // Add new event
    events.push(event);

    // Keep only the most recent events
    if (events.length > MAX_EVENTS) {
      events.splice(0, events.length - MAX_EVENTS);
    }

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("Product click tracked:", event);
    }
  } catch (error) {
    console.error("Failed to track click:", error);
  }
}

/**
 * Get click statistics
 * 
 * @returns Object with click statistics
 */
export function getClickStats(): {
  totalClicks: number;
  uniqueProducts: number;
  recentClicks: ClickEvent[];
} {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const events: ClickEvent[] = stored ? JSON.parse(stored) : [];

    const uniqueProducts = new Set(events.map((e) => e.productId)).size;
    const recentClicks = events.slice(-10).reverse(); // Last 10 clicks

    return {
      totalClicks: events.length,
      uniqueProducts,
      recentClicks,
    };
  } catch (error) {
    console.error("Failed to get click stats:", error);
    return {
      totalClicks: 0,
      uniqueProducts: 0,
      recentClicks: [],
    };
  }
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear analytics:", error);
  }
}
