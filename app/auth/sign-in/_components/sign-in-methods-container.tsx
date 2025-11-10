"use client";

import { useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { PasswordSignInContainer } from "./password-sign-in-container";

export function SignInMethodsContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSignIn = useCallback(() => {
    // Check if there's a redirect URL parameter from protected route attempt
    const redirectUrl = searchParams.get("redirect");
    const returnPath = redirectUrl || "/home";

    // Redirect to the intended page or default to home
    router.replace(returnPath);
  }, [router, searchParams]);

  return (
    <>
      <PasswordSignInContainer onSignIn={onSignIn} />
    </>
  );
}
