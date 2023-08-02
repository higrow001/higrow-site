import "./organize.scss"
import Image from "next/image"
import Illustration from "../../assests/illustration.webp"
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "What is HiGrow?",
    answer: "HiGrow is platform where our aim is to help empowering minds worldwide to Learn, compete, and grow together by workshops and contests!",
  },
  {
    question: " Is it free to host a workshop here?",
    answer: "Absolutely! Hosting a workshop on HiGrow is completely free of charge.",
  },
  {
    question: "How can I organize a workshop?",
    answer: "To organize a workshop, head to the 'Organize' page, click on 'Workshops,' and provide all the necessary details, including comprehensive information and contact links. Once everything is complete, click 'Publish.' We'll review your workshop, and upon approval, it will be listed on our platform.",
  },
  {
    question: "What are the fees?",
    answer: "We charge a flat 10% fee from your workshop's profit, ensuring our success aligns with yours. Please note that payment service provider fees (ranging from 2.5% to 5%) are separate and not included in our deduction.",
  },
  {
    question: "How do I get paid?",
    answer: "We'll ask your bank details and will transfer your earnings directly to your bank account within a week after your workshop is complete!",
  },

]

export default function Organize() {
  return (
    <div className="organize-container">
      <div className="organize-categories">
        <div className="oc-left">
          <h1 className="font-archivo">
            Select an Opportunity you want to organize <span>→</span>{" "}
          </h1>
          <Link href="#wtch">
            <p className="text-[20px] pt-4 tracking-wide underline decoration-[#333]">Read More</p>
          </Link>
        </div>
        <div className="oc-right">
          <div className="ocr-cards">
            <Link href="/organize/workshop">
              <div className="workshop-card">
                <h1 className="font-archivo">Workshop</h1>
                <p>
                  Host an interactive workshop with everything you need with
                  diverse range of workshops categories.
                </p>
              </div>
            </Link>
            <div className="contest-card">
              <h1 className="font-archivo">Contest</h1>
              <p>
                Host a contest with everything you need from team building to
                announcements to finishing and everything in between
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="wtch">
        <h1 id="wtch" >Why to choose us?</h1>
        <p> Focus on what you're good at Rest of work is ours! </p>
        <span> HiGrow makes organizing workshops a breeze with its user-friendly interface and management tools. </span>
      </div>
      <div className="wtc">
        <div className="wtc-left">
          <div>
            <h1 className="font-archivo">Create a Micro-Site</h1>
            <p>A micro site where all the information and details regarding your workshop will be there</p>
          </div>
          <div>
            <h1 className="font-archivo">Power is in your hands</h1>
            <p>Accept or decline who wants to participate and get the required data of all the participants</p>
          </div>
          <div>
            <h1 className="font-archivo">Engage with your audience </h1>
            <p>Make announcements for any updates to all the participants who have joined your workshop!</p>
          </div>
        </div>
        <div className="wtc-right">
          <Image quality={100} alt="Higrow Illustration" src={Illustration} />
        </div>
      </div>
      <center>
        {" "}
        <div className="mx-auto pb-40">
          <h1 className="text-[34px] sm:text-center text-left w-[80%] m-[auto] sm:font-medium font-bold sm:text-6xl font-archivo mb-8 sm:mb-14">
            Frequently asked questions
          </h1>
          <p className="mb-20 sm:text-center text-left w-[80%] m-[auto]  faq-p text-lg sm:text-2xl">
            Don't see your question? <Link href="/contact"> Contact us </Link>
          </p>
          <Accordion type="single" collapsible className="max-w-5xl border-t-2 border-black mb-32">
            {faqData.map((data) => (
              <AccordionItem
                className="border-black border-b-2"
                key={data.question}
                value={data.question}
              >
                <AccordionTrigger className="text-[16px] sm:text-3xl mr-2 faq-quest font-light">
                  {data.question}
                </AccordionTrigger>
                <AccordionContent className="text-[11px] sm:text-[20px] leading-7 tracking-wide md:tracking-wider md:leading-8 faq-ans">
                  {data.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>{" "}
      </center>
    </div>
  )
}
