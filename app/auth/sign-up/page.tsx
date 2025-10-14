import Link from "next/link";

import { SignUpMethodsContainer } from "./_components/sign-up-methods-container";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";

export const generateMetadata = async () => {
  return {
    title: "Sign Up",
  };
};

interface Props {
  searchParams: Promise<{
    invite_token?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: Props) {
  const inviteToken = (await searchParams).invite_token;

  const signInPath = "/auth/sign-in";
  return (
    <>
      <div className={"flex flex-col items-center gap-1"}>
        <Heading level={4} className={"tracking-tight"}>
          Sign Up
        </Heading>

        <p className={"text-muted-foreground text-sm"}>Create a new account!</p>
      </div>

      <SignUpMethodsContainer />

      <div className={"flex justify-center"}>
        <Button asChild variant={"link"} size={"sm"}>
          <Link href={signInPath} prefetch={true}>
            Already have an account?
          </Link>
        </Button>
      </div>
    </>
  );
}
