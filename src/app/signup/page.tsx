import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {
  return (
    <main className="flex justify-center items-center h-full bg-[#f4f4f0] w-full">
      <div className="p-20 max-w-xl bg-white border border-black flex flex-col items-center space-y-16 rounded-lg w-full">
        <h1 className="text-4xl font-archivo font-bold text-[#333333]">
          Sign Up for HiGrow
        </h1>
        <div className="flex flex-col space-y-6 items-center w-full">
          <button className="p-3 px-8 w-full text-[#333] text-lg font-archivo font-bold border-2 border-[#333] rounded-xl flex space-x-6 items-center justify-center">
            <span>Continue with Google</span>
            <FcGoogle className="text-3xl" />
          </button>
          <span className="text-[#757575] font-medium text-xl">or</span>
          <input
            className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
            type="text"
            placeholder="display name"
          />
          <input
            className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
            type="text"
            placeholder="email"
          />
          <input
            className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
            type="password"
            placeholder="password"
          />
          <input
            className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
            type="password"
            placeholder="confirm password"
          />
        </div>
        <div className="flex flex-col space-y-8 items-center w-full">
          <button className="text-lg font-archivo font-semibold bg-theme-blue text-white w-full px-6 py-3 rounded-xl transition hover:bg-theme-blue-darker">
            Sign up
          </button>
          <p className="text-lg font-medium text-[#757575]">
            Already have an account?{" "}
            <Link className="text-theme-blue font-semibold" href="/signin">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
