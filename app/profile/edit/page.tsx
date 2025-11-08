import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { EditProfileForm } from "../_components/edit-profile-form";
import { User } from "lucide-react";

export default async function EditProfilePage() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/sign-in");
  }

  // Obtener información de la cuenta
  const { data: account } = await supabase
    .from("accounts")
    .select("name, email, phone, address, city, postal_code, country")
    .eq("user_id", user.id)
    .single();

  if (!account) {
    redirect("/profile");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-orange-950/20">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full">
              <User className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Edit Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Update your account information
            </p>
          </div>

          {/* Edit Form */}
          <EditProfileForm account={account} />
        </div>
      </main>
    </div>
  );
}
