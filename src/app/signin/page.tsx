"use client"

import Link from "next/link"
import { FcGoogle } from "react-icons/fc"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import useGoogleLogin from "@/lib/utils/google-login"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { doc, getDoc } from "firebase/firestore"

const signinFormSchema = z.object({
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
})
const initialValues = { email: "", password: "" }

const SignIn = () => {
  const loginWithGoogle = useGoogleLogin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect")

  const form = useForm({
    resolver: zodResolver(signinFormSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })

  type DataType = z.infer<typeof signinFormSchema>

  const signInUser = async (data: DataType) => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )
      const userData = await getDoc(doc(db, "users", user.user.uid))
      if (userData.exists()) {
        document.cookie = `display_name=${
          userData.data().display_name
        }; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`
      } else {
        document.cookie = `display_name=${
          user.user.displayName
        }; SameSite=Lax; max-age=${60 * 60 * 24 * 30}`
      }
      document.cookie = `uid=${user.user.uid}; SameSite=Lax; max-age=${
        60 * 60 * 24 * 30
      }`
      document.cookie = `email=${user.user.email}; SameSite=Lax; max-age=${
        60 * 60 * 24 * 30
      }`
      router.replace(`/${redirectPath ?? ""}`)
    } catch (error: any) {
      if (error.message.includes("user-not-found")) {
        alert("No user is registered with this email!")
      }
      if (error.message.includes("wrong-password")) {
        alert("Wrong password!")
      }
    }
  }

  return (
    <main className="flex justify-center min-h-full items-center bg-accent w-full py-10">
      <div className="md:px-20 px-8 py-20 mx-4 max-w-xl border shadow flex flex-col items-center space-y-20 rounded-lg w-full bg-background">
        <h1 className="text-2xl md:text-4xl font-archivo font-bold text-[#333333]">
          Sign in for HiGrow
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(signInUser)}
            className="space-y-10 md:space-y-20 w-full"
          >
            <div className="flex flex-col space-y-8 items-center w-full">
              <Button
                type="button"
                variant="outline"
                size="xl"
                className="space-x-3 w-full md:text-lg rounded-lg"
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
            </div>
            <div className="flex flex-col space-y-8 items-center w-full">
              <Button
                className="md:text-lg font-archivo w-full px-6 rounded-xl"
                type="submit"
                size="xl"
              >
                Sign in
              </Button>
              <p className="md:text-lg font-medium text-[#757575]">
                Don't have an account?{" "}
                <Link
                  className="text-primary-lighter font-semibold"
                  href={`/signup${
                    redirectPath !== "" && redirectPath !== null
                      ? `?redirect=${redirectPath}`
                      : ""
                  }`}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </main>
  )
}

export default SignIn
