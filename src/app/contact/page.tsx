import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  import '../home.scss'
import Navbar from '@/components/navbar/navbar'


  const faqData = [
    {
      question: "What is HiGrow?",
      answer:
        "HiGrow is platform where our aim is to help empowering minds worldwide to Learn, compete, and grow together by workshops and contests!",
    },
    {
      question: "How can I join a workshop?",
      answer:
        "Joining a workshop is a breeze! Just head to our workshops page and filter your preferred category. Browse through the available workshops, read the details, and if needed, contact the workshop host for more information. Once you find the perfect fit, click 'Join,' and you're all set to enjoy the workshop! It's that simple!",
    },
    {
      question: "Is this platform free for users?",
      answer:
        "Yes, it's completely free for users to explore and learn new skills. However, if a workshop has a fee set by the organizer, you'll need to pay for that particular workshop. Enjoy learning without any platform charges!",
    },
    {
      question: "Can I contact the workshop provider?",
      answer:
        "Absolutely! You can easily get in touch with the workshop organizers through the social links they provide on the workshop's page. Feel free to reach out to them for any extra details or inquiries. They'll be happy to assist you!",
    },
  ]


export default function Contact() {
  return (
    <>
    <Navbar />
    <div className='pt-[100px]'>
        <div className='contact-faq pt-20'>
            <div className="flex w-[80%] m-auto justify-between">
                <h1 className='text-[42px] font-medium'>Have any queries? It might be on FAQs</h1>
             <Link href="/faqs">
             <Button
                    className={`px-4 md:h-12 md:px-7 w-[100%] text-[10px]`}
                    variant={"outline"}
                  >
                    See all
                  </Button>
                </Link>   
            </div>
            <div>
            <center className='pt-20 border-0'>
          {" "}
          <div className="mx-auto pb-20 pt-0">
          
            <Accordion
              type="single"
              collapsible
              className="max-w-5xl border-t-2 border-black md:mb-32"
            >
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
        </div>
        <div className='contact-info w-[100%] text-center'>
            <div>
                <h1 className='text-[42px] pb-20 font-medium'>Still can't find your answer ? Contact us</h1>
            </div>
            <div className='flex justify-between pt-12 pb-12 border-t border-b border-black'>
                <div className='w-[80%] m-auto border-r border-black'>
                    <h1 className='m-auto w-[80%] text-center'>Adress</h1>
                    <p className='w-[80%] m-auto text-center'>#65, green town colony, Samana, Punjab 147101</p>
                </div>
                <div className='w-[80%] m-auto border-r border-black'>
                    <h1 className='m-auto text-center'>Phone No.</h1>
                    <p className='w-[80%] text-center m-auto'>+91 98033 20125</p>
                </div>
                <div className='w-[80%] m-auto'>
                <h1 className='m-auto text-center'>Email</h1>
                    <Link className='w-[80%] text-center m-auto' href="mailto:higrow25@gmail.com"> higrow25@gmail.com</Link>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
