import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Mantente al día con las últimas noticias y actualizaciones de Lettering Shop. Descubre nuevas colecciones y diseños exclusivos.",
  openGraph: {
    title: "Noticias | Lettering Shop",
    description: "Mantente al día con las últimas noticias y actualizaciones de Lettering Shop",
    type: "website",
  },
};

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
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full">
              <Newspaper className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Últimas Noticias
            </h1>
            <p className="text-lg text-muted-foreground">
              Mantente al día con las últimas novedades de Lettering Shop
            </p>
          </div>

          {/* News Articles */}
          <div className="space-y-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>14 de Octubre, 2025</span>
                </div>
                <CardTitle className="text-2xl">
                  ¡Bienvenido a Lettering Shop! 🎉
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Estamos emocionados de lanzar nuestra nueva plataforma de e-commerce
                  con ropa única que presenta hermosos diseños de lettering y caligrafía.
                  ¡Mantente atento a más actualizaciones!
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Próximamente</span>
                </div>
                <CardTitle className="text-2xl">
                  Vista Previa de Nueva Colección ✨
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prepárate para nuestra próxima colección con diseños exclusivos
                  de talentosos artistas de caligrafía. ¡Más detalles próximamente!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
