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
      "sessionStartingTime",
      "sessionEndingTime",
    ],
    id: "dates",
  },
  {
    title: "Links",
    validationFields: [
      "contactEmail",
      "websiteLink",
      "facebookLink",
      "discordLink",
      "whatsappLink",
      "instagramLink",
      "youtubeLink",
    ],
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
  applicationClosingDate: "",
  workshopStartingDate: "",
  workshopEndingDate: "",
  sessionStartingTime: "09:00",
  sessionEndingTime: "10:00",
  contactEmail: "",
  websiteLink: undefined,
  facebookLink: undefined,
  discordLink: undefined,
  whatsappLink: undefined,
  instagramLink: undefined,
  youtubeLink: undefined,
  instructorInfo: "",
  instructorName: "",
  workshopInfo: "",
  workingDays: "",
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
        invalid_type_error: "Date is invalid. Please select a proper date.",
      })
      .min(new Date(), { message: "Date should be greater than today." }),
    workshopStartingDate: z
      .date({
        required_error: "Please select a valid date.",
        invalid_type_error: "Date is invalid. Please select a proper date.",
      })
      .min(new Date(), { message: "Date should be greater than today." }),
    workshopEndingDate: z
      .date({
        required_error: "Please select a valid date.",
        invalid_type_error: "Date is invalid. Please select a proper date.",
      })
      .min(new Date(), { message: "Date should be greater than today." }),
    sessionStartingTime: z
      .string({ required_error: "Session starting time is required." })
      .nonempty({ message: "Session starting time is required." }),
    sessionEndingTime: z
      .string({ required_error: "Session starting time is required." })
      .nonempty({ message: "Session starting time is required." }),
    contactEmail: z
      .string({ required_error: "Contact email is required." })
      .nonempty({ message: "Contact email is required." })
      .email("Invalid Contact Email"),
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

    if (!!val.websiteLink?.length) {
      if (!val.websiteLink.startsWith("https://")) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Link should start with https.",
          path: ["websiteLink"],
        })
      }
    }

    if (!!val.facebookLink?.length) {
      if (
        !val.facebookLink.includes("facebook.com") &&
        !val.facebookLink.includes("fb.com") &&
        !val.facebookLink.includes("fb.me") &&
        !val.facebookLink.includes("fb.gg") &&
        !val.facebookLink.includes("fb.watch")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid facebook link.",
          path: ["facebookLink"],
        })
      }
    }

    if (!!val.discordLink?.length) {
      if (
        !val.discordLink.includes("discord.gg") &&
        !val.discordLink.includes("discord.new") &&
        !val.discordLink.includes("discord.com")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid discord link.",
          path: ["facebookLink"],
        })
      }
    }

    if (!!val.whatsappLink?.length) {
      if (
        !val.whatsappLink.includes("whatsapp.com") &&
        !val.whatsappLink.includes("wa.me")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid whatsapp link.",
          path: ["whatsappLink"],
        })
      }
    }

    if (!!val.instagramLink?.length) {
      if (
        !val.instagramLink.includes("instagram.com") &&
        !val.instagramLink.includes("ig.me") &&
        !val.instagramLink.includes("instagr.am")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid instagram link.",
          path: ["instagramLink"],
        })
      }
    }

    if (!!val.youtubeLink?.length) {
      if (
        !val.youtubeLink.includes("youtube.com") &&
        !val.youtubeLink.includes("youtu.be")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Enter a valid youtube link.",
          path: ["youtubeLink"],
        })
      }
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