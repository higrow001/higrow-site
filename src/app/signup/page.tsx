"use client"

import "./signup.scss"
import useGoogleLogin from "@/lib/utils/google-login"
import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { setDoc, doc } from "firebase/firestore"
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
      .max(100),
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

  const form = useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })
  type DataType = z.infer<typeof signupFormSchema>

  const signUpUser = async (data: DataType) => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      if (user) {
        await setDoc(doc(db, "users", user.user.uid), {
          email: user.user.email,
          display_name: data.displayName,
          profile_photo: user.user.photoURL,
        })
        router.replace(`/${redirectPath ?? ""}`)
      }
    } catch (error: any) {
      if (error.message.includes("email-already-in-use")) {
        alert("This email is already registered to an account.")
      }
    }
  }

  return (
    <main className="flex justify-center min-h-full items-center bg-accent w-full signup-container">
      <div className="p-20 max-w-xl bg-background border shadow flex flex-col items-center space-y-16 rounded-lg w-full signup-card">
        <h1 className="text-4xl font-archivo font-bold text-[#333333]">
          Sign Up for HiGrow
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(signUpUser)}
            className="space-y-16 w-full"
          >
            <div className="flex flex-col space-y-6 items-center w-full">
              <Button
                type="button"
                variant="outline"
                size="xl"
                className="space-x-3 w-full text-lg rounded-lg"
                onClick={async () => loginWithGoogle()}
              >
                <FcGoogle className="text-3xl" />
                <span>Continue with Google</span>
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
                        className="px-4 text-lg"
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
                        className="px-4 text-lg"
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
                        className="px-4 text-lg"
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
                        className="px-4 text-lg"
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
                className="text-lg font-archivo w-full px-6 rounded-xl"
                type="submit"
                size="xl"
              >
                Sign Up
              </Button>
              <p className="text-lg font-medium text-[#757575]">
                Don't have an account?{" "}
                <Link
                  className="text-primary-lighter font-semibold"
                  href={`/signin${redirectPath ?? ""}`}
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}

export default SignUp
