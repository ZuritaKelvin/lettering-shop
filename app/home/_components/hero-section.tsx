"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  userName?: string | null;
}

export function HeroSection({ userName }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  return (
    <section className="relative text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/backgroundhero.png')",
        }}
      />
      {/* Overlay minimalista para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/90 to-slate-900/85" />

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
            Welcome, {userName || "Friend"}!
          </div>

          {/* Main Hero Text */}
          <h1
            className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Where Art Meets Fashion
          </h1>

          <p className="text-xl md:text-2xl text-slate-200 max-w-2xl mx-auto">
            Discover unique clothing pieces adorned with beautiful lettering and
            calligraphy. Each design tells a story.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-100 gap-2 text-lg px-8"
              >
                Explore Collection
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/news">
              <Button
                size="lg"
                variant="outline"
                className="border-white/80 text-white hover:bg-white/10 text-lg px-8"
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
            fill="currentColor"
            className="text-background"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
}
