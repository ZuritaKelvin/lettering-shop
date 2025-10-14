import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Heart } from "lucide-react";

export default async function HomePage() {
  const supabase = getSupabaseServerClient();

  // Get authenticated user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  // Get account information
  const { data: account } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/backgroundhero.png')",
          }}
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-600/85 to-orange-500/90" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-1/4 -left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Welcome Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Welcome, {account?.name || "Friend"}!
            </div>

            {/* Main Hero Text */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Where Art Meets
              <span className="block bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Fashion
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto">
              Discover unique clothing pieces adorned with beautiful lettering
              and calligraphy. Each design tells a story.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 gap-2 text-lg px-8"
                >
                  Explore Collection
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/news">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8"
                >
                  Latest News
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              fill="white"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Unique Designs
                </h3>
                <p className="text-gray-600">
                  Every piece features hand-crafted lettering and original
                  calligraphy artwork.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Premium Quality
                </h3>
                <p className="text-gray-600">
                  High-quality materials and printing ensure your clothing lasts
                  for years.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="pt-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Made with Love
                </h3>
                <p className="text-gray-600">
                  Each design is carefully created by talented artists who pour
                  their passion into every piece.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Express Yourself?
            </h2>
            <p className="text-lg text-gray-600">
              Join thousands of customers who have found their perfect style
              with our unique lettering designs.
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
