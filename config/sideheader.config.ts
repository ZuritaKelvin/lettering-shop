import { z } from "zod";
import { Home, Newspaper, Package, Search, User, ShoppingCart } from "lucide-react";

// Schema for route configuration
const RouteSchema = z.object({
  name: z.string(),
  path: z.string(),
  icon: z.any(),
  type: z.enum(["link", "button"]),
  position: z.enum(["left", "right"]),
});

const SideHeaderConfigSchema = z.object({
  appName: z.string(),
  routes: z.array(RouteSchema),
});

// Export route configuration
export const sideHeaderConfig = SideHeaderConfigSchema.parse({
  appName: process.env.NEXT_PUBLIC_APP_NAME || "Lettering Shop",
  routes: [
    {
      name: "Home",
      path: "/home",
      icon: Home,
      type: "link",
      position: "left",
    },
    {
      name: "News",
      path: "/news",
      icon: Newspaper,
      type: "link",
      position: "left",
    },
    {
      name: "Products",
      path: "/products",
      icon: Package,
      type: "link",
      position: "left",
    },
    {
      name: "Search",
      path: "/search",
      icon: Search,
      type: "button",
      position: "right",
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
      type: "button",
      position: "right",
    },
    {
      name: "Cart",
      path: "/cart",
      icon: ShoppingCart,
      type: "button",
      position: "right",
    },
  ],
});

export type RouteConfig = z.infer<typeof RouteSchema>;
export type SideHeaderConfig = z.infer<typeof SideHeaderConfigSchema>;
