"use client"
import "react-quill/dist/quill.snow.css"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  steps,
  categories,
  initialValues,
  validationSchema,
} from "@/lib/utils/organize-workshop"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { useAlert } from "@/states/alert"
import { CalendarIcon, Info, Loader2 } from "lucide-react"
import { ChevronLeft } from "lucide-react"
import ReactQuill from "react-quill"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/types/database"
import * as z from "zod"
import { getUser } from "@/app/_actions/workshop"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const allLinks = (...links: string[]) => {
  const finalLinks: string[] = []
  links.forEach((link) => {
    if (link.length > 0) finalLinks.push(link)
  })
  return finalLinks
}

export default function CreateWorkshop() {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { showAutoCloseAlert, showAlert } = useAlert()

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })

  const {
    isValid,
    isValidating,
    isDirty,
    isSubmitting,
    isLoading: ISLOADING,
  } = form.formState

  const modeValue = useWatch({
    control: form.control,
    name: "mode",
    defaultValue: "Online",
  })
  const eventLocationValue = useWatch({
    control: form.control,
    name: "eventLocation",
    defaultValue: "",
  })
  const categoryValue = useWatch({
    control: form.control,
    name: "category",
    defaultValue: "Coding",
  })
  const isPaidValue = useWatch({
    control: form.control,
    name: "isPaid",
    defaultValue: false,
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
  const timeFormatValue = useWatch({
    control: form.control,
    name: "timeFormat",
    defaultValue: "hours",
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

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) router.replace("/signin?redirect=organize/workshop")
  }

  useEffect(() => {
    checkSession()
  }, [])

  const submitData: any = async (values: z.infer<typeof validationSchema>) => {
    setIsLoading(true)
    const user = await supabase.auth.getSession()
    const {
      eventLocation,
      otherCategory,
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
      discordLink!,
      youtubeLink!,
      facebookLink!,
      instagramLink!,
      websiteLink!,
      whatsappLink!
    )
    const data = await supabase
      .from("workshops")
      .insert({
        ...publicFields,
        event_location: eventLocation,
        other_category: otherCategory,
        application_closing_date: new Date(
          values.applicationClosingDate
        ).toISOString(),
        workshop_starting_date: new Date(
          values.workshopStartingDate
        ).toISOString(),
        workshop_ending_date: new Date(values.workshopEndingDate).toISOString(),
        participants: [],
        requested_participants: [],
        contact_email: contactEmail,
        redirect_url: redirectUrl,
        describe_each_day: describeEachDay,
        social_links: allSocialLinks,
        instructor_info: instructorInfo,
        instructor_name: instructorName,
        workshop_amount: isPaid ? workshopAmount : null,
        workshop_info: workshopInfo,
        time_per_day: timePerDay,
        time_format: timeFormat,
        working_days: workingDays,
        is_paid: isPaid,
        created_by: user.data.session!.user.id,
        announcements: [],
        bank_details: isPaid
          ? {
              name: bankName,
              email: bankEmail,
              IFSC: bankIFSC,
              account_number: bankAccNo,
            }
          : null,
      })
      .select("id")
      .single()
    const userData = await getUser()
    if (!!userData && !!data.data) {
      const shops = userData.organized_workshops
      shops.push(data.data.id)
      await supabase
        .from("users")
        .update({ organized_workshops: shops })
        .eq("id", userData.id)
    }
    setIsLoading(false)
    if (!data.error)
      showAlert({
        title: "Success.",
        description:
          "Workshop successfully created. Workshop details will be reviewed. Once the workshop is approved you can view or edit it from dashboard.",
        type: "default",
        action: {
          text: "Okay",
          callback: () => null,
        },
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
                    const result = validationSchema.safeParse(form.getValues())
                    if (!result.success) {
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
              <h1 className="text-md md:text-xl">Mode</h1>
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
            {modeValue === "Offline" && (
              <FormField
                control={form.control}
                name="eventLocation"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Location of offline event
                    </FormLabel>
                    <FormControl>
                      <ReactQuill
                        theme="bubble"
                        value={eventLocationValue}
                        onChange={(val) => form.setValue("eventLocation", val)}
                        placeholder="Enter location here"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <h1 className="text-md md:text-xl">Category</h1>
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
            {categoryValue === "Other" && (
              <FormField
                control={form.control}
                name="otherCategory"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-md md:text-xl">
                      Name of category
                    </FormLabel>
                    <FormControl>
                      <Input className="px-4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md md:text-xl">
                    Application Close
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "max-w-[440px] w-full pl-3 text-left font-normal text-[12px] md:text-base",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workshopStartingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md md:text-xl">
                    Workshop starting
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "max-w-[440px] w-full pl-3 text-left font-normal text-[12px] md:text-base",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workshopEndingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-md md:text-xl">
                    Workshop ending
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "max-w-[440px] w-full pl-3 text-left font-normal text-[12px] md:text-base",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
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
                            [{ header: [false] }],
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
                            [{ header: [false] }],
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
                        placeholder="e.g. 2 (Days)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-10 md:space-y-0 md:flex-row lg:items-center gap-2">
                <FormField
                  control={form.control}
                  name="timeFormat"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormLabel className="text-md md:text-xl">
                        Duration format
                      </FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="flex h-10 md:h-12 w-full outline-0 rounded-md shadow-sm border border-input border-black px-3 py-2 text-sm md:text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[12px] md:placeholder:text-base placeholder:text-muted-foreground focus-visible:outline-none focus:border-2 disabled:cursor-not-allowed disabled:opacity-50">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem className="text-base" value="hours">
                            Hours
                          </SelectItem>
                          <SelectItem className="text-base" value="mins">
                            Minutes
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          className="px-4"
                          placeholder={
                            timeFormatValue === "hours" ? "e.g. 2 (hours)" : "e.g. 120 (minutes)"
                          }
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
                      What you'll teach?
                    </FormLabel>
                    <FormControl>
                      <ReactQuill
                        placeholder="Describe in brief what you will teach in each your workshop e.g. In this workshop, we'll understand the basics of web development from scratch which includes HTML, CSS, JS..."
                        modules={{
                          toolbar: [
                            [{ header: [false] }],
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
                            ]
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
