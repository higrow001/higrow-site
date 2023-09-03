import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Link from 'next/link'
import Navbar from '@/components/navbar/navbar'

const faqData = [
  {
    question: "What is HiGrow?",
    answer: "HiGrow is platform where our aim is to help empowering minds worldwide to Learn, compete, and grow together by workshops and contests!",
  },
  {
    question: "Is this platform free for users?",
    answer: "Yes, it's completely free for users to explore and learn new skills. However, if a workshop has a fee set by the organizer, you'll need to pay for that particular workshop. Enjoy learning without any platform charges!",
  },
  {
    question: " Is it free to host a workshop here?",
    answer: "Absolutely! Hosting a workshop on HiGrow is completely free of charge.",
  },
  {
    question: "How can I join a workshop?",
    answer: "Joining a workshop is a breeze! Just head to our workshops page and filter your preferred category. Browse through the available workshops, read the details, and if needed, contact the workshop host for more information. Once you find the perfect fit, click 'Join,' and you're all set to enjoy the workshop! It's that simple!",
  },
  {
    question: "Can I contact the workshop provider?",
    answer: "Absolutely! You can easily get in touch with the workshop organizers through the social links they provide on the workshop's page. Feel free to reach out to them for any extra details or inquiries. They'll be happy to assist you!",
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

const Faqs = () => {
  
  return (
    <>
    <Navbar />
    <center className='pt-46'>
    <h1 className="text-[34px] sm:text-center text-left w-[80%] m-[auto] sm:font-medium font-bold sm:text-6xl font-archivo mb-8 sm:mb-14">
            Frequently asked questions
          </h1>
          <p className="mb-20 sm:text-center text-left w-[80%] m-[auto]  faq-p text-lg sm:text-2xl">
            Don't see your question? <Link href="mailto:higrow25@gmail.com"> Contact us </Link>
          </p>
          <Accordion type="single" collapsible className="max-w-5xl border-t-2 border-black md:mb-32">
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
    </center>
    </>
  )
}

export default Faqs