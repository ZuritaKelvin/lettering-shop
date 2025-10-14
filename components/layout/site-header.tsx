"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { sideHeaderConfig } from "@/config/sideheader.config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { getCartItemCount } from "@/lib/cart-cache";

export function SiteHeader() {
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState(0);

  // Filter routes by position
  const leftRoutes = sideHeaderConfig.routes.filter(
    (route) => route.position === "left" && route.type === "link"
  );
  const rightRoutes = sideHeaderConfig.routes.filter(
    (route) => route.position === "right"
  );

  // Update cart count on mount and when pathname changes
  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo + App Name + Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {sideHeaderConfig.appName}
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {leftRoutes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.path;

              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    isActive
                      ? "text-purple-600 bg-purple-50"
                      : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {route.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2">
          {rightRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.path;
            const isCart = route.name === "Cart";

            return (
              <div key={route.path} className="relative">
                <Link href={route.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      isActive &&
                        "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{route.name}</span>
                  </Button>
                </Link>
                {/* Cart Badge */}
                {isCart && cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-white px-4 py-2">
        <nav className="flex items-center justify-around">
          {leftRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.path;

            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors rounded-md",
                  isActive
                    ? "text-purple-600"
                    : "text-gray-600 hover:text-purple-600"
                )}
              >
                <Icon className="h-5 w-5" />
                {route.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
