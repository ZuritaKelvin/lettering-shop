"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { sideHeaderConfig } from "@/config/sideheader.config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { getCartItemCount } from "@/lib/cart-cache";
import { ThemeToggle } from "@/components/theme-toggle";
import { createBrowserClient } from "@supabase/ssr";

export function SiteHeader() {
  const pathname = usePathname();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Hide header on auth pages
  const isAuthPage = pathname?.startsWith("/auth");

  // Memoize Supabase client creation (React 19 best practice)
  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
      ),
    []
  );

  // Filter routes by position (memoized for React 19 optimization)
  const leftRoutes = useMemo(
    () =>
      sideHeaderConfig.routes.filter(
        (route) => route.position === "left" && route.type === "link"
      ),
    []
  );

  const rightRoutes = useMemo(
    () => sideHeaderConfig.routes.filter((route) => route.position === "right"),
    []
  );

  // Check authentication status
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (mounted) {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setIsAuthenticated(!!session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  // Update cart count on mount and when pathname changes
  useEffect(() => {
    setCartItemCount(getCartItemCount());
  }, [pathname]);

  // Don't render header on auth pages
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: Logo + App Name + Navigation Links */}
        <div className="flex items-center gap-6">
          {/* Logo and Name */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
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
                      ? "text-primary bg-secondary"
                      : "text-foreground/80 hover:text-primary hover:bg-accent"
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
          {/* Theme Toggle */}
          <ThemeToggle />
          {rightRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.path;
            const isCart = route.name === "Cart";
            const isProfile = route.name === "Profile";

            // Skip profile icon if user is not authenticated - we'll show auth buttons instead
            if (isProfile && !isAuthenticated) {
              return null;
            }

            return (
              <div key={route.path} className="relative">
                <Link href={route.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(isActive && "bg-primary hover:bg-primary/90")}
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

          {/* Auth buttons for unauthenticated users */}
          {!isLoading && !isAuthenticated && (
            <>
              <Link href="/auth/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t bg-background px-4 py-2">
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
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {route.name}
              </Link>
            );
          })}

          {/* Right routes for mobile */}
          {rightRoutes.map((route) => {
            const Icon = route.icon;
            const isActive = pathname === route.path;
            const isProfile = route.name === "Profile";

            // Skip profile icon if user is not authenticated
            if (isProfile && !isAuthenticated) {
              return null;
            }

            return (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors rounded-md relative",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                {route.name}
                {/* Cart Badge for mobile */}
                {route.name === "Cart" && cartItemCount > 0 && (
                  <span className="absolute -top-0 -right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Auth button for mobile unauthenticated users */}
          {!isLoading && !isAuthenticated && (
            <Link
              href="/auth/sign-in"
              className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-primary transition-colors rounded-md"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
