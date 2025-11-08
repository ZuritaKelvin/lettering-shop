"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart, getCartItems } from "@/app/cart/actions";
import { toast } from "sonner";
import { updateCartCount } from "@/lib/cart-sync";

interface AddToCartButtonProps {
  productColorId: string;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

export function AddToCartButton({
  productColorId,
  disabled = false,
  className,
  fullWidth = false,
  size = "default",
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      const result = await addToCart({
        productColorId,
        quantity: 1,
      });

      if (result.success) {
        toast.success("Product added to cart!");

        // Update cart count in cache for header badge
        const cartResult = await getCartItems();
        if (cartResult.success && cartResult.data) {
          const totalItems = cartResult.data.reduce(
            (sum: number, item) => sum + item.quantity,
            0
          );
          updateCartCount(totalItems);
        }
      } else {
        toast.error(result.error || "Failed to add to cart");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || isLoading}
      className={className}
      size={size}
      style={fullWidth ? { width: "100%" } : undefined}
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
