/**
 * Simple in-memory cache for API responses
 * In production, consider using Redis or Cloudflare KV for distributed caching
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

/**
 * Simple in-memory cache implementation
 * Provides TTL-based caching with automatic expiration
 */
export class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number = 100; // Maximum number of cache entries

  /**
   * Get a value from cache if it exists and hasn't expired
   * 
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set a value in cache with TTL
   * 
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Time to live in milliseconds (default: 5 minutes)
   */
  set<T>(key: string, value: T, ttl: number = 5 * 60 * 1000): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove a specific cache entry
   * 
   * @param key - Cache key to remove
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Generate a cache key from a message
   * 
   * @param messages - Array of messages
   * @param userMessage - Current user message
   * @returns Cache key string
   */
  static generateKey(
    messages: Array<{ role: string; content: string }>,
    userMessage: string
  ): string {
    // Create a simple hash from the conversation
    const conversation = JSON.stringify([...messages, { role: "user", content: userMessage }]);
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < conversation.length; i++) {
      const char = conversation.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `ai_response_${Math.abs(hash)}`;
  }
}

// Export singleton instance
export const cache = new SimpleCache();
