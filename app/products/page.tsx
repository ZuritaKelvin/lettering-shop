import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag } from "lucide-react";

export default async function ProductsPage() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Our Products
            </h1>
            <p className="text-lg text-gray-600">
              Discover unique clothing with beautiful lettering designs
            </p>
          </div>

          {/* Coming Soon Message */}
          <Card className="border-2 border-dashed border-purple-300 bg-white/50">
            <CardContent className="flex flex-col items-center justify-center py-16 space-y-4">
              <ShoppingBag className="h-16 w-16 text-purple-400" />
              <h2 className="text-2xl font-bold text-gray-700">
                Products Coming Soon
              </h2>
              <p className="text-gray-600 text-center max-w-md">
                We're curating an amazing collection of unique clothing items
                with beautiful lettering and calligraphy. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
