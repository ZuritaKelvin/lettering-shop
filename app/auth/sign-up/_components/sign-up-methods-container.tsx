"use client";

import type { Provider } from "@supabase/supabase-js";

import { isBrowser } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { If } from "@/components/ui/if";
import { Separator } from "@/components/ui/separator";

import { ExistingAccountHint } from "./existing-account-hint";

import { EmailPasswordSignUpContainer } from "./password-sign-up-container";

export function SignUpMethodsContainer() {
  const redirectUrl = getCallbackUrl();
  const defaultValues = getDefaultValues();

  return (
    <>
      {/* Show hint if user might already have an account */}
      <ExistingAccountHint />

      <EmailPasswordSignUpContainer
        emailRedirectTo={redirectUrl}
        defaultValues={defaultValues}
      />
    </>
  );
}

function getCallbackUrl() {
  if (!isBrowser()) {
    return "";
  }

  const redirectPath = "auth/sign-up";
  const origin = window.location.origin;
  const url = new URL(redirectPath, origin);

  const searchParams = new URLSearchParams(window.location.search);
  const next = searchParams.get("next");

  if (next) {
    url.searchParams.set("next", next);
  }

  return url.href;
}

function getDefaultValues() {
  if (!isBrowser()) {
    return { email: "" };
  }

  const searchParams = new URLSearchParams(window.location.search);
  const inviteToken = searchParams.get("invite_token");

  if (!inviteToken) {
    return { email: "" };
  }

  return {
    email: searchParams.get("email") ?? "",
  };
}
