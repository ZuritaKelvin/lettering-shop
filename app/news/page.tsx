import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Calendar } from "lucide-react";

export default async function NewsPage() {
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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <Newspaper className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Latest News
            </h1>
            <p className="text-lg text-gray-600">
              Stay updated with the latest from Lettering Shop
            </p>
          </div>

          {/* News Articles */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>October 14, 2025</span>
                </div>
                <CardTitle className="text-2xl">
                  Welcome to Lettering Shop! 🎉
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're excited to launch our new e-commerce platform featuring
                  unique clothing with beautiful lettering and calligraphy
                  designs. Stay tuned for more updates!
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Coming Soon</span>
                </div>
                <CardTitle className="text-2xl">
                  New Collection Preview ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get ready for our upcoming collection featuring exclusive
                  designs from talented calligraphy artists. More details
                  coming soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
