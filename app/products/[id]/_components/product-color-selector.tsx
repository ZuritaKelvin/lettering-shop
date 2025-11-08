"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { addToCart, getCartItems } from "@/app/cart/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { updateCartCount } from "@/lib/cart-sync";

interface ProductColor {
  id: string;
  color: string;
  image_url: string | null;
  stock: number;
}

interface ProductColorSelectorProps {
  productColors: ProductColor[];
}

export function ProductColorSelector({
  productColors,
}: ProductColorSelectorProps) {
  const [selectedColorId, setSelectedColorId] = useState<string>(
    productColors[0]?.id || ""
  );
  const [isLoading, setIsLoading] = useState(false);

  const selectedColor = productColors.find((c) => c.id === selectedColorId);
  const totalStock = productColors.reduce((sum, color) => sum + color.stock, 0);

  const handleAddToCart = async () => {
    if (!selectedColorId) {
      toast.error("Please select a color");
      return;
    }

    setIsLoading(true);

    try {
      const result = await addToCart({
        productColorId: selectedColorId,
        quantity: 1,
      });

      if (result.success) {
        toast.success("Product added to cart!");
        
        // Update cart count in cache for header badge
        const cartResult = await getCartItems();
        if (cartResult.success && cartResult.data) {
          const totalItems = cartResult.data.reduce(
            (sum: number, item: any) => sum + item.quantity,
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
    <div className="space-y-6">
      {/* Available Colors */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground/90">
          Available Colors & Stock
        </p>
        <div className="grid grid-cols-2 gap-3">
          {productColors.map((colorOption) => (
            <button
              key={colorOption.id}
              onClick={() => setSelectedColorId(colorOption.id)}
              disabled={colorOption.stock === 0}
              className={cn(
                "flex items-center justify-between p-3 border rounded-lg transition-all",
                selectedColorId === colorOption.id
                  ? "border-purple-600 dark:border-purple-400 bg-purple-50 dark:bg-purple-950/30 ring-2 ring-purple-600 dark:ring-purple-400"
                  : "hover:border-purple-300 dark:hover:border-purple-700",
                colorOption.stock === 0 && "opacity-50 cursor-not-allowed"
              )}
            >
              <span className="text-sm font-medium capitalize">
                {colorOption.color}
              </span>
              <Badge variant="outline" className="text-xs">
                {colorOption.stock} left
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
        disabled={totalStock === 0 || !selectedColor || isLoading}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        {isLoading
          ? "Adding..."
          : totalStock > 0
          ? "Add to Cart"
          : "Out of Stock"}
      </Button>
    </div>
  );
}
