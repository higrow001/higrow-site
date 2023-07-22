import "./home.scss"
import Link from "next/link"
import Navbar from "@/components/navbar/navbar"
import Card from "@/components/card/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqData = [
  {
    question: "First Question",
    answer: "First Answer",
  },
  {
    question: "Second Question",
    answer: "Second Answer",
  },
  {
    question: "Third Question",
    answer: "Third Answer",
  },
  {
    question: "Fourth Question",
    answer: "Fourth Answer",
  },
]
export default function Home() {
  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="home-hero">
          <div className="hero-top">
            <div className="htop-left">
              <h1> What do we do? </h1>

              <p>
                {" "}
                We're building a platform where organizers can organize any
                contest or workshop doesn't matter which category is it & also
                participants to join any contest or workshop of each and every
                category at one stop{" "}
              </p>
            </div>
            <div className="htop-center">
              <h1>
                {" "}
                <span> HiGrow </span> - Say Hi 👋 to your growth 📈
              </h1>
              <p>
                Participate in exciting workshops, contests and grow your
                knowledge in your field. Wanna listen something amazing? Even
                you can also organize your own workshop or contest
              </p>
              <Link href="#" className="htopc-button">
                <button>Explore Now</button>
              </Link>
            </div>
            <div className="htop-right">
              <h1> Our Aim </h1>
              <p>
                To provide a one stop platform to both organizers and
                participants to join or organize any sort of contest or workshop
                from publishing to joining participants to the whole management
                to finishing it!
              </p>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hbottom-left">
              <Link className="hbottom-links" href="#">
                <button>Give Us Feedback</button>
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
              <Link className="hbottom-links" href="#">
                <button>Give Us Suggestions</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="hometodo-container">
          <div className="htd-title">
            <h1>Things you can do 👇</h1>
          </div>
          <div className="htd-boxes">
            <div className="htd-boxleft">
              <h1>
                <span> Explore </span>Oppurtunities
              </h1>
              <p>
                Become even greater in your field or upscale your skills by
                joining workshops. <br /> <br /> Explore different contests and
                compete with the fellows to upscale your skills!
              </p>
            </div>
            <div className="htd-boxright">
              <h1>
                <span> Host </span>Oppurtunities
              </h1>
              <p>
                Host any contest or workshop of any category according to your
                interest. <br /> <br /> HiGrow gives you audience* so you don't
                have to spend money on marketing!{" "}
              </p>
            </div>
          </div>
          <div className="htd-bottom">
            <p>
              *At this early stage we don't have so much audience but feel free
              to become a starting part of a big story ;)
            </p>
          </div>
        </div>
        <div className="he-container">
          <div className="workshop-card-container">
            <div className="he-top">
              <h1>Explore Workshops</h1>
              <Link href="workshops" className="explore-button">
                <button>See all</button>
              </Link>
            </div>
            <div className="he-bottom">{/* <Card /> */}</div>
          </div>
        </div>
        <div className="bottom-space"></div>
        <center>
          {" "}
          <div className="mx-auto pb-40">
            <h1 className="text-6xl font-medium font-archivo mb-14">
              Frequently asked questions
            </h1>
            <p className="mb-20 faq-p text-2xl">
              Don't see your question? <Link href="/contact"> Contact us </Link>
            </p>
            <Accordion type="single" collapsible className="max-w-5xl mb-32">
              {faqData.map((data) => (
                <AccordionItem
                  className="border-black border-b-2"
                  key={data.question}
                  value={data.question}
                >
                  <AccordionTrigger className="text-3xl faq-quest font-light">
                    {data.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-2xl faq-ans">
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
