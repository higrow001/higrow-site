import * as Yup from "yup";

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
];

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
];

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
  hoursPerDay: 2,
  isPaid: true,
  backName: "",
  bankEmail: "",
  bankAccNo: "",
  bankIFSC: "",
};

export const validationSchema = Yup.object().shape({
  name: Yup.string().required("Event Name is required"),
  tagline: Yup.string().required("Event tagline is required"),
  applicationClosingDate: Yup.date().required(
    "Application Closing Date is required"
  ),
  workshopStartingDate: Yup.date().required(
    "Workshop Starting Date is required"
  ),
  workshopEndingDate: Yup.date().required("Workshop Ending Date is required"),
  contactEmail: Yup.string()
    .email("Invalid email")
    .required("Contact Email is required"),
  redirectUrl: Yup.string().required("Redirect URL is required"),
  workshopInfo: Yup.string().required("Workshop Info is required"),
  instructorInfo: Yup.string().required("Instructor Info is required"),
  instructorName: Yup.string().required("Instructor Name is required"),
  workingDays: Yup.number().required("Working Days is required"),
  hoursPerDay: Yup.number().required("Hours Per Day is required"),
  isPaid: Yup.boolean().required("Is Paid is required"),
  backName: Yup.string().when("isPaid", {
    is: true,
    then: Yup.string().required("Bank Name is required"),
    otherwise: Yup.string(),
  }),
  bankEmail: Yup.string().when("isPaid", {
    is: true,
    then: Yup.string()
      .email("Invalid email")
      .required("Bank Email is required"),
    otherwise: Yup.string(),
  }),
  bankAccNo: Yup.string().when("isPaid", {
    is: true,
    then: Yup.string().required("Bank Account Number is required"),
    otherwise: Yup.string(),
  }),
  bankIFSC: Yup.string().when("isPaid", {
    is: true,
    then: Yup.string().required("Bank IFSC is required"),
    otherwise: Yup.string(),
  }),
});
