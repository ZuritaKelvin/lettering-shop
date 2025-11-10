import { HeroSection, FeaturesSection, CtaSection } from "./_components";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";

export default async function HomePage() {
  // Use public Supabase client
  const supabase = await getSupabaseServerClient();

  // Try to get authenticated user (optional - for personalized experience)
  let account = null;
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Get account information if user is logged in
    if (user) {
      const { data } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", user.id)
        .single();
      account = data;
    }
  } catch (error) {
    // User not authenticated, continue with public access
    console.log("No authenticated user");
  }

  return (
    <div className="min-h-screen">
      <HeroSection userName={account?.name} />
      <FeaturesSection />
      <CtaSection />
    </div>
  );
}
