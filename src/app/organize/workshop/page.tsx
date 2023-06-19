"use client";

import "./organize-workshop.scss";
import Link from "next/link";
import { useState } from "react";
import { BiChevronLeft, BiInfoCircle } from "react-icons/bi";
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
    "Ai/Ml",
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
      workshopInfo: "",
      instructorInfo: "",
      instructorName: "",
      workingDays: 4,
      hoursPerDay: 2,
      isPaid: true,
      backName: "",
      bankEmail: "",
      bankAccNo: "",
      bankIFSC: "",
    },
    onSubmit: () => {},
  });

  const router = useRouter();
  console.log(auth.currentUser?.emailVerified);
  if (!auth.currentUser) {
    router.replace("/signin");
  }

  return (
    <main className="max-w-4xl w-full py-24 space-y-8 mx-auto workshop-data-container">
      <div className="flex justify-between items-center mb-20">
        <Link href="/organize" className="flex space-x-1 text-lg items-center">
          <BiChevronLeft className="text-3xl" />
          <span>Go back</span>
        </Link>
        <button className="px-8 py-3 rounded-lg bg-[#333] text-neutral-200">
          Publish
        </button>
      </div>
      <div className="flex justify-between items-center px-16 border border-black py-3 rounded-md shadow-[4px_4px_0_#333] bg-[#fff]">
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
        <div className="py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic">
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
              className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
              className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              placeholder="e.g. Best Web Development workshop in hindi"
              onChange={formik.handleChange}
              value={formik.values.tagline}
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-xl font-semibold text-[#333]">Mode</h1>
            <div className="flex space-x-4 items-center">
              <button
                className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                  formik.values.mode === "Online"
                    ? "text-white bg-[#007DFB]"
                    : "text-theme-blue"
                }`}
                onClick={() => formik.setFieldValue("mode", "Online")}
              >
                Online
              </button>
              <button
                className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                  formik.values.mode === "Offline"
                    ? "text-white bg-[#007DFB]"
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
                  className={`border-theme-blue mb-3.5 font-semibold border px-6 py-2 rounded-full ${
                    formik.values.category === category
                      ? "text-white bg-[#007DFB]"
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
        <div className="py-16 px-10 space-y-14 border-2 border-[#333] bg-[#fff] rounded-md shadow-[4px_4px_0_#333]">
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
              className="px-4 py-2 w-5/6 h-14  rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
              className="px-4 py-2 w-5/6 h-14  rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
              className="px-4 py-2 w-5/6 h-14  rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              onChange={formik.handleChange}
              value={formik.values.workshopEndingDate}
            />
          </div>
        </div>
      )}
      {activeStep === 2 && (
        <>
          <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                placeholder="e.g. link of your whatsapp group invite"
                onChange={formik.handleChange}
                value={formik.values.redirectUrl}
              />
            </div>
          </div>
          <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
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
                className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                onChange={formik.handleChange}
                value={formik.values.youtubeLink}
              />
            </div>
          </div>
        </>
      )}
      {activeStep === 3 && (
        <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="instructorName"
            >
              Name of Instructor
            </label>
            <input
              id="instructorName"
              name="instructorName"
              type="text"
              className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              placeholder="e.g. Puneet Kathuria"
              onChange={formik.handleChange}
              value={formik.values.instructorName}
            />
          </div>
          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="instructorInfo"
            >
              Tell us more about Instructor
            </label>
            <textarea
              id="instructorInfo"
              name="instructorInfo"
              className="px-4 py-2 w-5/6 h-52 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              placeholder="e.g. Tell us about your experience in this field or Tell us why you’re perfect for this "
              onChange={formik.handleChange}
              value={formik.values.instructorInfo}
            />
          </div>

          <div className="space-y-4">
            <label
              className="block w-fit text-xl font-semibold text-[#333]"
              htmlFor="workshopInfo"
            >
              Tell us more about this Workshop
            </label>
            <textarea
              id="workshopInfo"
              name="workshopInfo"
              className="px-4 py-2 w-5/6 h-64 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
              placeholder="Describe in detail about this workshop or Tell us why people should choose your workshop or What people will learn during this?"
              onChange={formik.handleChange}
              value={formik.values.workshopInfo}
            />
          </div>
        </div>
      )}
      {activeStep === 4 && (
        <>
          <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
            <div className="flex items-center gap-2">
              <div className="space-y-4 w-full">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="workingDays"
                >
                  {"Workshop duration (in days)"}
                </label>
                <input
                  id="workingDays"
                  name="workingDays"
                  type="number"
                  min="1"
                  max="10"
                  className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  placeholder="e.g. 4"
                  onChange={formik.handleChange}
                  value={formik.values.workingDays}
                />
              </div>
              <div className="space-y-4 w-full">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="hoursPerDay"
                >
                  {"Duration per day (in hours)"}
                </label>
                <input
                  id="hoursPerDay"
                  name="hoursPerDay"
                  type="number"
                  min="0"
                  max="12"
                  className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  placeholder="e.g. 2"
                  onChange={formik.handleChange}
                  value={formik.values.hoursPerDay}
                />
              </div>
            </div>
          </div>
          <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-[#333]">
                Is it a paid opportunity?
              </h1>
              <div className="flex space-x-4 items-center">
                <button
                  className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                    formik.values.isPaid
                      ? "text-white bg-[#007DFB]"
                      : "text-theme-blue"
                  }`}
                  onClick={() => formik.setFieldValue("isPaid", true)}
                >
                  Yes
                </button>
                <button
                  className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                    !formik.values.isPaid
                      ? "text-white bg-[#007DFB]"
                      : "text-theme-blue"
                  }`}
                  onClick={() => formik.setFieldValue("isPaid", false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
          {formik.values.isPaid && (
            <>
              <div className="p-6 flex items-center space-x-8 text-[#757575] border border-black rounded-md bg-white">
                <BiInfoCircle className="text-7xl" />
                <p className="">
                  Fill in the details of the account to which you would want the
                  collected amount to be transferred by us once the
                  registrations are closed. The organizers have to fill in the
                  bank account details in the Payout Form while enabling the
                  payment or before the registration deadline to avoid any
                  payment transfer issues.
                </p>
              </div>
              <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="backName"
                  >
                    Name
                  </label>
                  <input
                    id="backName"
                    name="backName"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    onChange={formik.handleChange}
                    value={formik.values.backName}
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="bankEmail"
                  >
                    Email
                  </label>
                  <input
                    id="bankEmail"
                    name="bankEmail"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    onChange={formik.handleChange}
                    value={formik.values.bankEmail}
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="bankAccNo"
                  >
                    Account Number
                  </label>
                  <input
                    id="bankAccNo"
                    name="bankAccNo"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    onChange={formik.handleChange}
                    value={formik.values.bankAccNo}
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="bankIFSC"
                  >
                    IFSC Code
                  </label>
                  <input
                    id="bankIFSC"
                    name="bankIFSC"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    onChange={formik.handleChange}
                    value={formik.values.bankIFSC}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </main>
  );
}
