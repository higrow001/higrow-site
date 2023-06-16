"use client";

import useGoogleLogin from "@/lib/utils/googleLogin";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import "./signup.scss";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const loginWithGoogle = useGoogleLogin();
  const router = useRouter();
  const signUpUser = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    if (user) {
      await setDoc(doc(db, "users", user.user.uid), {
        email: user.user.email,
        display_name: displayName,
        profile_photo: user.user.photoURL,
      });
      router.replace("/");
    }
  };

  return (
    <main className="flex justify-center min-h-full items-center bg-[#f4f4f0] w-full signup-container">
      <div className="p-20 max-w-xl bg-white border border-black flex flex-col items-center space-y-16 rounded-lg w-full signup-card">
        <h1 className="text-4xl font-archivo font-bold text-[#333333]">
          Sign Up for HiGrow
        </h1>
        <Formik
          initialValues={{
            displayName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Required"),
            password: Yup.string()
              .min(8, "Password must be at least 8 characters long")
              .required("Required"),
            displayName: Yup.string()
              .min(3, "Name should be atleast 3 characters long.")
              .required("Required"),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref("password"), ""], "Passwords must match")
              .required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            signUpUser(values.email, values.password, values.displayName);
            setSubmitting(false);
          }}
        >
          <Form className="space-y-16 w-full">
            <div className="flex flex-col space-y-6 items-center w-full">
              <button
                type="button"
                className="p-3 px-8 w-full text-[#333] text-lg font-archivo font-bold border-2 border-[#333] h-14 rounded-xl flex space-x-6 items-center justify-center hover:bg-neutral-100 transition"
                onClick={async () => loginWithGoogle()}
              >
                <span>Continue with Google</span>
                <FcGoogle className="text-3xl" />
              </button>
              <span className="text-[#757575] font-medium text-xl">or</span>
              <div className="w-full">
                <Field
                  name="displayName"
                  type="text"
                  placeholder="Display name"
                  className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
                />
                <ErrorMessage
                  name="displayName"
                  component="span"
                  className="text-red-500"
                />
              </div>
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
              <div className="w-full">
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className="px-6 py-3 text-lg border-2 border-[#333] rounded-md w-full"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="span"
                  className="text-red-500"
                />
              </div>
            </div>
            <div className="flex flex-col space-y-8 items-center w-full">
              <button
                type="submit"
                className="text-lg font-archivo font-semibold bg-theme-blue text-white h-14 w-full px-6 py-3 rounded-xl transition hover:bg-theme-blue-darker"
              >
                Sign Up
              </button>
              <p className="text-lg font-medium text-[#757575]">
                Don't have an account?{" "}
                <Link className="text-theme-blue font-semibold" href="/signin">
                  Sign in
                </Link>
              </p>
            </div>
          </Form>
        </Formik>
      </div>
    </main>
  );
};

export default SignUp;
