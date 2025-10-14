"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { If } from "@/components/ui/if";
import { Input } from "@/components/ui/input";

import { PasswordSignUpSchema } from "../_schemas/password-sign-up.schema";

interface PasswordSignUpFormProps {
  defaultValues?: {
    email: string;
  };

  displayTermsCheckbox?: boolean;

  onSubmit: (params: {
    email: string;
    password: string;
    repeatPassword: string;
  }) => unknown;
  loading: boolean;
}

export function PasswordSignUpForm({
  defaultValues,
  displayTermsCheckbox,
  onSubmit,
  loading,
}: PasswordSignUpFormProps) {
  const form = useForm({
    resolver: zodResolver(PasswordSignUpSchema),
    defaultValues: {
      email: defaultValues?.email ?? "",
      password: "",
      repeatPassword: "",
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
                  autoComplete="new-password"
                  placeholder={""}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={"repeatPassword"}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Repeat Password</FormLabel>

              <FormControl>
                <Input
                  required
                  data-test={"repeat-password-input"}
                  type="password"
                  placeholder={""}
                  {...field}
                />
              </FormControl>

              <FormMessage />

              <FormDescription className={"pb-2 text-xs"}>
                Write your password again
              </FormDescription>
            </FormItem>
          )}
        />

        <Button
          data-test={"auth-submit-button"}
          className={"w-full"}
          type="submit"
          disabled={loading}
        >
          <If
            condition={loading}
            fallback={
              <>
                Sign Up With Email
                <ArrowRight
                  className={
                    "zoom-in animate-in slide-in-from-left-2 fill-mode-both h-4 delay-500 duration-500"
                  }
                />
              </>
            }
          >
            Sign Up
          </If>
        </Button>
      </form>
    </Form>
  );
}
