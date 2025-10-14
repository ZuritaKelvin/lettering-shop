"use client";

import { CheckCircledIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { If } from "@/components/ui/if";

import { useCaptchaToken } from "@/app/captcha/client";
import { usePasswordSignUpFlow } from "../_hooks/use-sign-up-flow";
import { AuthErrorAlert } from "@/components/ui/auth-error-alert";
import { PasswordSignUpForm } from "./password-sign-up-form";

interface EmailPasswordSignUpContainerProps {
  displayTermsCheckbox?: boolean;
  defaultValues?: {
    email: string;
  };
  onSignUp?: (userId?: string) => unknown;
  emailRedirectTo: string;
}

export function EmailPasswordSignUpContainer({
  defaultValues,
  onSignUp,
  emailRedirectTo,
  displayTermsCheckbox,
}: EmailPasswordSignUpContainerProps) {
  const { captchaToken, resetCaptchaToken } = useCaptchaToken();

  const {
    signUp: onSignupRequested,
    loading,
    error,
    showVerifyEmailAlert,
  } = usePasswordSignUpFlow({
    emailRedirectTo,
    onSignUp,
    captchaToken,
    resetCaptchaToken,
  });

  return (
    <>
      <If condition={showVerifyEmailAlert}>
        <SuccessAlert />
      </If>

      <If condition={!showVerifyEmailAlert}>
        <AuthErrorAlert error={error} />

        <PasswordSignUpForm
          onSubmit={onSignupRequested}
          loading={loading}
          defaultValues={defaultValues}
          displayTermsCheckbox={displayTermsCheckbox}
        />
      </If>
    </>
  );
}

function SuccessAlert() {
  return (
    <Alert>
      <CheckCircledIcon className={"w-4"} />

      <AlertTitle>U have been registered Successfully!</AlertTitle>

      <AlertDescription data-test={"email-confirmation-alert"}>
        A new account was created.
      </AlertDescription>
    </Alert>
  );
}
