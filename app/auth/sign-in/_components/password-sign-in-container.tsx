"use client";

import { useCallback } from "react";

import { z } from "zod";

import { useSignInWithEmailPassword } from "../_hooks/use-sign-in-with-email-password";

import { useCaptchaToken } from "@/app/captcha/client";
import { AuthErrorAlert } from "@/components/ui/auth-error-alert";
import { PasswordSignInForm } from "../_components/password-sign-in-form";
import { PasswordSignInSchema } from "../_schemas/sign-in-schema";
import { useLastAuthMethod } from "../_hooks/use-last-auth-method";

export function PasswordSignInContainer({
  onSignIn,
}: {
  onSignIn?: (userId?: string) => unknown;
}) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();
  const signInMutation = useSignInWithEmailPassword();
  const { recordAuthMethod } = useLastAuthMethod();
  const isLoading = signInMutation.isPending;
  const isRedirecting = signInMutation.isSuccess;

  const onSubmit = useCallback(
    async (credentials: z.infer<typeof PasswordSignInSchema>) => {
      try {
        const data = await signInMutation.mutateAsync({
          ...credentials,
          options: { captchaToken },
        });

        // Record successful password sign-in
        recordAuthMethod("password", { email: credentials.email });

        if (onSignIn) {
          const userId = data?.user?.id;

          onSignIn(userId);
        }
      } catch {
        // wrong credentials, do nothing
      } finally {
        resetCaptchaToken();
      }
    },
    [
      captchaToken,
      onSignIn,
      resetCaptchaToken,
      signInMutation,
      recordAuthMethod,
    ]
  );

  return (
    <>
      <AuthErrorAlert error={signInMutation.error} />

      <PasswordSignInForm
        onSubmit={onSubmit}
        loading={isLoading}
        redirecting={isRedirecting}
      />
    </>
  );
}
