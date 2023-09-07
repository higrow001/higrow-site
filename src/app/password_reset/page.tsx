"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useAlert } from "@/states/alert"

export default function ResetPassword() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { showAlert } = useAlert()

  async function sendResetLink(data: FormData) {
    const email = data.get("email")
    await supabase.auth.resetPasswordForEmail(email!.toString(), {
      redirectTo: `${
        process.env.NODE_ENV === "production"
          ? "https://higrow.xyz"
          : "http://localhost:3000"
      }/auth/callback?next=/password_update`,
    })
    showAlert({
      title: "Email sent.",
      description:
        "Check your email and open the link. Please check the spam folder if you't find it in inbox.",
      action: {
        text: "Okay",
        callback() {
          router.replace("/signin")
        },
      },
    })
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Reset Your Password
          </h2>
          <form
            action={sendResetLink}
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          >
            <Label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Enter your user account's email address and we will send you a
              password reset link.
            </Label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="name@xyz.com"
              required
            />
            <Button type="submit">Send password reset email</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
