import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

/**
 * @name AuthErrorAlert
 * @param error This error comes from Supabase as the code returned on errors
 * This error is mapped from the translation auth:errors.{error}
 * To update the error messages, please update the translation file
 * https://github.com/supabase/gotrue-js/blob/master/src/lib/errors.ts
 * @constructor
 */
export function AuthErrorAlert({
  error,
}: {
  error: Error | null | undefined | string;
}) {
  if (!error) {
    return null;
  }

  const DefaultError = "An error has occurred, We can`t authenticate you.";
  const errorCode = error instanceof Error ? error.message : error;

  return (
    <Alert variant={"destructive"}>
      <ExclamationTriangleIcon className={"w-4"} />

      <AlertTitle>
        An error has occurred, We can&apos;t authenticate you.
      </AlertTitle>

      <AlertDescription data-test={"auth-error-message"}>
        {DefaultError}
      </AlertDescription>
    </Alert>
  );
}
