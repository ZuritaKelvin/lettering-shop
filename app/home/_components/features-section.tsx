import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Heart } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Unique Designs
              </h3>
              <p className="text-muted-foreground">
                Every piece features hand-crafted lettering and original
                calligraphy artwork.
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Premium Quality
              </h3>
              <p className="text-muted-foreground">
                High-quality materials and printing ensure your clothing lasts
                for years.
              </p>
            </CardContent>
          </Card>

          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground">
                Made with Love
              </h3>
              <p className="text-muted-foreground">
                Each design is carefully created by talented artists who pour
                their passion into every piece.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
