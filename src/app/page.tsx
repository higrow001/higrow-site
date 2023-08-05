import "./home.scss"
import Link from "next/link"
import Navbar from "@/components/navbar/navbar"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { getWorkshops } from "./_actions/workshop"
import Card from "@/components/card/card"

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
export default async function Home() {
  const latestWorkshops = await getWorkshops({ limit: 3, approved: true })
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-hero">
          <div className="hero-top">
            <div className="htop-left">
              <h1 className="font-archivo">Our Mission </h1>
              <p>
                {" "}
                Empowering learners with an inclusive, interactive platform.
                Enabling personal growth through workshops, friendly contests,
                and abundant resources, accessible worldwide.{" "}
              </p>
            </div>
            <div className="htop-center">
              <h1 className="font-archivo">
                {" "}
                <span> HiGrow </span> - Say Hi👋 to your growth📈
              </h1>
              <p>
                Participate in exciting workshops, Learn skills and grow your
                knowledge with us!
              </p>
              <Link href="/workshops" className="htopc-button">
                <button>Explore Now</button>
              </Link>
            </div>
            <div className="htop-right">
              <h1 className="font-archivo">Our Aim </h1>
              <p>
                Redefining education by cultivating a diverse online
                marketplace. Inspiring continuous learning, fostering
                creativity, and connecting enthusiasts globally.
              </p>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hbottom-left">
              <Link className="hbottom-links" href="mailto:higrow25@gmail.com">
                <button>
                  Give Us Feedback <span> → </span>{" "}
                </button>
              </Link>
            </div>
            <div className="hbottom-center">
              <p>
                {" "}
                We’re an early stage startup so your feedback or suggestions
                means a lot to us :){" "}
              </p>
            </div>
            <div className="hbottom-right">
              <Link className="hbottom-links" href="mailto:higrow25@gmail.com">
                <button> Give Us Suggestions</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="hometodo-container">
          <div className="htd-title">
            <h1 className="font-archivo">Things you can do 👇</h1>
          </div>
          <div className="htd-boxes">
            <div className="htd-boxleft">
              <h1 className="font-archivo">
                <span>Explore </span>Oppurtunities
              </h1>
              <p>
                Become even greater in your field or upscale your skills by
                joining workshops. <br />
                Explore different contests and compete with the fellows to
                upscale your skills!
              </p>
              <div className="pt-[10px] md:pt-[20px] w-[80%] md:w-[70%] ">
                <Link href="/workshops" className="text-[#007dfb] md:font-semibold text-[13px] md:text-[17px]"> Explore Now <span> → </span> </Link>
              </div>
            </div>
            <div className="htd-boxright">
              <h1 className="font-archivo">
                <span> Host </span>Oppurtunities
              </h1>
              <p>
                Host any contest or workshop of any category according to your
                interest. <br /> HiGrow gives you audience* so you don't have to
                spend money on marketing!
              </p>
              <div className="pt-[10px] md:pt-[20px] w-[80%] md:w-[70%] ">
                <Link href="/organize" className="text-[#007dfb] md:font-semibold text-[12px] md:text-[17px]"> Organize Now <span> → </span> </Link>
              </div>
            </div>
          </div>
          <div className="htd-bottom">
            <p>
              *At this early stage we don't have so much audience but feel free
              to become a starting part of a big story ;)
            </p>
          </div>
        </div>
        {latestWorkshops.length > 0 && (
          <div className="he-container">
            <div className="workshop-card-container">
              <div className="he-top">
                <h1 className="font-archivo">Explore Workshops</h1>
                <Link href="workshops" className="explore-button">
                  <button className="px-0">See all</button>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 px-8 md:px-0 xl:grid-cols-3 gap-x-8 gap-y-16 xl:gap-16 w-full justify-items-center justify-between">
                {latestWorkshops.map((workshop) => (
                  <Link
                    aria-label={workshop.name}
                    key={workshop.id}
                    href={`/workshop/${workshop.id}`}
                    className="block w-full max-w-[400px] h-full"
                  >
                    <Card
                      name={workshop.name}
                      tagline={workshop.tagline}
                      instructor_name={workshop.instructor_name}
                      is_paid={workshop.is_paid}
                      workshop_amount={workshop.workshop_amount}
                      workshop_starting_date={workshop.workshop_starting_date}
                      thumbnail_url={workshop.thumbnail_url}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="bottom-space"></div>
        <center>
          {" "}
          <div className="mx-auto pb-40">
            <h1 className="text-[34px] sm:text-center text-left w-[80%] m-[auto] sm:font-medium font-bold sm:text-6xl font-archivo mb-8 sm:mb-14">
              Frequently asked questions
            </h1>
            <p className="mb-20 sm:text-center text-left w-[80%] m-[auto]  faq-p text-lg sm:text-2xl">
              Don't see your question? <Link href="/contact"> Contact us </Link>
            </p>
            <Accordion
              type="single"
              collapsible
              className="max-w-5xl border-t-2 border-black mb-32"
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
    </>
  )
}
