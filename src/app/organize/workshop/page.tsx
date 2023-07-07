"use client"

// TODO: server action

import Link from "next/link"
import { useState } from "react"
import { BiChevronLeft, BiInfoCircle } from "react-icons/bi"
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

export default function CreateWorkshop() {
  const [activeStep, setActiveStep] = useState(0)
  const { showAutoCloseAlert } = useAlert()

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

  const handleNextStep = () => setActiveStep(activeStep + 1)
  const handlePreviousStep = () => setActiveStep(activeStep - 1)

  const router = useRouter()
  if (!auth.currentUser) {
    router.replace("/signin")
  }

  const submitData = async (values: typeof initialValues) => {
    const { bankName, bankEmail, bankAccNo, bankIFSC, ...publicFields } = values
    const docRef = await addDoc(collection(db, "workshops"), {
      public: {
        ...publicFields,
        applicationClosingDate: Timestamp.fromDate(
          new Date(values.applicationClosingDate)
        ),
        workshopStartingDate: Timestamp.fromDate(
          new Date(values.workshopStartingDate)
        ),
        workshopEndingDate: Timestamp.fromDate(
          new Date(values.workshopEndingDate)
        ),
      },
      private: {
        bankName,
        bankEmail,
        bankAccNo,
        bankIFSC,
      },
    })
    await updateDoc(doc(db, "users", auth.currentUser!.uid), {
      organizedWorkshops: arrayUnion(docRef.id),
    })
    showAutoCloseAlert({
      title: "Success.",
      description:
        "Workshop successfully created. View or edit it from dashboard.",
      type: "default",
    })
    router.replace("/dashboard")
  }

  return (
    <Form {...form}>
      <main className="max-w-4xl w-full py-24 space-y-8 mx-auto">
        <form
          onError={() => console.log("hello")}
          onSubmit={form.handleSubmit(submitData)}
          className="space-y-6"
        >
          <div className="flex justify-between items-center mb-20">
            <Link
              href="/organize"
              className="flex space-x-1 text-lg items-center"
            >
              <BiChevronLeft className="text-3xl" />
              <span>Go back</span>
            </Link>
            <div className="flex space-x-6 items-center">
              {activeStep > 0 && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="bg-transparent border-[#333]"
                >
                  Previous
                </Button>
              )}
              {activeStep < steps.length - 1 && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={handleNextStep}
                  className="bg-transparent border-[#333]"
                >
                  Next
                </Button>
              )}
              {activeStep === 4 && (
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="border border-secondary"
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
                  Publish
                </Button>
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
            className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
              activeStep === 0 ? "block" : "hidden"
            }`}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xl">Title</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4 text-lg"
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
                  <FormLabel className="text-xl">Tagline</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4 text-lg"
                      placeholder="e.g. Best Web Development workshop in hindi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-[#333]">Mode</h1>
              <div className="flex space-x-3 items-center">
                <Button
                  variant={modeValue === "Online" ? "default" : "outline"}
                  className={`border-primary font-semibold border rounded-full`}
                  onClick={() => form.setValue("mode", "Online")}
                  type="button"
                  size="lg"
                >
                  Online
                </Button>
                <Button
                  variant={modeValue === "Offline" ? "default" : "outline"}
                  className={`border-primary font-semibold border rounded-full`}
                  onClick={() => form.setValue("mode", "Offline")}
                  type="button"
                  size="lg"
                >
                  Offline
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-xl font-semibold text-[#333]">Category</h1>
              <div className="flex w-full flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    onClick={() => form.setValue("category", category)}
                    variant={categoryValue === category ? "default" : "outline"}
                    size="lg"
                    className={`border-primary font-semibold border rounded-full`}
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
            className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
              activeStep === 1 ? "block" : "hidden"
            }`}
          >
            <FormField
              control={form.control}
              name="applicationClosingDate"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xl">Application Close</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4 text-lg"
                      type="datetime-local"
                      {...field}
                    />
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
                  <FormLabel className="text-xl">Workshop starting</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4 text-lg"
                      type="datetime-local"
                      {...field}
                    />
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
                  <FormLabel className="text-xl">Workshop ending</FormLabel>
                  <FormControl>
                    <Input
                      className="px-4 text-lg"
                      type="datetime-local"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/*TODO: Third Step */}
          <>
            <div
              className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
                activeStep === 2 ? "block" : "hidden"
              }`}
            >
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xl">Contact email</FormLabel>
                    <FormControl>
                      <Input
                        className="px-4 text-lg"
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
                    <FormLabel className="text-xl">
                      Where people will be redirected to after joining?
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="px-4 text-lg"
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
              className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
                activeStep === 2 ? "block" : "hidden"
              }`}
            >
              <FormField
                control={form.control}
                name="websiteLink"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xl">Website</FormLabel>
                    <FormControl>
                      <Input className="px-4 text-lg" {...field} />
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
                    <FormLabel className="text-xl">Facebook</FormLabel>
                    <FormControl>
                      <Input className="px-4 text-lg" {...field} />
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
                    <FormLabel className="text-xl">Discord</FormLabel>
                    <FormControl>
                      <Input className="px-4 text-lg" {...field} />
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
                    <FormLabel className="text-xl">Whatsapp</FormLabel>
                    <FormControl>
                      <Input className="px-4 text-lg" {...field} />
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
                    <FormLabel className="text-xl">Instagram</FormLabel>
                    <FormControl>
                      <Input className="px-4 text-lg" {...field} />
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
                    <FormLabel className="text-xl">Youtube</FormLabel>
                    <FormControl>
                      <Input className="px-4 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
          {/*TODO: Fourth Step */}
          {activeStep === 3 && (
            <div className="py-16 px-10 space-y-14 bg-[#fff] border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333]">
              <FormField
                control={form.control}
                name="instructorName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xl">
                      Name of Instructor
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="px-4 text-lg"
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
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xl">
                      Tell us more about Instructor
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={6} className="px-4 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workshopInfo"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xl">
                      Tell us more about this Workshop
                    </FormLabel>
                    <FormControl>
                      <Textarea rows={6} className="px-4 text-lg" {...field} />
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
              className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
                activeStep === 4 ? "block" : "hidden"
              }`}
            >
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="workingDays"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="text-xl">
                        Workshop duration (in days)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="px-4 text-lg"
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
                      <FormLabel className="text-xl flex space-x-1">
                        <span>Duration per day</span>
                        <FormField
                          control={form.control}
                          name="timeFormat"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-y-0 space-x-2">
                              <FormLabel className="text-xl">(in</FormLabel>
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
                          className="px-4 text-lg"
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
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xl">
                      What you'll teach in each day
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="px-4 text-lg"
                        rows={6}
                        placeholder="Describe in brief what you will teach in each day of this workshop. e.g. Day - 1 : We'll learn basics of designing by doing some projects, Day 2 - ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div
              className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
                activeStep === 4 ? "block" : "hidden"
              }`}
            >
              <div className="space-y-4">
                <h1 className="text-xl font-semibold text-[#333]">
                  Is it a paid opportunity?
                </h1>
                <div className="flex space-x-4 items-center">
                  <Button
                    variant={isPaidValue ? "default" : "outline"}
                    className={`border-primary font-semibold border rounded-full`}
                    type="button"
                    size="lg"
                    onClick={() => form.setValue("isPaid", true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={!isPaidValue ? "default" : "outline"}
                    className={`border-primary font-semibold border rounded-full`}
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
                  className={`p-6 flex items-center space-x-8 text-[#5f5f5f] border border-black rounded-md bg-white ${
                    activeStep === 4 ? "block" : "hidden"
                  }`}
                >
                  <BiInfoCircle className="text-7xl" />
                  <p className="">
                    Fill in the details of the account to which you would want
                    the collected amount to be transferred by us once the
                    registrations are closed. The organizers have to fill in the
                    bank account details in the Payout Form while enabling the
                    payment or before the registration deadline to avoid any
                    payment transfer issues.
                  </p>
                </div>
                <div
                  className={`py-16 px-10 space-y-14 border-2 border-[#333] rounded-md shadow-[4px_4px_0_#333] bg-white ${
                    activeStep === 4 ? "block" : "hidden"
                  }`}
                >
                  <FormField
                    control={form.control}
                    name="workshopAmount"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="text-xl">
                          Entry Amount/Fee (in INR)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            className="px-4 text-lg"
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
                        <FormLabel className="text-xl">
                          Account holder name
                        </FormLabel>
                        <FormControl>
                          <Input className="px-4 text-lg" {...field} />
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
                        <FormLabel className="text-xl">Email</FormLabel>
                        <FormControl>
                          <Input className="px-4 text-lg" {...field} />
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
                        <FormLabel className="text-xl">
                          Account Number
                        </FormLabel>
                        <FormControl>
                          <Input className="px-4 text-lg" {...field} />
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
                        <FormLabel className="text-xl">IFSC Code</FormLabel>
                        <FormControl>
                          <Input className="px-4 text-lg" {...field} />
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
