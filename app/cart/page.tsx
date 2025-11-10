"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import {
  getCartItems,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "@/app/cart/actions";
import { toast } from "sonner";
import { updateCartCount } from "@/lib/cart-sync";

interface CartItem {
  id: string;
  quantity: number;
  created_at: string;
  product_color_id: string;
  product_colors: {
    id: string;
    color: string;
    image_url: string | null;
    stock: number;
    product_id: string;
    products: {
      id: string;
      name: string;
      description: string | null;
      price: number;
      delivery_date: string;
    };
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCart = async () => {
    setIsLoading(true);
    const result = await getCartItems();
    if (result.success && result.data) {
      const items = result.data as CartItem[];
      setCartItems(items);

      // Update cart count in cache for header badge
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      updateCartCount(totalItems);
    } else {
      toast.error(result.error || "Failed to load cart");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemoveItem = async (itemId: string) => {
    const result = await removeFromCart(itemId);
    if (result.success) {
      toast.success("Item removed from cart");
      loadCart();
    } else {
      toast.error(result.error || "Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    const result = await updateCartItem({
      cartItemId: itemId,
      quantity: newQuantity,
    });
    if (result.success) {
      loadCart();
    } else {
      toast.error(result.error || "Failed to update quantity");
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (result.success) {
      toast.success("Cart cleared");
      loadCart();
    } else {
      toast.error(result.error || "Failed to clear cart");
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    toast.info("Checkout functionality coming soon!");
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.product_colors.products.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-pulse mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shopping Cart
            </h1>
            <p className="text-lg text-muted-foreground">
              {cartItems.length > 0
                ? `${cartItems.length} item${
                    cartItems.length !== 1 ? "s" : ""
                  } in your cart`
                : "Your cart is empty"}
            </p>
          </div>

          {/* Cart Content */}
          {cartItems.length === 0 ? (
            <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <ShoppingBag className="h-16 w-16 text-purple-400" />
                <h2 className="text-2xl font-bold text-foreground">
                  Your cart is empty
                </h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Start shopping and add some amazing products to your cart!
                </p>
                <Button
                  onClick={() => router.push("/products")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2 mt-4"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-foreground">
                    Cart Items
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Clear Cart
                  </Button>
                </div>

                {cartItems.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={handleUpdateQuantity}
                  />
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>Review your order details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">€{total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg text-purple-600">
                          €{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                      size="lg"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => router.push("/products")}
                      className="w-full"
                    >
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Cart Item Component
function CartItemCard({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}) {
  const product = item.product_colors.products;
  const color = item.product_colors;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          {color.image_url ? (
            <div className="w-24 h-24 bg-muted/30 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
              <Image
                src={color.image_url}
                alt={product.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
            </div>
          )}

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-foreground">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground capitalize">
                  Color: {color.color}
                </p>
                <p className="text-xs text-muted-foreground/80">
                  Delivery:{" "}
                  {new Date(product.delivery_date).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-12 text-center font-medium">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= color.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  €{product.price.toFixed(2)} each
                </p>
                <p className="font-semibold text-purple-600">
                  €{(product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
