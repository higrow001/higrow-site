"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import loginWithGoogle from "@/lib/utils/googleLogin";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import './signin.scss';

const SignIn = () => {
  const signInUser = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error.message.includes("user-not-found")) {
        alert("No user is registered with this email!");
      }
      if (error.message.includes("wrong-password")) {
        alert("Wrong password!");
      }
    }
  };

  return (
    <main className="flex justify-center items-center bg-[#f4f4f0] signup-container">
      <div className="p-20 max-w-xl bg-white border border-black flex flex-col items-center space-y-20 rounded-lg w-full signup-card">
        <h1 className="text-4xl font-archivo font-bold text-[#333333]">
          Sign in for HiGrow
        </h1>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            signInUser(values.email, values.password);
            setSubmitting(false);
          }}
        >
          <Form className="space-y-20 w-full">
            <div className="flex flex-col space-y-8 items-center w-full">
              <button
                className="p-3 px-8 w-full text-[#333] text-lg font-archivo font-bold border-2 border-[#333] rounded-xl flex space-x-6 items-center justify-center hover:bg-neutral-100 transition"
                onClick={async () => loginWithGoogle()}
              >
                <span>Continue with Google</span>
                <FcGoogle className="text-3xl" />
              </button>
              <span className="text-[#757575] font-medium text-xl">or</span>
              <div className="w-full">
                <Field
                  name="email"
                  type="email"
                  placeholder="Email"
                  className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
                />
                <ErrorMessage
                  name="email"
                  component="span"
                  className="text-red-500"
                />
              </div>
              <div className="w-full">
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
                />
                <ErrorMessage
                  name="password"
                  component="span"
                  className="text-red-500"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-8 items-center w-full">
              <button
                type="submit"
                className="text-lg font-archivo font-semibold h-14 bg-theme-blue text-white w-full px-6 py-3 rounded-xl transition hover:bg-theme-blue-darker"
              >
                Sign in
              </button>
              <p className="text-lg font-medium text-[#757575]">
                Don't have an account?{" "}
                <Link className="text-theme-blue font-semibold" href="/signup">
                  Sign up
                </Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </main>
  );
};

export default SignIn;
