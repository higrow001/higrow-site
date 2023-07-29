import * as z from "zod"

export const categories = [
  "Graphic Design",
  "UI/UX",
  "Web/App Dev",
  "Video Editing",
  "Animation",
  "Motion/VFX",
  "AI",
  "Content Creation",
  "Digital Marketing",
  "Marketing",
  "Stocks/Trading",
  "Personal Finance",
  "Startup",
  "Personal Development",
  "Art & Craft",
  "Other",
]

export const steps = [
  {
    title: "Basics",
    validationFields: [
      "name",
      "tagline",
      "category",
      "eventLocation",
      "otherCategory",
    ],
    id: "basics",
  },
  {
    title: "Dates",
    validationFields: [
      "applicationClosingDate",
      "workshopStartingDate",
      "workshopEndingDate",
    ],
    id: "dates",
  },
  {
    title: "Links",
    validationFields: ["contactEmail", "redirectUrl"],
    id: "links",
  },
  {
    title: "Description",
    validationFields: ["instructorInfo", "instructorName", "workshopInfo"],
    id: "description",
  },
  {
    title: "Advanced",
    validationFields: [
      "workingDays",
      "timePerDay",
      "timeFormat",
      "describeEachDay",
      "workshopAmount",
      "backName",
      "bankEmail",
      "bankAccNo",
      "bankIFSC",
    ],
    id: "advanced",
  },
]

export const initialValues = {
  name: "",
  tagline: "",
  mode: "Online",
  eventLocation: "",
  category: "",
  otherCategory: "",
  applicationClosingDate: new Date(),
  workshopStartingDate: new Date(),
  workshopEndingDate: new Date(),
  contactEmail: "",
  redirectUrl: "",
  websiteLink: "",
  facebookLink: "",
  discordLink: "",
  whatsappLink: "",
  instagramLink: "",
  youtubeLink: "",
  instructorInfo: "",
  instructorName: "",
  workshopInfo: "",
  workingDays: "",
  timePerDay: "",
  timeFormat: "",
  describeEachDay: "",
  isPaid: false,
  workshopAmount: "",
  bankName: "",
  bankEmail: "",
  bankAccNo: "",
  bankIFSC: "",
}

export const validationSchema = z
  .object({
    name: z
      .string({ required_error: "Event title is required" })
      .nonempty({ message: "Event title is required" })
      .min(3, { message: "Must be atleast 3 characters long." }),
    tagline: z
      .string({ required_error: "Event tagline is required" })
      .nonempty({ message: "Event tagline is required" })
      .min(10, { message: "Must be atleast 10 characters long." }),
    mode: z.string(),
    eventLocation: z.optional(z.string()),
    category: z.string().nonempty({ message: "Category is required" }),
    otherCategory: z.optional(z.string()),
    applicationClosingDate: z
      .date({
        required_error: "Please select a valid date.",
      })
      .min(new Date(), { message: "Date should be greater than today." }),
    workshopStartingDate: z
      .date({
        required_error: "Please select a valid date.",
      })
      .min(new Date(), { message: "Date should be greater than today." }),
    workshopEndingDate: z
      .date({
        required_error: "Please select a valid date.",
      })
      .min(new Date(), { message: "Date should be greater than today." }),
    contactEmail: z
      .string({ required_error: "Contact email is required." })
      .nonempty({ message: "Contact email is required." })
      .email("Invalid Contact Email"),
    redirectUrl: z
      .string({ required_error: "Required." })
      .nonempty({ message: "Required." }),
    websiteLink: z.optional(z.string()),
    facebookLink: z.optional(z.string()),
    discordLink: z.optional(z.string()),
    whatsappLink: z.optional(z.string()),
    instagramLink: z.optional(z.string()),
    youtubeLink: z.optional(z.string()),
    workshopInfo: z
      .string({ required_error: "Workshop Info is required" })
      .nonempty({ message: "Workshop Info is required." }),
    instructorInfo: z
      .string({ required_error: "Instructor Info is required" })
      .nonempty({ message: "Instructor Info is required." }),
    instructorName: z
      .string({ required_error: "Instructor Name is required" })
      .nonempty({ message: "Instructor Name is required." }),
    workingDays: z
      .string({ required_error: "Working days is required" })
      .nonempty({ message: "Working days is required" })
      .min(1, { message: "Working days should be a positive integer" })
      .transform((value) => Number(value)),
    timeFormat: z.enum(["hours", "mins"], {
      required_error: "Time format is required.",
      invalid_type_error: "Please select a valid option.",
    }),
    timePerDay: z
      .string({ required_error: "Instructor Info is required" })
      .nonempty({ message: "Time Per Day is required" })
      .min(1, { message: "Time Per Day should be a positive integer" })
      .transform((value) => Number(value)),
    describeEachDay: z
      .string({ required_error: "Description is required." })
      .nonempty({ message: "Description is required." }),
    isPaid: z.boolean(),
    workshopAmount: z
      .string()
      .min(0)
      .transform((value) => Number(value)),
    bankName: z.string(),
    bankEmail: z.string(),
    bankAccNo: z.string(),
    bankIFSC: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.mode === "Offline" && !val.eventLocation?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Event Location is required.",
        path: ["eventLocation"],
      })
    }

    if (val.category === "Other" && !val.otherCategory?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Category name is required.",
        path: ["otherCategory"],
      })
    }

    if (
      !val.instructorInfo ||
      val.instructorInfo === "<p><br></p>" ||
      val.instructorInfo === "<p></p>"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Instructor Info is required.",
        path: ["instructorInfo"],
      })
    }

    if (
      !val.workshopInfo ||
      val.workshopInfo === "<p><br></p>" ||
      val.workshopInfo === "<p></p>"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Workshop Info is required.",
        path: ["workshopInfo"],
      })
    }

    if (
      !val.describeEachDay ||
      val.describeEachDay === "<p><br></p>" ||
      val.describeEachDay === "<p></p>"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required.",
        path: ["describeEachDay"],
      })
    }

    if (val.timePerDay <= 0.0001) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Time Per Day should be a positive integer.",
        path: ["timePerDay"],
      })
    }

    if (val.workingDays <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Worksing days should be a positive integer.",
        path: ["workingDays"],
      })
    }

    if (val.isPaid && val.bankEmail.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid email.",
        path: ["bankEmail"],
      })
    }

    if (val.isPaid && val.workshopAmount === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter workshop fees amount.",
        path: ["workshopAmount"],
      })
    }

    if (val.isPaid && val.workshopAmount <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter amount greater than 0.",
        path: ["workshopAmount"],
      })
    }

    if (val.isPaid && val.bankName.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name must atleast 2 characters long.",
        path: ["bankName"],
      })
    }

    if (val.isPaid && val.bankName.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is required.",
        path: ["bankName"],
      })
    }

    if (val.isPaid && val.bankAccNo.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Enter valid account number.`,
        path: ["bankAccNo"],
      })
    }

    if (val.isPaid && val.bankIFSC.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Enter valid IFSC code.`,
        path: ["bankIFSC"],
      })
    }
  })
