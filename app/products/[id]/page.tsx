import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getSupabaseServerAdminClient } from "@/supabase/src/clients/server-admin-client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductColorSelector } from "./_components/product-color-selector";

interface ProductColor {
  id: string;
  color: string;
  image_url: string | null;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  delivery_date: string;
  product_colors: ProductColor[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  // Use admin client to bypass RLS
  const supabase = getSupabaseServerAdminClient();
  const productId = (await params).id;

  const { data: product } = await supabase
    .from("products")
    .select("name, description, price, product_colors(image_url)")
    .eq("id", productId)
    .single<Product>();

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  const firstImage = product.product_colors?.[0]?.image_url;

  return {
    title: product.name,
    description:
      product.description || `${product.name} - Diseño único de lettering`,
    openGraph: {
      title: `${product.name} | Lettering Shop`,
      description:
        product.description || `${product.name} - Diseño único de lettering`,
      images: firstImage ? [{ url: firstImage }] : [],
      type: "website",
    },
  };
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Use admin client to bypass RLS
  const supabase = getSupabaseServerAdminClient();
  const productId = (await params).id;

  // Fetch single product with its colors
  const { data: product, error: productError } = await supabase
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
    )
    .eq("id", productId)
    .single<Product>();

  if (productError || !product) {
    notFound();
  }

  const firstColor = product.product_colors[0];
  const totalStock = product.product_colors.reduce(
    (sum, c) => sum + c.stock,
    0
  );

  // Schema.org JSON-LD for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description || `${product.name} - Diseño único de lettering`,
    image: firstColor?.image_url || "",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability:
        totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/products/${product.id}`,
    },
    brand: {
      "@type": "Brand",
      name: "Lettering Shop",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Back Button */}
            <Link href="/products">
              <Button
                variant="ghost"
                className="gap-2"
                aria-label="Volver a productos"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver a Productos
              </Button>
            </Link>

            {/* Product Details Card */}
            <Card className="overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <CardHeader className="p-0">
                  {firstColor?.image_url && (
                    <div className="relative w-full h-96 md:h-full min-h-[400px] bg-muted/30">
                      <Image
                        src={firstColor.image_url}
                        alt={`${product.name} - Diseño de lettering único en ${firstColor.color}`}
                        fill
                        className="object-contain"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        quality={90}
                      />
                    </div>
                  )}
                </CardHeader>

                {/* Product Information */}
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                      {product.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          product.product_colors.some((c) => c.stock > 0)
                            ? "default"
                            : "destructive"
                        }
                      >
                        {product.product_colors.some((c) => c.stock > 0)
                          ? `${product.product_colors.reduce(
                              (sum, c) => sum + c.stock,
                              0
                            )} disponibles`
                          : "Agotado"}
                      </Badge>
                    </div>
                  </div>

                  <Separator />

                  {/* Price */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Precio</p>
                    <p className="text-4xl font-bold text-primary">
                      €{product.price.toFixed(2)}
                    </p>
                  </div>

                  <Separator />

                  {/* Description */}
                  {product.description && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground/90">
                        Descripción
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  )}

                  <Separator />

                  {/* Delivery Information */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-foreground/90">
                      <Truck className="h-5 w-5" />
                      <span className="text-sm font-semibold">
                        Información de Envío
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Entrega estimada:{" "}
                        {new Date(product.delivery_date).toLocaleDateString(
                          "es-ES",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Color Selector and Add to Cart */}
                  <ProductColorSelector
                    productColors={product.product_colors}
                  />
                </CardContent>
              </div>
            </Card>

            {/* Additional Product Info */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Package className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Calidad Premium</h3>
                  <p className="text-sm text-muted-foreground">
                    Materiales de alta calidad y excelente confección
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <Truck className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Envío Rápido</h3>
                  <p className="text-sm text-muted-foreground">
                    Enviado en 24 horas desde tu pedido
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  <h3 className="font-semibold">Pago Seguro</h3>
                  <p className="text-sm text-muted-foreground">
                    Procesamiento de pagos seguro y confiable
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
