"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import { PasswordSignInContainer } from "./password-sign-in-container";

export function SignInMethodsContainer() {
  const router = useRouter();

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
