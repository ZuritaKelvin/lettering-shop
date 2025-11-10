import { type NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@/supabase/src/clients/middleware-client";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const supabase = createMiddlewareClient(request, response);

  // Refrescar la sesión si existe
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas protegidas que requieren autenticación (compras y perfil)
  const protectedRoutes = ["/cart", "/profile"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Rutas de autenticación
  const authRoutes = ["/auth/sign-in", "/auth/sign-up"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Si no hay sesión y está intentando acceder a una ruta protegida, redirigir a sign-in
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL("/auth/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión y está intentando acceder a sign-in o sign-up, redirigir al home
  if (session && isAuthRoute) {
    const redirectUrl = new URL("/", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
