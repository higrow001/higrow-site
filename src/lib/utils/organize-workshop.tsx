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
  { title: "Basics", validationFields: ["name", "tagline"] },
  {
    title: "Dates",
    validationFields: [
      "applicationClosingDate",
      "workshopStartingDate",
      "workshopEndingDate",
    ],
  },
  { title: "Links", validationFields: ["contactEmail", "redirectUrl"] },
  {
    title: "Description",
    validationFields: ["instructorInfo", "instructorName", "workshopInfo"],
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
  workingDays: 4,
  timePerDay: 2,
  timeFormat: "hours",
  describeEachDay: "",
  isPaid: true,
  workshopAmount: "0",
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
      .number()
      .int()
      .min(1, "Working Days should be a positive integer"),
    timeFormat: z.enum(["hours", "mins"], {
      required_error: "You need to select a time type.",
    }),
    timePerDay: z
      .number()
      .int()
      .min(0.001, "Hours Per Day should be a positive integer"),
    describeEachDay: z
      .string({ required_error: "Description is required." })
      .nonempty({ message: "Description is required." }),
    isPaid: z.boolean(),
    workshopAmount: z.string().min(0),
    bankName: z.string(),
    bankEmail: z.string(),
    bankAccNo: z.string(),
    bankIFSC: z.string(),
  })
  .superRefine((val, ctx) => {
    if (val.isPaid && val.bankEmail.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter valid email.",
        path: ["bankEmail"],
      })
    }

    if (val.isPaid && val.workshopAmount.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter workshop fees amount.",
        path: ["workshopAmount"],
      })
    }

    if (val.isPaid && val.workshopAmount.length !== 0) {
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
