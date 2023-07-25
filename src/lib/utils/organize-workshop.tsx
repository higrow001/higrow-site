import * as z from "zod"

export const categories = [
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
]

export const steps = [
  { title: "Basics", validationFields: ["name", "tagline"], id: "basics" },
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
      "hoursPerDay",
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
  category: "Coding",
  applicationClosingDate: "",
  workshopStartingDate: "",
  workshopEndingDate: "",
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
  timeFormat: "hours",
  describeEachDay: "",
  isPaid: true,
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
    category: z.string(),
    applicationClosingDate: z
      .string()
      .refine((value) => new Date(value).toString() !== "Invalid Date", {
        message: "Please select a valid date and time",
      }),
    workshopStartingDate: z
      .string()
      .refine((value) => new Date(value).toString() !== "Invalid Date", {
        message: "Please select a valid date and time",
      }),
    workshopEndingDate: z
      .string()
      .refine((value) => new Date(value).toString() !== "Invalid Date", {
        message: "Please select a valid date and time",
      }),
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
    timeFormat: z.string({
      required_error: "You need to select a time type.",
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
      try {
        const amount = Number(val.workshopAmount)
        if (amount <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Enter amount greater than 0.",
            path: ["workshopAmount"],
          })
        }
      } catch (e) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Amount is not valid.",
          path: ["workshopAmount"],
        })
      }
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
