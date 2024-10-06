"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { motion } from "framer-motion";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      toast({
        title: "Login Fail",
        description: "Incorrect username or password",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login sucessful",
        variant: "success",
      });
    }
    if (result?.url) {
      router.replace("/dashboard");
    }

    setIsSubmitting(false);
  };
  return (
    <div className="flex justify-center item-center min-h-screen items-center bg-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-white h-4/5 rounded-3xl shadow-md z-10">
        <div className="text-center">
          <HeroHighlight>
            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              className="text-2xl px-4 font-bold text-neutral-700  leading-relaxed lg:leading-snug text-center mx-auto "
            >
              Welcome Back To{" "}
              <Highlight className="text-black">FeedCast</Highlight>
            </motion.h1>
          </HeroHighlight>
          <p className="mb-4">We are happy to see you again</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" placeholder="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Sign-In"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a membet?{" "}
            <Link
              href={"/sign-up"}
              className="text-blue-600 hover:text-blue-800"
            >
              {" "}
              Sign-Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
