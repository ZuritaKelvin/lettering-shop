import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { Suspense } from "react";
import { SignInMethodsContainer } from "./_components/sign-in-methods-container";

export const generateMetadata = async () => {
  return {
    title: "Sign In",
  };
};

async function SignInPage() {
  const signUpPath = "/auth/sign-up";

  return (
    <>
      <div className={"flex flex-col items-center gap-1"}>
        <Heading level={4} className={"tracking-tight"}>
          Sign In
        </Heading>

        <p className={"text-muted-foreground text-sm"}>
          Sign In to your account
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <SignInMethodsContainer />
      </Suspense>

      <div className={"flex justify-center"}>
        <Button asChild variant={"link"} size={"sm"}>
          <Link href={signUpPath} prefetch={true}>
            Don&apos;t have an account? Sign up!
          </Link>
        </Button>
      </div>
    </>
  );
}

export default SignInPage;
