/**
 * Error handling utilities
 * Provides consistent error handling and user-friendly error messages
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  timestamp: number;
  context?: Record<string, unknown>;
}

/**
 * Logs errors for monitoring (in production, send to error tracking service)
 * 
 * @param error - Error object or message
 * @param context - Additional context information
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  const errorInfo: ErrorInfo = {
    message: error instanceof Error ? error.message : String(error),
    code: error instanceof Error ? error.name : "UNKNOWN_ERROR",
    timestamp: Date.now(),
    context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Error logged:", errorInfo);
  }

  // In production, send to error tracking service (e.g., Sentry)
  // Example:
  // if (typeof window !== 'undefined' && window.Sentry) {
  //   window.Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Gets a user-friendly error message from an error
 * 
 * @param error - Error object or message
 * @returns User-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // API errors
    if (message.includes("network") || message.includes("fetch")) {
      return "Network error. Please check your internet connection and try again.";
    }

    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    if (message.includes("401") || message.includes("authentication")) {
      return "Authentication failed. Please check your API configuration.";
    }

    if (message.includes("429") || message.includes("rate limit")) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (message.includes("500") || message.includes("server")) {
      return "Server error. Please try again later.";
    }

    // Return original message if it's already user-friendly
    if (message.length < 100 && !message.includes("error:")) {
      return error.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Handles errors consistently across the application
 * 
 * @param error - Error object or message
 * @param context - Additional context
 * @returns User-friendly error message
 */
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): string {
  logError(error, context);
  return getUserFriendlyError(error);
}
