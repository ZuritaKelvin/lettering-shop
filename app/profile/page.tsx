import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Home,
  Hash,
  Globe,
  LogOut,
  Edit,
} from "lucide-react";
import { signOut } from "../(auth)/actions";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error ?? !user) {
    redirect("/auth/sign-in");
  }

  // Get account information with all fields
  const { data: account, error: accountError } = await supabase
    .from("accounts")
    .select("name, email, phone, address, city, postal_code, country")
    .eq("user_id", user.id)
    .single();
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
              My Profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your account information
            </p>
          </div>

          {/* Profile Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Name */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <User className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-sm text-foreground truncate">
                    {account?.name ?? "Not provided"}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm text-foreground truncate">
                    {account?.email ?? "Not provided"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Phone className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="text-sm text-foreground truncate">
                    {account?.phone ?? "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>
                Your shipping and billing address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg">
                <Home className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm text-foreground">
                    {account?.address ?? "Not provided"}
                  </p>
                </div>
              </div>

              {/* City */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="text-sm text-foreground truncate">
                    {account?.city ?? "Not provided"}
                  </p>
                </div>
              </div>

              {/* Postal Code */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Hash className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">
                    Postal Code
                  </p>
                  <p className="text-sm text-foreground truncate">
                    {account?.postal_code ?? "Not provided"}
                  </p>
                </div>
              </div>

              {/* Country */}
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Country</p>
                  <p className="text-sm text-foreground truncate">
                    {account?.country ?? "Not provided"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/profile/edit">
                <Button
                  variant="default"
                  className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
              <form action={signOut}>
                <Button
                  variant="outline"
                  className="w-full gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
