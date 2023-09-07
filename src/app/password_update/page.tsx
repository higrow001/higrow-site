import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { updatePassword } from "../_actions/user"

export default function ResetPassword() {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8">
          <h2 className="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Change Your Password
          </h2>
          <form
            action={updatePassword}
            className="mt-4 space-y-4 lg:mt-5 md:space-y-5"
          >
            <Label
              htmlFor="new_password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Enter new password
            </Label>
            <Input
              type="password"
              name="new_password"
              id="new_password"
              placeholder="********"
              required
            />
            <Label
              htmlFor="confirm_password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Confirm new password
            </Label>
            <Input
              type="password"
              name="confirm_password"
              id="confirm_password"
              placeholder="********"
              required
            />
            <Button type="submit">Change Password</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
