import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Calendar, Eye } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "./_components/add-to-cart-button";
import { getSupabaseServerAdminClient } from "@/supabase/src/clients/server-admin-client";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Explora nuestra colección de ropa única con hermosos diseños de lettering y caligrafía. Prendas premium de alta calidad.",
  keywords: [
    "productos",
    "ropa lettering",
    "camisetas",
    "diseños únicos",
    "moda",
  ],
  openGraph: {
    title: "Productos | Lettering Shop",
    description:
      "Explora nuestra colección de ropa única con hermosos diseños de lettering",
    type: "website",
  },
};

export default async function ProductsPage() {
  // Use admin client to bypass RLS for public product viewing
  const supabase = getSupabaseServerAdminClient();

  // Fetch products with their colors
  const { data: products, error: productsError } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      delivery_date,
      product_colors (
        id,
        color,
        image_url,
        stock
      )
    `
    );

  if (productsError) {
    console.error("Error fetching products:", productsError);
    // En producción, considera usar un servicio de logging como Sentry
  }

  const availableProducts =
    products?.filter(
      (product) => product.product_colors && product.product_colors.length > 0
    ) || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full">
              <Package className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Nuestros Productos
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubre ropa única con hermosos diseños de lettering
            </p>
          </div>

          {/* Products Grid */}
          {availableProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableProducts.map((product) => {
                const firstColor = product.product_colors[0];
                const totalStock = product.product_colors.reduce(
                  (sum, color) => sum + color.stock,
                  0
                );

                return (
                  <HoverCard key={product.id} openDelay={200}>
                    <HoverCardTrigger asChild>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                        <CardHeader className="p-0">
                          {firstColor?.image_url && (
                            <div className="relative w-full h-64 bg-muted/30">
                              <Image
                                src={firstColor.image_url}
                                alt={`${product.name} - Diseño de lettering único`}
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                loading="lazy"
                                quality={85}
                              />
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                          <div>
                            <h3 className="text-xl font-bold text-foreground">
                              {product.name}
                            </h3>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-primary">
                              €{product.price.toFixed(2)}
                            </span>
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              <Calendar className="h-3 w-3" />
                              {new Date(
                                product.delivery_date
                              ).toLocaleDateString()}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm font-medium text-foreground/90">
                              Colores Disponibles:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {product.product_colors.map((colorOption) => (
                                <Badge
                                  key={colorOption.id}
                                  variant="outline"
                                  className="capitalize"
                                >
                                  {colorOption.color} ({colorOption.stock}{" "}
                                  quedan)
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="p-6 pt-0 gap-2">
                          <AddToCartButton
                            productColorId={firstColor.id}
                            disabled={totalStock === 0}
                            className="flex-1"
                          />
                          <Link href={`/products/${product.id}`}>
                            <Button
                              variant="outline"
                              size="icon"
                              aria-label={`Ver detalles de ${product.name}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80" side="top">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">
                          {product.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {product.description}
                        </p>
                        <div className="flex items-center pt-2">
                          <Calendar className="mr-2 h-4 w-4 opacity-70" />
                          <span className="text-xs text-muted-foreground">
                            Entrega:{" "}
                            {new Date(product.delivery_date).toLocaleDateString(
                              "es-ES"
                            )}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Haz clic en el icono del ojo para ver todos los
                          detalles
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          ) : (
            <Card className="border-2 border-dashed bg-card/50">
              <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
                <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-2xl font-bold text-foreground">
                  No Hay Productos Disponibles
                </h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Estamos preparando una colección increíble de prendas únicas
                  con hermosos diseños de lettering y caligrafía. ¡Vuelve
                  pronto!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
