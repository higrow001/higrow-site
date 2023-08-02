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
  FormDescription,
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
import Image from "next/image"
import * as Dialog from "@radix-ui/react-dialog"

type Link = string | undefined

const allLinks = (...links: Link[]) => {
  const finalLinks: string[] = []
  links.forEach((link) => {
    if (link && link.length > 0) finalLinks.push(link)
  })
  return finalLinks
}

export default function CreateWorkshop() {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [postSubmit, setPostSubmit] = useState({ show: false, logMsg: "" })
  const { showAutoCloseAlert, showAlert } = useAlert()
  const [fileInputState, setFileInputState] = useState<{
    showError: boolean
    errorMsg: string
    file: null | File
  }>({ showError: false, errorMsg: "", file: null })

  const form = useForm<any>({
    resolver: zodResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  })

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

  const submitData = async (values: z.infer<typeof validationSchema>) => {
    if (fileInputState.showError) return
    setIsLoading(true)
    setPostSubmit({ show: true, logMsg: "Creating Workshop..." })
    const user = await supabase.auth.getSession()
    const allSocialLinks = allLinks(
      values.discordLink!,
      values.youtubeLink!,
      values.facebookLink!,
      values.instagramLink!,
      values.websiteLink!,
      values.whatsappLink!
    )
    const data = await supabase
      .from("workshops")
      .insert({
        name: values.name,
        tagline: values.tagline,
        mode: values.mode,
        category: values.category,
        event_location: values.eventLocation,
        other_category: values.otherCategory,
        application_closing_date: new Date(
          values.applicationClosingDate
        ).toISOString(),
        workshop_starting_date: new Date(
          values.workshopStartingDate
        ).toISOString(),
        workshop_ending_date: new Date(values.workshopEndingDate).toISOString(),
        session_start_time: values.sessionStartingTime,
        session_end_time: values.sessionEndingTime,
        participants: [],
        requested_participants: [],
        contact_email: values.contactEmail,
        describe_each_day: values.describeEachDay,
        social_links: allSocialLinks,
        instructor_info: values.instructorInfo,
        instructor_name: values.instructorName,
        workshop_amount: values.isPaid ? values.workshopAmount : null,
        workshop_info: values.workshopInfo,
        working_days: values.workingDays,
        is_paid: values.isPaid,
        created_by: user.data.session!.user.id,
        announcements: [],
        bank_details: values.isPaid
          ? {
              name: values.bankName,
              email: values.bankEmail,
              IFSC: values.bankIFSC,
              account_number: values.bankAccNo,
            }
          : null,
      })
      .select("id")
      .single()
    const userData = await getUser()
    if (!!userData && !!data.data) {
      if (fileInputState.file) {
        setPostSubmit({ show: true, logMsg: "Uploading thumbnail..." })
        const imageInsert = await supabase.storage
          .from("thumbnails")
          .upload(`workshop/${data.data?.id}`, fileInputState.file!)
        if (imageInsert.data) {
          const {
            data: { publicUrl: thumbnail_url },
          } = supabase.storage
            .from("thumbnails")
            .getPublicUrl(`workshop/${data.data.id}`)
          if (thumbnail_url)
            await supabase
              .from("workshops")
              .update({ thumbnail_url })
              .eq("id", data.data.id)
        }
      }

      const shops = userData.organized_workshops
      shops.push(data.data.id)
      await supabase
        .from("users")
        .update({ organized_workshops: shops })
        .eq("id", userData.id)
    }
    setIsLoading(false)
    setPostSubmit({ show: true, logMsg: "Workshop Created." })
    setTimeout(() => setPostSubmit({ show: false, logMsg: "" }), 1000)
    if (!data.error)
      showAlert({
        title: "Success.",
        description:
          "Workshop successfully created. Workshop details will be reviewed. Once the workshop is approved you can view or edit it from dashboard.",
        type: "default",
        action: {
          text: "Dashboard",
          callback: () => router.push("/dashboard/admin"),
        },
      })
  }

  return (
    <Form {...form}>
      <main className="max-w-5xl md:px-4 w-full py-12 md:py-24 space-y-8 mx-auto">
        <form onSubmit={form.handleSubmit(submitData)} className="space-y-6">
          <div className="flex w-[75%] md:w-[100%] m-[auto] justify-between md:items-center mb-10 md:mb-20 gap-y-2 flex-row">
            <Link
              href="/organize"
              className="flex space-x-1 items-center w-fit"
            >
              <Button className="text-base md:text-md px-0 md:px-4" variant={"ghost"}>
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                <span>Go back</span>
              </Button>
            </Link>
            <div className=" flex space-x-3 md:space-x-6 items-center justify-end">
              {activeStep > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  className="bg-transparent border-secondary hidden md:block h-9 md:h-11 rounded-md md:px-8"
                >
                  Previous
                </Button>
              )}
              {activeStep < steps.length - 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleNextStep}
                  className="bg-transparent border-secondary hidden md:block h-9 md:h-11 rounded-md md:px-8"
                >
                  Next
                </Button>
              )}
              {activeStep === 4 && (
                <Button
                  type="submit"
                  variant="secondary"
                  className="border border-secondary h-10 text-[12px] px-6 md:h-11 rounded-md md:px-8"
                  onClick={() => {
                    const result = validationSchema.safeParse(form.getValues())
                    if (!result.success) {
                      showAutoCloseAlert({
                        title: "Error!",
                        description: "Please fill out the red fields.",
                        type: "destructive",
                      })
                      const firstErrorField = result.error.issues[0]
                        .path[0] as string
                      steps.forEach((step, index) => {
                        if (
                          step.validationFields.includes(firstErrorField) &&
                          !fileInputState.showError
                        ) {
                          setTimeout(() => setActiveStep(index))
                          return
                        }
                      })
                    }
                    if (fileInputState.showError)
                      setTimeout(() => setActiveStep(0))
                  }}
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
            <FormField
              control={form.control}
              name="category"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">Category</FormLabel>
                  <FormControl>
                    <div className="flex w-full flex-wrap gap-3">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          onClick={() => form.setValue("category", category)}
                          variant={
                            categoryValue === category ? "default" : "outline"
                          }
                          className={`border font-base md:font-semibold rounded-full md:h-11 md:px-8`}
                          type="button"
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <div className="space-y-4">
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
            </div> */}
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
             <FormField
              name="thumbnail"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel
                    className={`text-md md:text-xl ${
                      fileInputState.showError ? "text-destructive" : ""
                    }`}
                  >
                    Thumbnail <span className="text-sm font-normal">(Optional*)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      className="px-4 w-fit cursor-pointer"
                      placeholder="Web development bootcamp"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => {
                        if (
                          e.target.files &&
                          e.target.files.length > 0 &&
                          e.target.files[0].size > 3 * 1024 * 1024
                        ) {
                          setFileInputState({
                            showError: true,
                            errorMsg:
                              "An image with a maximum size of 3MB is accepted.",
                            file: null,
                          })
                          return
                        }
                        if (e.target.files && e.target.files.length > 0) {
                          setFileInputState({
                            showError: false,
                            errorMsg: "",
                            file: e.target.files[0],
                          })
                          return
                        }
                        setFileInputState({
                          showError: false,
                          errorMsg: "",
                          file: null,
                        })
                      }}
                    />
                  </FormControl>
                  {fileInputState.showError && (
                    <FormMessage>{fileInputState.errorMsg}</FormMessage>
                  )}
                  <FormDescription className="text-xs pt-2">
                    *We will provide a default thumbnail image acording to
                    selected category if you don't provide one yourself.
                  </FormDescription>
                  <FormDescription className="text-xs pt-1">
                    Keep image aspect ratio to 3/2 (for e.g. width 900px and
                    height 600px) to make sure image don't get cut out.
                  </FormDescription>
                </FormItem>
              )}
            />
            {fileInputState.file && (
              <div>
                <h1 className="text-md pb-2 md:text-xl">Thumbnail Preview</h1>
                <Image
                  className="aspect-[3/2] border border-black w-96 object-cover"
                  src={URL.createObjectURL(fileInputState.file)}
                  alt="Preview thumbnail"
                  width={400}
                  height={280}
                />
              </div>
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
                <FormItem className="flex flex-col w-[100%]">
                  <FormLabel className="text-md md:text-xl">
                  New Applications Close
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 h-12 text-left font-normal text-[12px] md:text-base",
                            !field.value && "text-muted-foreground"
                          )}
                          size={"lg"}
                        >
                          {field.value ? (
                            <span className="ml-3">
                              {format(field.value, "PPP")}
                            </span>
                          ) : (
                            <span className="ml-3">Pick a date</span>
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
            <div className="flex justify-between gap-8">
            <FormField
              control={form.control}
              name="workshopStartingDate"
              render={({ field }) => (
                <FormItem className="flex flex-col w-[100%]">
                  <FormLabel className="text-md md:text-xl">
                    Workshop starting
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 h-12  text-left font-normal text-[12px] md:text-base",
                            !field.value && "text-muted-foreground"
                          )}
                          size={"lg"}
                        >
                          {field.value ? (
                            <span className="ml-3">
                              {format(field.value, "PPP")}
                            </span>
                          ) : (
                            <span className="ml-3">Pick a date</span>
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
                <FormItem className="flex flex-col w-[100%]">
                  <FormLabel className="text-md md:text-xl">
                    Workshop ending
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 h-12  max-w-md text-left font-normal text-[12px] md:text-base",
                            !field.value && "text-muted-foreground"
                          )}
                          size={"lg"}
                        >
                          {field.value ? (
                            <span className="ml-3">
                              {format(field.value, "PPP")}
                            </span>
                          ) : (
                            <span className="ml-3">Pick a date</span>
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
           
            <FormField
              control={form.control}
              name="sessionStartingTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">
                    Workshop session starting time.
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="px-4 h-12  w-full max-w-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sessionEndingTime"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-md md:text-xl">
                    Workshop session ending time.
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      className="px-4 h-12  w-full max-w-md"
                      defaultValue="12:00"
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
                            [{ list: "ordered" }, { list: "bullet" }],
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
      <Dialog.Root open={postSubmit.show}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-50 flex justify-center items-center max-w-[90%] lg:max-w-4xl">
            <h1 className="text-secondary-darker font-archivo font-bold text-xl md:text-2xl lg:text-4xl">
              {postSubmit.logMsg}
            </h1>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </Form>
  )
}
