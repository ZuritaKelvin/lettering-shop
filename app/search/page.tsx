import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default async function SearchPage() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Search Products
            </h1>
            <p className="text-lg text-muted-foreground">
              Find your perfect lettering design
            </p>
          </div>

          {/* Search Input */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for products..."
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Message */}
          <Card className="border-2 border-dashed border-purple-300 dark:border-purple-700 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
              <Search className="h-16 w-16 text-purple-400" />
              <h2 className="text-2xl font-bold text-foreground">
                Search Coming Soon
              </h2>
              <p className="text-muted-foreground text-center max-w-md">
                We're building a powerful search feature to help you find the
                perfect products. Stay tuned!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
