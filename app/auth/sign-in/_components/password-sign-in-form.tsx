"use client";

import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { If } from "@/components/ui/if";
import { Input } from "@/components/ui/input";

import { PasswordSignInSchema } from "../_schemas/sign-in-schema";

export function PasswordSignInForm({
  onSubmit,
  loading = false,
  redirecting = false,
}: {
  onSubmit: (params: z.infer<typeof PasswordSignInSchema>) => unknown;
  loading: boolean;
  redirecting: boolean;
}) {
  const form = useForm<z.infer<typeof PasswordSignInSchema>>({
    resolver: zodResolver(PasswordSignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className={"flex w-full flex-col gap-y-4"}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>

              <FormControl>
                <Input
                  data-test={"email-input"}
                  required
                  type="email"
                  placeholder={"Email Address"}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"password"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input
                  required
                  data-test={"password-input"}
                  type="password"
                  placeholder={""}
                  {...field}
                />
              </FormControl>

              <FormMessage />

              <div>
                <Button
                  asChild
                  type={"button"}
                  size={"sm"}
                  variant={"link"}
                  className={"text-xs"}
                >
                  <Link href={"/auth/password-reset"}>Password Forgotten?</Link>
                </Button>
              </div>
            </FormItem>
          )}
        />

        <Button
          data-test="auth-submit-button"
          className={"group w-full"}
          type="submit"
          disabled={loading || redirecting}
        >
          <If condition={redirecting}>
            <span className={"animate-in fade-in slide-in-from-bottom-24"}>
              Redirecting
            </span>
          </If>

          <If condition={loading}>
            <span className={"animate-in fade-in slide-in-from-bottom-24"}>
              Signing In
            </span>
          </If>

          <If condition={!redirecting && !loading}>
            <span className={"animate-out fade-out flex items-center"}>
              Sign In With Email
              <ArrowRight
                className={
                  "zoom-in animate-in slide-in-from-left-2 fill-mode-both h-4 delay-500 duration-500"
                }
              />
            </span>
          </If>
        </Button>
      </form>
    </Form>
  );
}
