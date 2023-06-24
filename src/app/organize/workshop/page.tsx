"use client";

import "./organize-workshop.scss";
import Link from "next/link";
import { useState } from "react";
import { BiChevronLeft, BiInfoCircle } from "react-icons/bi";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Formik, Form, Field } from "formik";
import {
  steps,
  categories,
  initialValues,
  validationSchema,
} from "@/lib/utils/organizeWorkshopData";

export default function CreateWorkshop() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNextStep = () => setActiveStep(activeStep + 1);
  const handlePreviousStep = () => setActiveStep(activeStep - 1);

  const router = useRouter();
  if (!auth.currentUser) {
    router.replace("/signin");
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
      }}
    >
      {(props) => (
        <Form>
          <main className="max-w-4xl w-full py-24 space-y-8 mx-auto workshop-data-container">
            <div className="flex justify-between items-center mb-20">
              <Link
                href="/organize"
                className="flex space-x-1 text-lg items-center"
              >
                <BiChevronLeft className="text-3xl" />
                <span>Go back</span>
              </Link>
              <div className="flex space-x-2 items-center">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={handlePreviousStep}
                    className="px-8 py-3 rounded-lg bg-[#333] text-neutral-200"
                  >
                    Previous
                  </button>
                )}
                {activeStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-8 py-3 rounded-lg bg-[#333] text-neutral-200"
                  >
                    Next
                  </button>
                )}
                {activeStep === 4 && (
                  <button
                    type="submit"
                    disabled={!props.isValid}
                    className="px-8 py-3 rounded-lg bg-[#333] text-neutral-200 disabled:cursor-not-allowed disabled:opacity-80"
                    onClick={() => {
                      if (!props.isValid) {
                        alert(
                          "Please fill all required (red star) fields with correct information."
                        );
                      }
                    }}
                  >
                    Publish
                  </button>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center px-16 border border-black py-3 rounded-md shadow-[4px_4px_0_#333] bg-[#fff]">
              {steps.map((step, index) => (
                <button
                  className={`text-lg py-3 px-5 rounded-lg ${
                    index === activeStep
                      ? "bg-[#333] text-neutral-200"
                      : " text-[#757575]"
                  }`}
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  type="button"
                >
                  {step.title}
                </button>
              ))}
            </div>
            {/*TODO: First Tab */}
            <div
              className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                activeStep === 0 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="name"
                >
                  Name
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  placeholder="e.g. Full stack web development 101"
                />
              </div>
              <div className="space-y-4">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="tagline"
                >
                  Tagline
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  id="tagline"
                  name="tagline"
                  type="text"
                  className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  placeholder="e.g. Best Web Development workshop in hindi"
                />
              </div>
              <div className="space-y-4">
                <h1 className="text-xl font-semibold text-[#333]">Mode</h1>
                <div className="flex space-x-4 items-center">
                  <button
                    className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                      props.values.mode === "Online"
                        ? "text-white bg-[#007DFB]"
                        : "text-theme-blue"
                    }`}
                    onClick={() => props.setFieldValue("mode", "Online")}
                    type="button"
                  >
                    Online
                  </button>
                  <button
                    className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                      props.values.mode === "Offline"
                        ? "text-white bg-[#007DFB]"
                        : "text-theme-blue"
                    }`}
                    onClick={() => props.setFieldValue("mode", "Offline")}
                    type="button"
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
                      onClick={() => props.setFieldValue("category", category)}
                      className={`border-theme-blue mb-3.5 font-semibold border px-6 py-2 rounded-full ${
                        props.values.category === category
                          ? "text-white bg-[#007DFB]"
                          : "text-theme-blue"
                      }`}
                      type="button"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/*TODO: Second Tab */}
            <div
              className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                activeStep === 1 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="applicationClosingDate"
                >
                  Application Close
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  id="applicationClosingDate"
                  name="applicationClosingDate"
                  type="datetime-local"
                  className="px-4 py-2 w-5/6 h-14  rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                />
              </div>
              <div className="space-y-4">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="workshopStartingDate"
                >
                  Workshop starting
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  id="workshopStartingDate"
                  name="workshopStartingDate"
                  type="datetime-local"
                  className="px-4 py-2 w-5/6 h-14  rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                />
              </div>
              <div className="space-y-4">
                <label
                  className="block w-fit text-xl font-semibold text-[#333]"
                  htmlFor="workshopEndingDate"
                >
                  Workshop ending
                  <span className="text-red-500">*</span>
                </label>
                <Field
                  id="workshopEndingDate"
                  name="workshopEndingDate"
                  type="datetime-local"
                  className="px-4 py-2 w-5/6 h-14  rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                />
              </div>
            </div>
            {/*TODO: Third Step */}
            <>
              <div
                className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                  activeStep === 2 ? "block" : "hidden"
                }`}
              >
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="contactEmail"
                  >
                    Contact email
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="contactEmail"
                    name="contactEmail"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    placeholder="help@higrow.com"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="redirectUrl"
                  >
                    Where people will be redirected to after joining?
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="redirectUrl"
                    name="redirectUrl"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    placeholder="e.g. link of your whatsapp group invite"
                  />
                </div>
              </div>
              <div
                className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                  activeStep === 2 ? "block" : "hidden"
                }`}
              >
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="websiteLink"
                  >
                    Website
                  </label>
                  <Field
                    id="websiteLink"
                    name="websiteLink"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="facebookLink"
                  >
                    Facebook
                  </label>
                  <Field
                    id="facebookLink"
                    name="facebookLink"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="discordLink"
                  >
                    Discord
                  </label>
                  <Field
                    id="discordLink"
                    name="discordLink"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="whatsappLink"
                  >
                    Whatsapp
                  </label>
                  <Field
                    id="whatsappLink"
                    name="whatsappLink"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="instagramLink"
                  >
                    Instagram
                  </label>
                  <Field
                    id="instagramLink"
                    name="instagramLink"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="youtubeLink"
                  >
                    Youtube
                  </label>
                  <Field
                    id="youtubeLink"
                    name="youtubeLink"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                  />
                </div>
              </div>
            </>
            {/*TODO: Fourth Step */}
            {activeStep === 3 && (
              <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="instructorName"
                  >
                    Name of Instructor
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    id="instructorName"
                    name="instructorName"
                    type="text"
                    className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    placeholder="e.g. Puneet Kathuria"
                  />
                </div>
                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="instructorInfo"
                  >
                    Tell us more about Instructor
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    component="textarea"
                    id="instructorInfo"
                    name="instructorInfo"
                    className="px-4 py-2 w-5/6 h-52 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    placeholder="e.g. Tell us about your experience in this field or Tell us why you’re perfect for this "
                  />
                </div>

                <div className="space-y-4">
                  <label
                    className="block w-fit text-xl font-semibold text-[#333]"
                    htmlFor="workshopInfo"
                  >
                    Tell us more about this Workshop
                    <span className="text-red-500">*</span>
                  </label>
                  <Field
                    component="textarea"
                    id="workshopInfo"
                    name="workshopInfo"
                    className="px-4 py-2 w-5/6 h-64 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                    placeholder="Describe in detail about this workshop or Tell us why people should choose your workshop or What people will learn during this?"
                  />
                </div>
              </div>
            )}
            {/* TODO: Fifth Step */}
            <>
              <div
                className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                  activeStep === 4 ? "block" : "hidden"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="space-y-4 w-full">
                    <label
                      className="block w-fit text-xl font-semibold text-[#333]"
                      htmlFor="workingDays"
                    >
                      {"Workshop duration (in days)"}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="workingDays"
                      name="workingDays"
                      type="number"
                      min="1"
                      max="10"
                      className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                      placeholder="e.g. 4"
                    />
                  </div>
                  <div className="space-y-4 w-full">
                    <label
                      className="block w-fit text-xl font-semibold text-[#333]"
                      htmlFor="hoursPerDay"
                    >
                      {"Duration per day (in hours)"}
                      <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id="hoursPerDay"
                      name="hoursPerDay"
                      type="number"
                      min="0"
                      max="12"
                      className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                      placeholder="e.g. 2"
                    />
                  </div>
                </div>
              </div>
              <div
                className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                  activeStep === 4 ? "block" : "hidden"
                }`}
              >
                <div className="space-y-4">
                  <h1 className="text-xl font-semibold text-[#333]">
                    Is it a paid opportunity?
                    <span className="text-red-500">*</span>
                  </h1>
                  <div className="flex space-x-4 items-center">
                    <button
                      className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                        props.values.isPaid
                          ? "text-white bg-[#007DFB]"
                          : "text-theme-blue"
                      }`}
                      type="button"
                      onClick={() => props.setFieldValue("isPaid", true)}
                    >
                      Yes
                    </button>
                    <button
                      className={`border-theme-blue font-semibold border px-7 py-3 rounded-full ${
                        !props.values.isPaid
                          ? "text-white bg-[#007DFB]"
                          : "text-theme-blue"
                      }`}
                      onClick={() => props.setFieldValue("isPaid", false)}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
              {props.values.isPaid && (
                <>
                  <div
                    className={`p-6 flex items-center space-x-8 text-[#757575] border border-black rounded-md bg-white ${
                      activeStep === 4 ? "block" : "hidden"
                    }`}
                  >
                    <BiInfoCircle className="text-7xl" />
                    <p className="">
                      Fill in the details of the account to which you would want
                      the collected amount to be transferred by us once the
                      registrations are closed. The organizers have to fill in
                      the bank account details in the Payout Form while enabling
                      the payment or before the registration deadline to avoid
                      any payment transfer issues.
                    </p>
                  </div>
                  <div
                    className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] workshop-basic ${
                      activeStep === 4 ? "block" : "hidden"
                    }`}
                  >
                    <div className="space-y-4">
                      <label
                        className="block w-fit text-xl font-semibold text-[#333]"
                        htmlFor="backName"
                      >
                        Name
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        id="backName"
                        name="backName"
                        type="text"
                        className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                      />
                    </div>
                    <div className="space-y-4">
                      <label
                        className="block w-fit text-xl font-semibold text-[#333]"
                        htmlFor="bankEmail"
                      >
                        Email
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        id="bankEmail"
                        name="bankEmail"
                        type="text"
                        className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                      />
                    </div>
                    <div className="space-y-4">
                      <label
                        className="block w-fit text-xl font-semibold text-[#333]"
                        htmlFor="bankAccNo"
                      >
                        Account Number
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        id="bankAccNo"
                        name="bankAccNo"
                        type="text"
                        className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                      />
                    </div>
                    <div className="space-y-4">
                      <label
                        className="block w-fit text-xl font-semibold text-[#333]"
                        htmlFor="bankIFSC"
                      >
                        IFSC Code
                        <span className="text-red-500">*</span>
                      </label>
                      <Field
                        id="bankIFSC"
                        name="bankIFSC"
                        type="text"
                        className="px-4 py-2 w-5/6 h-14 rounded-md border-2 bg-[#F4F4F0] border-[#757575]"
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          </main>
        </Form>
      )}
    </Formik>
  );
}
