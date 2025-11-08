"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";

// Schema de validación para actualizar perfil
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

type UpdateProfileResult =
  | { success: true }
  | { success: false; error: string };

export async function updateProfile(
  data: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const supabase = getSupabaseServerClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Not authenticated" };
    }

    // Validar datos
    const validatedData = updateProfileSchema.parse(data);

    // Actualizar cuenta
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        name: validatedData.name,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        city: validatedData.city || null,
        postal_code: validatedData.postal_code || null,
        country: validatedData.country || null,
      })
      .eq("user_id", user.id);

    if (updateError) {
      return {
        success: false,
        error: "Failed to update profile: " + updateError.message,
      };
    }

    // Revalidar la página de perfil
    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: "Invalid data provided" };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
