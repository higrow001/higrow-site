"use client";

import Link from "next/link";
import { useState } from "react";
import { BiChevronLeft } from "react-icons/bi";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";

export default function CreateWorkshop() {
  const steps = ["Basics", "Dates", "Links", "Description", "Advanced"];
  const categories = [
    "Coding",
    "Design",
    "Editing",
    "Marketing",
    "Finance",
    "Business",
    "Startup",
    "E-Sports",
    "Sports",
    "Academics",
    "Other",
  ];
  const [activeStep, setActiveStep] = useState(0);
  const formik = useFormik({
    initialValues: {
      name: "",
      tagline: "",
      mode: "Online",
      category: "Coding",
      applicationClosingDate: "2018-06-12T19:30",
      workshopStartingDate: "2018-06-12T19:30",
      workshopEndingDate: "2018-06-12T19:30",
      contactEmail: "",
      redirectUrl: "",
      websiteLink: "",
      facebookLink: "",
      discordLink: "",
      whatsappLink: "",
      instagramLink: "",
      youtubeLink: "",
    },
    onSubmit: () => {},
  });

  const router = useRouter();
  console.log(auth.currentUser?.emailVerified);
  if (!auth.currentUser) {
    router.replace("/signin");
  }

  return (
    <main className="max-w-4xl w-full mt-16 space-y-8 mx-auto">
      <div className="flex justify-between items-center">
        <Link href="/organize" className="flex space-x-1 text-lg items-center">
          <BiChevronLeft className="text-3xl" />
          <span>Go back</span>
        </Link>
        <button className="px-8 py-3 rounded-lg bg-[#333] text-neutral-200">
          Publish
        </button>
      </div>
      <div className="flex justify-between items-center px-16 border border-black py-3 rounded-md shadow-[4px_4px_0_#333]">
        {steps.map((step, index) => (
          <button
            className={`text-lg py-3 px-5 rounded-lg ${
              index === activeStep
                ? "bg-[#333] text-neutral-200"
                : " text-[#757575]"
            }`}
            key={step}
            onClick={() => setActiveStep(index)}
          >
            {step}
          </button>
        ))}
      </div>
      {/* First Tab */}
      {activeStep === 0 && (
        <div className="py-10 px-10 space-y-8 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] !mb-24">
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="name"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              placeholder="e.g. Full stack web development 101"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </div>
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="tagline"
            >
              Tagline
            </label>
            <input
              id="tagline"
              name="tagline"
              type="text"
              className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              placeholder="e.g. Best Web Development workshop in hindi"
              onChange={formik.handleChange}
              value={formik.values.tagline}
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-[#333]">Mode</h1>
            <div className="flex space-x-4 items-center">
              <button
                className={`border-theme-blue font-semibold border px-6 py-2 rounded-full ${
                  formik.values.mode === "Online"
                    ? "text-white bg-theme-blue-darker"
                    : "text-theme-blue"
                }`}
                onClick={() => formik.setFieldValue("mode", "Online")}
              >
                Online
              </button>
              <button
                className={`border-theme-blue font-semibold border px-6 py-2 rounded-full ${
                  formik.values.mode === "Offline"
                    ? "text-white bg-theme-blue-darker"
                    : "text-theme-blue"
                }`}
                onClick={() => formik.setFieldValue("mode", "Offline")}
              >
                Offline
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-[#333]">Category</h1>
            <div className="flex w-full flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => formik.setFieldValue("category", category)}
                  className={`border-theme-blue font-semibold border px-6 py-2 rounded-full ${
                    formik.values.category === category
                      ? "text-white bg-theme-blue-darker"
                      : "text-theme-blue"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Second Tab */}
      {activeStep === 1 && (
        <div className="py-10 px-10 space-y-8 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] !mb-24">
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="applicationClosingDate"
            >
              Application Close
            </label>
            <input
              id="applicationClosingDate"
              name="applicationClosingDate"
              type="datetime-local"
              className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              onChange={formik.handleChange}
              value={formik.values.applicationClosingDate}
            />
          </div>
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="workshopStartingDate"
            >
              Workshop starting
            </label>
            <input
              id="workshopStartingDate"
              name="workshopStartingDate"
              type="datetime-local"
              className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              onChange={formik.handleChange}
              value={formik.values.workshopStartingDate}
            />
          </div>
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="workshopEndingDate"
            >
              Workshop ending
            </label>
            <input
              id="workshopEndingDate"
              name="workshopEndingDate"
              type="datetime-local"
              className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              onChange={formik.handleChange}
              value={formik.values.workshopEndingDate}
            />
          </div>
        </div>
      )}
      {activeStep === 2 && (
        <>
          <div className="py-10 px-10 space-y-8 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="contactEmail"
              >
                Contact email
              </label>
              <input
                id="contactEmail"
                name="contactEmail"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                placeholder="help@higrow.com"
                onChange={formik.handleChange}
                value={formik.values.contactEmail}
              />
            </div>
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="redirectUrl"
              >
                Where people will be redirected to after joining?
              </label>
              <input
                id="redirectUrl"
                name="redirectUrl"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                placeholder="e.g. link of your whatsapp group invite"
                onChange={formik.handleChange}
                value={formik.values.redirectUrl}
              />
            </div>
          </div>
          <div className="py-10 px-10 space-y-8 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] !mb-24">
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="websiteLink"
              >
                Website
              </label>
              <input
                id="websiteLink"
                name="websiteLink"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.websiteLink}
              />
            </div>
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="facebookLink"
              >
                Facebook
              </label>
              <input
                id="facebookLink"
                name="facebookLink"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.facebookLink}
              />
            </div>
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="discordLink"
              >
                Discord
              </label>
              <input
                id="discordLink"
                name="discordLink"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.discordLink}
              />
            </div>
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="whatsappLink"
              >
                Whatsapp
              </label>
              <input
                id="whatsappLink"
                name="whatsappLink"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.whatsappLink}
              />
            </div>
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="instagramLink"
              >
                Instagram
              </label>
              <input
                id="instagramLink"
                name="instagramLink"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.instagramLink}
              />
            </div>
            <div className="space-y-4">
              <label
                className="block w-fit text-xl font-semibold text-[#333]"
                htmlFor="youtubeLink"
              >
                Youtube
              </label>
              <input
                id="youtubeLink"
                name="youtubeLink"
                type="text"
                className="px-4 py-2 w-full rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.youtubeLink}
              />
            </div>
          </div>
        </>
      )}
    </main>
  );
}