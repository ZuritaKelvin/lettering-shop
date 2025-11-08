"use client";

/**
 * Synchronize cart count to localStorage for the header badge
 * This is a simplified cache that only stores the item count
 */

const CART_COUNT_KEY = "lettering-shop-cart-count";

export function updateCartCount(count: number): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(CART_COUNT_KEY, count.toString());
    // Dispatch event to notify header component
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("Error updating cart count:", error);
  }
}

export function getCartCount(): number {
  if (typeof window === "undefined") return 0;
  
  try {
    const count = localStorage.getItem(CART_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error("Error reading cart count:", error);
    return 0;
  }
}

export function clearCartCount(): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.removeItem(CART_COUNT_KEY);
    window.dispatchEvent(new Event("cart-updated"));
  } catch (error) {
    console.error("Error clearing cart count:", error);
  }
}
