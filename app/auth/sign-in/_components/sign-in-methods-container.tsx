"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";
import { isBrowser } from "@/lib/utils";
import type { Provider } from "@supabase/supabase-js";
import { PasswordSignInContainer } from "./password-sign-in-container";

export function SignInMethodsContainer() {
  const router = useRouter();

  const redirectUrl = isBrowser()
    ? new URL("/auth/sign-in", window?.location.origin).toString()
    : "";

  const onSignIn = useCallback(() => {
    // if the user has an invite token, we should join the team

    const returnPath = "/home";

    // otherwise, we should redirect to the return path
    router.replace(returnPath);
  }, [router]);

  return (
    <>
      <PasswordSignInContainer onSignIn={onSignIn} />
    </>
  );
}
