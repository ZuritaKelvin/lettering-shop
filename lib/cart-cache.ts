import { z } from "zod";

// Cart item schema
export const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  image: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  total: z.number(),
  updatedAt: z.string(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;

const CART_CACHE_KEY = "lettering-shop-cart";

/**
 * Get cart from localStorage
 */
export function getCartFromCache(): Cart {
  if (typeof window === "undefined") {
    return { items: [], total: 0, updatedAt: new Date().toISOString() };
  }

  try {
    const cached = localStorage.getItem(CART_CACHE_KEY);
    if (!cached) {
      return { items: [], total: 0, updatedAt: new Date().toISOString() };
    }

    const parsed = JSON.parse(cached);
    return CartSchema.parse(parsed);
  } catch (error) {
    console.error("Error reading cart from cache:", error);
    return { items: [], total: 0, updatedAt: new Date().toISOString() };
  }
}

/**
 * Save cart to localStorage
 */
export function saveCartToCache(cart: Cart): void {
  if (typeof window === "undefined") return;

  try {
    const cartWithTimestamp = {
      ...cart,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CART_CACHE_KEY, JSON.stringify(cartWithTimestamp));
  } catch (error) {
    console.error("Error saving cart to cache:", error);
  }
}

/**
 * Add item to cart
 */
export function addItemToCart(item: CartItem): Cart {
  const cart = getCartFromCache();
  
  // Check if item already exists
  const existingItemIndex = cart.items.findIndex((i) => i.id === item.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity if item exists
    cart.items[existingItemIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.items.push(item);
  }
  
  // Recalculate total
  cart.total = calculateCartTotal(cart.items);
  
  saveCartToCache(cart);
  return cart;
}

/**
 * Remove item from cart
 */
export function removeItemFromCart(itemId: string): Cart {
  const cart = getCartFromCache();
  cart.items = cart.items.filter((item) => item.id !== itemId);
  cart.total = calculateCartTotal(cart.items);
  
  saveCartToCache(cart);
  return cart;
}

/**
 * Update item quantity
 */
export function updateItemQuantity(itemId: string, quantity: number): Cart {
  const cart = getCartFromCache();
  const itemIndex = cart.items.findIndex((item) => item.id === itemId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
  }
  
  cart.total = calculateCartTotal(cart.items);
  saveCartToCache(cart);
  return cart;
}

/**
 * Clear cart
 */
export function clearCart(): Cart {
  const emptyCart: Cart = {
    items: [],
    total: 0,
    updatedAt: new Date().toISOString(),
  };
  
  saveCartToCache(emptyCart);
  return emptyCart;
}

/**
 * Calculate cart total
 */
function calculateCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Get cart item count
 * Now reads from the synced cache instead of the full cart
 */
export function getCartItemCount(): number {
  if (typeof window === "undefined") return 0;
  
  try {
    const count = localStorage.getItem("lettering-shop-cart-count");
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    console.error("Error reading cart count:", error);
    return 0;
  }
}
