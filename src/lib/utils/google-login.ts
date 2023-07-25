import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const useGoogleLogin = () => {
  const supabase = createClientComponentClient()

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "email profile openid",
        redirectTo: `${location.origin}`,
      },
    })
  }

  return loginWithGoogle
}

export default useGoogleLogin
