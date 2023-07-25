"use client"
import "react-quill/dist/quill.snow.css"
import Link from "next/link"
import { useState, useEffect } from "react"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import {
  steps,
  categories,
  initialValues,
  validationSchema,
} from "@/lib/utils/organize-workshop"
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useAlert } from "@/states/alert"
import { Info, Loader2 } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import ReactQuill from "react-quill"

const allLinks = (...links: string[]) => {
  const finalLinks: string[] = []
  links.forEach((link) => {
    if (link.length > 0) finalLinks.push(link)
  })
  return finalLinks
}

export default function CreateWorkshop() {
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { showAutoCloseAlert, showAlert } = useAlert()

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })

  const modeValue = useWatch({
    control: form.control,
    name: "mode",
    defaultValue: "Online",
  })
  const categoryValue = useWatch({
    control: form.control,
    name: "category",
    defaultValue: "Coding",
  })
  const isPaidValue = useWatch({
    control: form.control,
    name: "isPaid",
    defaultValue: true,
  })
  const instructorInfoValue = useWatch({
    control: form.control,
    name: "instructorInfo",
    defaultValue: "",
  })
  const workshopInfoValue = useWatch({
    control: form.control,
    name: "workshopInfo",
    defaultValue: "",
  })
  const describeEachDayValue = useWatch({
    control: form.control,
    name: "describeEachDay",
    defaultValue: "",
  })

  const handleNextStep = () => {
    if (document) {
      const reqEl = document.getElementById(steps[activeStep + 1].id)
      reqEl?.scrollIntoView({ behavior: "smooth", inline: "center" })
    }
    setActiveStep(activeStep + 1)
  }
  const handlePreviousStep = () => {
    if (document) {
      const reqEl = document.getElementById(steps[activeStep - 1].id)
      reqEl?.scrollIntoView({ behavior: "smooth", inline: "center" })
    }
    setActiveStep(activeStep - 1)
  }

  const router = useRouter()
  useEffect(() => {
    if (!auth.currentUser) router.replace("/signin?redirect=organize/workshop")
  }, [])

  const submitData = async (values: typeof initialValues) => {
    setIsLoading(true)
    const {
      bankName,
      bankEmail,
      bankAccNo,
      bankIFSC,
      contactEmail,
      describeEachDay,
      discordLink,
      youtubeLink,
      facebookLink,
      instagramLink,
      instructorInfo,
      instructorName,
      isPaid,
      redirectUrl,
      timeFormat,
      timePerDay,
      workingDays,
      websiteLink,
      whatsappLink,
      workshopAmount,
      workshopInfo,
      workshopEndingDate,
      workshopStartingDate,
      applicationClosingDate,
      ...publicFields
    } = values
    const allSocialLinks = allLinks(
      discordLink,
      youtubeLink,
      facebookLink,
      instagramLink,
      websiteLink,
      whatsappLink
    )
    const docRef = await addDoc(collection(db, "workshops"), {
      public: {
        ...publicFields,
        application_closing_date: Timestamp.fromDate(
          new Date(values.applicationClosingDate)
        ),
        workshop_starting_date: Timestamp.fromDate(
          new Date(values.workshopStartingDate)
        ),
        workshop_ending_date: Timestamp.fromDate(
          new Date(values.workshopEndingDate)
        ),
        created_on: Timestamp.now(),
        approved: false,
        participants: [],
        requested_participants: [],
        contact_email: contactEmail,
        redirect_url: redirectUrl,
        describe_each_day: describeEachDay,
        social_links: allSocialLinks,
        instructor_info: instructorInfo,
        instructor_name: instructorName,
        workshop_amount: workshopAmount,
        workshop_info: workshopInfo,
        time_per_day: timePerDay,
        time_format: timeFormat,
        working_days: workingDays,
        is_paid: isPaid,
        created_by: auth.currentUser?.uid,
        editors: [],
      },
      private: isPaid
        ? {
            bank_name: bankName,
            bank_email: bankEmail,
            bank_account_number: bankAccNo,
            bank_ifsc: bankIFSC,
            payment_records: [],
          }
        : {},
    })
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      organized_workshops: arrayUnion(docRef.id),
    })
    setIsLoading(false)
    showAlert({
      title: "Success.",
      description:
        "Workshop successfully created. Workshop details will be reviewed. Once the workshop is approved you can view or edit it from dashboard.",
      type: "default",
      action: { text: "Okay", callback: () => router.replace("/dashboard") },
    })
  }

  return (
    <Form {...form}>
      <main className="max-w-4xl md:px-4 w-full py-12 md:py-24 space-y-8 mx-auto">
        <form onSubmit={form.handleSubmit(submitData)} className="space-y-6">
          <div className="flex justify-between md:items-center mb-16 md:mb-20 flex-col gap-y-2 md:flex-row">
            <Link
              href="/organize"
              className="flex space-x-1 items-center w-fit"
            >
              <Button className="text-base" variant={"ghost"}>
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                <span>Go back</span>
              </Button>
            </Link>
            <div className="flex space-x-3 md:space-x-6 items-center justify-end">
              {activeStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="bg-transparent border-secondary h-9 md:h-11 rounded-md md:px-8"
                >
                  Previous
                </Button>
              )}
              {activeStep < steps.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNextStep}
                  className="bg-transparent border-secondary h-9 md:h-11 rounded-md md:px-8"
                >
                  Next
                </Button>
              )}
              {activeStep === 4 && (
                <Button
                  type="submit"
                  variant="secondary"
                  className="border border-secondary h-9 md:h-11 rounded-md md:px-8"
                  onClick={() => {
                    if (!form.formState.isValid) {
                      showAutoCloseAlert({
                        title: "Error!",
                        description: "Please fill out the red fields.",
                        type: "destructive",
                      })
                    }
                  }}
                  // onClick={() => {
                  //   try {
                  //     const result = validationSchema.safeParse(
                  //       form.getValues()
                  //     )
                  //     if (!result.success) {
                  //       const firstErrorField = result.error.issues[0]
                  //         .path[0] as string
                  //       steps.forEach((step, index) => {
                  //         if (step.validationFields.includes(firstErrorField)) {
                  //           setActiveStep(index)
                  //         }
                  //       })
                  //     }
                  //   } catch (error) {}
                  // }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Publish"
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="flex justify-between gap-5 items-center px-8 overflow-x-auto lg:px-16 border-t border-b md:border border-black py-3 md:rounded-md md:shadow-[4px_4px_0_#333] bg-[#fff] snap-x snap-mandatory">
            {steps.map((step, index) => (
              <button
                className={`lg:text-lg py-3 px-5 flex-grow rounded-lg snap-center ${
                  index === activeStep
                    ? "bg-[#333] text-neutral-200"
                    : " text-[#757575]"
                }`}
                key={step.title}
                id={step.id}
                onClick={(e) => {
                  const target = e.target as Element
                  target.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                  })
                  setActiveStep(index)
                }}
                type="button"
              >
                {step.title}
              </button>
            ))}
          </div>
          {/*TODO: First Tab */}
          <div
            className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 border-t border-b md:border border-black bg-white ${
              activeStep === 0 ? "block" : "hidden"
            }`}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4"
                      placeholder="Web development bootcamp"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">Tagline</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4"
                      placeholder="e.g. Best Web Development workshop in hindi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h1 className="text-md md:text-xl">
                Mode
              </h1>
              <div className="flex space-x-3 items-center">
                <Button
                  variant={modeValue === "Online" ? "default" : "outline"}
                  className={` font-base md:font-semibold border rounded-full md:h-11 md:px-8`}
                  onClick={() => form.setValue("mode", "Online")}
                  type="button"
                >
                  Online
                </Button>
                <Button
                  variant={modeValue === "Offline" ? "default" : "outline"}
                  className={`border font-base md:font-semibold rounded-full md:h-11 md:px-8`}
                  onClick={() => form.setValue("mode", "Offline")}
                  type="button"
                >
                  Offline
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-md md:text-xl">
                Category
              </h1>
              <div className="flex w-full flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => form.setValue("category", category)}
                    variant={categoryValue === category ? "default" : "outline"}
                    className={`border font-base md:font-semibold rounded-full md:h-11 md:px-8`}
                    type="button"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          {/*TODO: Second Tab */}
          <div
            className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 border-t border-b md:border border-black bg-white ${
              activeStep === 1 ? "block" : "hidden"
            }`}
          >
            <FormField
              control={form.control}
              name="applicationClosingDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">
                    Application Close
                  </FormLabel>
                  <FormControl>
                    <Input className="px-4" type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workshopStartingDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">
                    Workshop starting
                  </FormLabel>
                  <FormControl>
                    <Input className="px-4" type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workshopEndingDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">
                    Workshop ending
                  </FormLabel>
                  <FormControl>
                    <Input className="px-4" type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*TODO: Third Step */}
          <>
            <div
              className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 border-t border-b md:border border-black bg-white ${
                activeStep === 2 ? "block" : "hidden"
              }`}
            >
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Contact email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="px-4"
                        placeholder="e.g. help@higrow.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Where people will be redirected to after joining?
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="px-4"
                        placeholder="e.g. link of your whatsapp group invite"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14border-t border-b md:border border-black bg-white ${
                activeStep === 2 ? "block" : "hidden"
              }`}
            >
              <FormField
                control={form.control}
                name="websiteLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Website
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facebookLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Facebook
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discordLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Discord
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsappLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Whatsapp
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instagramLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="youtubeLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Youtube
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
          {/*TODO: Fourth Step */}
          {activeStep === 3 && (
            <div className="py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 bg-[#fff] border-t border-b md:border border-black">
              <FormField
                control={form.control}
                name="instructorName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Name of Instructor
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="px-4"
                        placeholder="e.g. Puneet Kathuria"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="instructorInfo"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Tell us more about Instructor
                    </FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                              "link",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["clean"],
                          ],
                        }}
                        value={instructorInfoValue}
                        onChange={(val) => form.setValue("instructorInfo", val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workshopInfo"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Tell us more about this Workshop
                    </FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                              "link",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["clean"],
                          ],
                        }}
                        value={workshopInfoValue}
                        onChange={(val) => form.setValue("workshopInfo", val)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {/* TODO: Fifth Step */}
          <>
            <div
              className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 border-t border-b md:border border-black bg-white ${
                activeStep === 4 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col space-y-10 md:space-y-0 md:flex-row lg:items-center gap-2">
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-md md:text-xl">
                        Workshop duration (in days)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="px-4"
                          placeholder="e.g. 4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timePerDay"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-md md:text-xl flex space-x-1">
                        <span>Duration per day</span>
                        <FormField
                          control={form.control}
                          name="timeFormat"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-y-0 space-x-2">
                              <FormLabel className="text-md md:text-xl">
                                (in
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="flex space-x-1 items-center"
                                >
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="hours" />
                                    </FormControl>
                                    <FormLabel className="text-base">
                                      hrs
                                    </FormLabel>
                                  </FormItem>
                                  <FormItem className="flex items-center space-x-1 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="mins" />
                                    </FormControl>
                                    <FormLabel className="text-base">
                                      mins
                                    </FormLabel>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        )
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="px-4"
                          placeholder="e.g. 4"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="describeEachDay"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      What you'll teach in each day
                    </FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="snow"
                        placeholder="Describe in brief what you will teach in each day of this workshop. e.g. Day - 1 : We'll learn basics of designing by doing some projects, Day 2 - ..."
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, false] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                              "link",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["clean"],
                          ],
                        }}
                        value={describeEachDayValue}
                        onChange={(val) =>
                          form.setValue("describeEachDay", val)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 border-t border-b md:border border-black bg-white ${
                activeStep === 4 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <h1 className="text-md md:text-xl font-semibold text-[#333]">
                  Is it a paid opportunity?
                </h1>
                <div className="flex space-x-4 items-center">
                  <Button
                    variant={isPaidValue ? "default" : "outline"}
                    className={`border font-semibold rounded-full`}
                    type="button"
                    size="lg"
                    onClick={() => form.setValue("isPaid", true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={!isPaidValue ? "default" : "outline"}
                    className={`border font-semibold rounded-full`}
                    type="button"
                    size="lg"
                    onClick={() => form.setValue("isPaid", false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
            {isPaidValue && (
              <>
                <div
                  className={`p-6 flex items-center space-x-8 text-[#5f5f5f] border-t border-b md:border border-black bg-white ${
                    activeStep === 4 ? "block" : "hidden"
                  }`}
                >
                  <Info className="w-20 h-20" />
                  <p className="text-sm md:text-base">
                    Fill in the details of the account to which you would want
                    the collected amount to be transferred by us once the
                    registrations are closed. The organizers have to fill in the
                    bank account details in the Payout Form while enabling the
                    payment or before the registration deadline to avoid any
                    payment transfer issues.
                  </p>
                </div>
                <div
                  className={`py-16 px-6 sm:px-10 space-y-10 lg:space-y-14 border-t border-b md:border border-black bg-white ${
                    activeStep === 4 ? "block" : "hidden"
                  }`}
                >
                  <FormField
                    control={form.control}
                    name="workshopAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-md md:text-xl">
                          Entry Amount/Fee (in INR)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="px-4"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-md md:text-xl">
                          Account holder name
                        </FormLabel>
                        <FormControl>
                          <Input className="px-4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankEmail"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-md md:text-xl">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input className="px-4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankAccNo"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-md md:text-xl">
                          Account Number
                        </FormLabel>
                        <FormControl>
                          <Input className="px-4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bankIFSC"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-md md:text-xl">
                          IFSC Code
                        </FormLabel>
                        <FormControl>
                          <Input className="px-4" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </>
        </form>
      </main>
    </Form>
  )
}
