"use client"

import "./signup.scss"
import useGoogleLogin from "@/lib/utils/google-login"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAlert } from "@/states/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const signupFormSchema = z
  .object({
    displayName: z
      .string({
        required_error: "Display name is required.",
      })
      .min(2, { message: "Name must be atleast 2 characters long" }),
    email: z
      .string({
        required_error: "Email is required.",
      })
      .email(),
    password: z
      .string({ required_error: "Password is required." })
      .min(8, {
        message: "Password must be at least 8 characters long",
      })
      .max(32),
    confirmPassword: z.string({ required_error: "Enter confirm password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
const initialValues = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
}

const SignUp = () => {
  const loginWithGoogle = useGoogleLogin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect")
  const { showAutoCloseAlert, showAlert, hideAlert } = useAlert()
  const supabase = createClientComponentClient()

  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })
  type DataType = z.infer<typeof signupFormSchema>

  const signUpUser = async (udata: DataType) => {
    const { data, error } = await supabase.auth.signUp({
      email: udata.email,
      password: udata.password,
      options: {
        data: {
          full_name: udata.displayName,
          avatar_url: null,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (data.user) {
      showAlert({
        title:
          "We've sent you a confirmation link to your entered email. please open that link to login.",
        action: { text: "Okay", callback: hideAlert },
      })
    }
    if (error) {
      showAutoCloseAlert({
        title: "Error!",
        description: error.message,
        type: "destructive",
      })
    }
  }

  return (
    <div>
       {/* <Link className="text-[36px] font-bold font-archivo pl-[20px] md:pl-[100px] pt-[80px] text-[#333] " href="/">HiGrow.</Link>{" "} */}
    <main className="flex justify-center min-h-full items-center bg-accent w-full py-10">
      <div className="md:px-20 px-8 py-16 md:py-20 md:mx-4 max-w-xl md:border border-t border-b border-black flex flex-col items-center space-y-20 md:rounded-md w-full bg-background">
        <h1 className="text-2xl md:text-4xl font-archivo font-bold text-[#333333]">
          Sign Up for HiGrow
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(signUpUser)}
            className="space-y-10 md:space-y-16 w-full"
          >
            <div className="flex flex-col space-y-6 items-center w-full">
              <Button
                type="button"
                variant="outline"
                size="xl"
                className="space-x-3 w-full text-base md:text-lg rounded-lg"
                onClick={async () => loginWithGoogle()}
              >
                <FcGoogle className="md:text-3xl text-2xl shrink-0" />
                <span className="shrink-0">Continue with Google</span>
              </Button>
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="px-4"
                        placeholder="Display name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="px-4"
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="px-4"
                        type="password"
                        placeholder="Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        className="px-4"
                        type="password"
                        placeholder="Confirm password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col space-y-8 items-center w-full">
              <Button
                className="text-base md:text-lg bg-[#333] w-full px-6 md:rounded-lg border border-black"
                type="submit"
                size="xl"
              >
                Sign Up
              </Button>
              <p className="md:text-lg font-medium text-[#757575]">
                Don't have an account?{" "}
                <Link
                  className="text-primary-lighter font-semibold"
                  href={`/signin${
                    redirectPath !== "" && redirectPath !== null
                      ? `?redirect=${redirectPath}`
                      : ""
                  }`}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </main>
    </div>
  )
}

export default SignUp
