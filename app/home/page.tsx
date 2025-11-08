import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { HeroSection, FeaturesSection, CtaSection } from "./_components";

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
      <HeroSection userName={account?.name} />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
