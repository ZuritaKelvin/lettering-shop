"use server";

import { getSupabaseServerClient } from "@/supabase/src/clients/server-client";
import { revalidatePath } from "next/cache";

interface AddToCartParams {
  productColorId: string;
  quantity?: number;
}

interface UpdateCartItemParams {
  cartItemId: string;
  quantity: number;
}

export async function addToCart({ productColorId, quantity = 1 }: AddToCartParams) {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User not authenticated" };
  }

  // Check if item already exists in cart
  const { data: existingItem, error: checkError } = await (supabase as any)
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", user.id)
    .eq("product_color_id", productColorId)
    .single();

  if (checkError && checkError.code !== "PGRST116") {
    // PGRST116 is "not found" error
    return { success: false, error: checkError.message };
  }

  if (existingItem) {
    // Update quantity if item exists
    const { error: updateError } = await (supabase as any)
      .from("cart_items")
      .update({ quantity: existingItem.quantity + quantity })
      .eq("id", existingItem.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }
  } else {
    // Insert new item
    const { error: insertError } = await (supabase as any)
      .from("cart_items")
      .insert({
        user_id: user.id,
        product_color_id: productColorId,
        quantity,
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }
  }

  revalidatePath("/cart");
  revalidatePath("/products");
  return { success: true };
}

export async function updateCartItem({ cartItemId, quantity }: UpdateCartItemParams) {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User not authenticated" };
  }

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { error } = await (supabase as any)
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function removeFromCart(cartItemId: string) {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await (supabase as any)
    .from("cart_items")
    .delete()
    .eq("id", cartItemId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}

export async function getCartItems() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User not authenticated", data: null };
  }

  const { data, error } = await (supabase as any)
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      created_at,
      product_color_id,
      product_colors (
        id,
        color,
        image_url,
        stock,
        product_id,
        products (
          id,
          name,
          description,
          price,
          delivery_date
        )
      )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message, data: null };
  }

  return { success: true, data };
}

export async function clearCart() {
  const supabase = getSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await (supabase as any)
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/cart");
  return { success: true };
}
