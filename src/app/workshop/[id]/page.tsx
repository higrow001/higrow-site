import { getWorkshop } from "@/app/_actions/workshop"
import Navbar from "@/components/navbar/navbar"
import PaymentButton from "@/components/client-buttons/payment-button"
import ReverseTimer from "@/components/workshop/reverse-timer"
import { Button } from "@/components/ui/button"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { Link as LinkIcon, Mail } from "lucide-react"
import { Metadata } from "next"
import { BiInfoCircle } from "react-icons/bi"
import { RiDiscordLine, RiFacebookFill, RiInstagramLine, RiWhatsappLine, RiYoutubeLine } from "react-icons/ri"
import RequestButton from "@/components/client-buttons/request-button"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: { id: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const id = params.id
  const workshop = await getWorkshop(id)
  if (workshop)
    return {
      title: `${workshop.name} - Workshop details`,
      description: workshop.tagline,
      openGraph: {
        title: `${workshop.name} - Workshop details`,
        description: workshop.tagline,
        siteName: 'Higrow',
        images: [
          {
            url: workshop.thumbnail_url ?? "https://dldyazrsbnbffwkfvpcs.supabase.co/storage/v1/object/public/thumbnails/defaults/ai/1.webp",
            width: 800,
            height: 600,
          }
        ],
        locale: 'en_US',
        type: 'website',
      },
    }
  return {
    title: "Workshop Not found",
    description: "This workshop is removed or it didn't get approved by Higrow.",
    openGraph: {
      title: "Workshop Not found",
      description: "This workshop is removed or it didn't get approved by Higrow."
    },
  }
}

async function WorkshopPage({ params }: { params: { id: string } }) {
  const data = await getWorkshop(params.id)
  if (!data) notFound()
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const commonDate = new Date("1970-01-01")
  const startTime = new Date(commonDate.toDateString() + " " + data.session_start_time).toLocaleTimeString()
  const endTime = new Date(commonDate.toDateString() + " " + data.session_end_time).toLocaleTimeString()


  return (
    <>
      <Navbar />
      {data && (
        <div>
          <div className="w-full flex justify-between px-8 items-center fixed bottom-0 bg-white border border-black h-20 md:hidden">
            <div>
              {" "}
              {data.is_paid ? (
                <p className="text-lg text-[#333] font-semibold">  Rs.{data.workshop_amount} </p>
              ) : (
                <p className="text-lg text-[#333] font-semibold">  Free </p>
              )}{" "}
            </div>
            <div>
              {" "}
              {session ? data.is_paid ? (
                <PaymentButton
                  amount={Number(data.workshop_amount)}
                  workshopName={data.name}
                  workshopId={params.id}
                  organizerEmail={data.contact_email}
                  applicationDate={data.application_closing_date}
                  participants={data.participants}
                >
                  Join Rs.{data.workshop_amount}
                </PaymentButton>
              ) : (
                <RequestButton
                  id={params.id}
                  requests={data.requested_participants}
                  participants={data.participants}
                  applicationDate={data.application_closing_date}
                />
              ) : (
                <Link href={"/signin"}>
                  <Button size={"xl"} className="w-full text-xs md:text-base" variant={"secondary"}>
                    Signin to participate
                  </Button>
                </Link>
              )}{" "}
            </div>
          </div>
          <section className="md:py-20 md:px-36 py-16 w-full ">
            <div className="bg-background border border-secondary">
              <header className="w-full space-y-1 py-8 px-8 border-b border-secondary">
                <h1 className="text-2xl md:text-3xl font-bold font-archivo mb-[2px]  md:mb-1 text-[#333]">
                  {data.name}
                </h1>
                <span className="text-secondary text-sm md:text-base font-medium inline-block">
                  By {data.instructor_name}
                </span>
              </header>
              <div className="flex md:flex-row flex-col">
                {data.approved ? <>
                  <main className="md:basis-[75%] border-r border-secondary space-y-16 py-12 px-8">
                    <div className="space-y-5">
                      <h2 className="text-2xl md:text-3xl text-secondary font-medium">
                        What you'll learn :-
                      </h2>
                      <div
                        className="prose max-w-[90ch]"
                        dangerouslySetInnerHTML={{
                          __html: data.describe_each_day,
                        }}
                      ></div>
                    </div>
                    <div className="space-y-5">
                      <h2 className="text-2xl md:text-3xl text-secondary font-medium">
                        About Instructor :-
                      </h2>
                      <div
                        className="prose max-w-[90ch]"
                        dangerouslySetInnerHTML={{ __html: data.instructor_info }}
                      ></div>
                    </div>

                    <div className="space-y-5">
                      <h3 className="text-2xl md:text-3xl text-secondary font-medium">
                        Contact organizer :-
                      </h3>
                      <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-12 justify-items-center">
                        <a
                          className="p-4  w-full border border-secondary rounded-md color-[#fff]"
                          href={`mailto:${data.contact_email}`}
                          target="_blank"
                        >
                          <div className="w-full p-[5px] pt-2 pb-2 flex">
                            {" "}
                            <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                              <Mail className="w-7 h-7" />
                            </div>
                            <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                              {" "}
                              <div className="font-medium tracking-wide">
                                {data.instructor_name}'s Mail
                              </div>
                              <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                {data.contact_email}
                              </div>{" "}
                            </div>
                          </div>
                        </a>
                        {data.social_links.map(
                          (link) =>
                            link.length > 0 && (
                              <a
                                key={link}
                                className="p-4  w-full border border-secondary rounded-md color-[#fff]"
                                href={link}
                                target="_blank"
                              >
                                <div className="w-full p-[5px] pt-2 pb-2 flex">
                                  {" "}
                                  <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                    {(() => {
                                      if (link.includes("youtube.com") || link.includes("youtu.be"))
                                        return <RiYoutubeLine className="w-7 h-7" />
                                      if (
                                        link.includes("instagram.com") ||
                                        link.includes("instagr.am") ||
                                        link.includes("ig.me")
                                      )
                                        return <RiInstagramLine className="w-7 h-7" />
                                      if (
                                        link.includes("facebook.com") ||
                                        link.includes("fb.com") ||
                                        link.includes("fb.me") ||
                                        link.includes("fb.gg") ||
                                        link.includes("fb.watch")
                                      )
                                        return <RiFacebookFill className="w-7 h-7" />
                                      if (
                                        link.includes("discord.gg") ||
                                        link.includes("discord.com") ||
                                        link.includes("discord.new")
                                      )
                                        return <RiDiscordLine className="w-7 h-7" />
                                      if (link.includes("whatsapp.com") || link.includes("wa.me"))
                                        return <RiWhatsappLine className="text-2xl" />
                                      return <LinkIcon className="w-7 h-7" />
                                    })()}
                                  </div>
                                  <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                    {" "}
                                    <div className="font-medium tracking-wide">
                                      {data.instructor_name}'s {(() => {
                                        if (
                                          link.includes("youtube.com") ||
                                          link.includes("youtu.be")
                                        )
                                          return "Youtube"
                                        if (
                                          link.includes("instagram.com") ||
                                          link.includes("instagr.am") ||
                                          link.includes("ig.me")
                                        )
                                          return "Instagram"
                                        if (
                                          link.includes("facebook.com") ||
                                          link.includes("fb.com") ||
                                          link.includes("fb.me") ||
                                          link.includes("fb.gg") ||
                                          link.includes("fb.watch")
                                        )
                                          return "Facebook"
                                        if (
                                          link.includes("discord.gg") ||
                                          link.includes("discord.com") ||
                                          link.includes("discord.new")
                                        )
                                          return "Discord"
                                        if (link.includes("whatsapp.com") || link.includes("wa.me"))
                                          return "WhatsApp"
                                        return "Website"
                                      })()}
                                    </div>
                                    <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                      {link}
                                    </div>{" "}
                                  </div>
                                </div>
                              </a>
                            )
                        )}
                      </div>
                    </div>


                    <div
                      className={`py-5 md:py-6 px-5 md:px-8 flex items-center md:space-x-6 text-secondary border border-black rounded-md bg-white`}
                    >
                      <BiInfoCircle className="hidden md:block md:text-6xl" />
                      <p className="text-xs md:text-sm text-[#333] md:tracking-wide leading-5 md:leading-6">
                        This opportunity has been listed by {data.instructor_name}
                        . Higrow is not responsible for any content mentioned in
                        this opportunity or the process followed by the organizers
                        for this opportunity. However, please contact us if you
                        want to report this opportunity
                      </p>
                    </div>
                  </main>
                  <aside className="md:basis-[35%] h-full py-12 px-8 space-y-12">
                    <div className="space-y-6">
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold"> ⏱️ Starts from -</span>
                        <span>
                          {formatDateInDDMMYYYY(data.workshop_starting_date)} - {formatDateInDDMMYYYY(data.workshop_ending_date)}
                        </span>
                      </span>
               
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold"> ⏱️ Timming -</span>
                        <span>
                          {startTime} - {endTime}
                        </span>
                      </span>
                  
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">📍 Happening -</span>
                        <span>{data.mode}</span>
                      </span>
                      {data.mode === "Offline" && (
                        <span className="flex space-x-4 items-start">
                          <span className="font-semibold">📍 Event address -</span>
                          <div dangerouslySetInnerHTML={{ __html: data.event_location! }}></div>
                        </span>
                      )}
                    </div>
                    <ReverseTimer
                      applicationClosingDate={data.application_closing_date}
                    />
                    <div className="space-y-4">
                      {session ? data.is_paid ? (
                        <PaymentButton
                          amount={Number(data.workshop_amount)}
                          workshopName={data.name}
                          workshopId={params.id}
                          organizerEmail={data.contact_email}
                          applicationDate={data.application_closing_date}
                          participants={data.participants}
                        >
                          Join Rs.{data.workshop_amount}
                        </PaymentButton>
                      ) : (
                        <RequestButton
                          id={params.id}
                          requests={data.requested_participants}
                          participants={data.participants}
                          applicationDate={data.application_closing_date}
                        />
                      ) : (
                        <Link href={"/signin"}>
                          <Button size={"xl"} className="w-full text-xs md:text-base" variant={"secondary"}>
                            Signin to participate
                          </Button>
                        </Link>
                      )}
                      <Button className="w-full text-sm md:text-base" size={"xl"} variant={"outline"}>
                        Add to wishlist
                      </Button>
                    </div>
                    <div className="py-5 px-5 flex items-center text-secondary border border-black rounded-md bg-white">
                      <span className="text-sm text-[#333]">
                        {" "}
                        ⭐ {data.tagline}{" "}
                      </span>
                    </div>

                  </aside>
                </> : (
                  <div className="w-full p-8 justify-center max-w-4xl mx-auto">
                    <h1 className="text-lg md:text-xl text-secondary-darker lg:text-3xl font-semibold text-center">This workshop is not approved by Higrow right now. Once it will be, you can see details and participate in this workshop.</h1>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default WorkshopPage
