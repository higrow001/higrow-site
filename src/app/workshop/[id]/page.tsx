import { getWorkshop } from "@/app/_actions/workshop"
import Navbar from "@/components/navbar/navbar"
import PaymentButton from "@/components/workshop/payment-button"
import ReverseTimer from "@/components/workshop/reverse-timer"
import { Button } from "@/components/ui/button"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { Facebook, Instagram, Mail, Youtube } from "lucide-react"
import { Metadata } from "next"
import { BiInfoCircle } from "react-icons/bi"
import { RiDiscordLine, RiWhatsappLine } from "react-icons/ri"
import RequestButton from "@/components/workshop/request-button"

export const metadata: Metadata = {
  title: "Workshop Details",
}

async function WorkshopPage({ params }: { params: { id: string } }) {
  const data = await getWorkshop(params.id)

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
              {data.is_paid ? (
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
              )}{" "}
            </div>
          </div>
          <section className="md:py-20 md:px-36 py-16 w-full ">
            <div className="bg-background border border-secondary">
              <header className="w-full space-y-1 py-8 px-8 border-b border-secondary">
                <h1 className="text-2xl md:text-3xl font-bold font-archivo mb-[2px]  md:mb-1 text-[#333]">
                  {data.name}
                </h1>
                <span className="text-secondary text-xs md:text-sm font-medium inline-block">
                  By {data.instructor_name}
                </span>
              </header>
              <div className="flex md:flex-row flex-col">
                <main className="md:basis-[75%] border-r border-secondary space-y-16 py-12 px-8">
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
                    <h2 className="text-2xl md:text-3xl text-secondary font-medium">
                      About Workshop :-
                    </h2>
                    <div
                      className="prose max-w-[90ch]"
                      dangerouslySetInnerHTML={{ __html: data.workshop_info }}
                    ></div>
                  </div>
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
                        {formatDateInDDMMYYYY(data.workshop_starting_date)}
                      </span>
                    </span>
                    <span className="flex space-x-2 items-center">
                      <span className="font-semibold"> ⏱️ Duration -</span>
                      <span>
                        {data.time_format === "hours"
                          ? `${data.time_per_day} hours X ${data.working_days} Days`
                          : `${data.time_per_day} mins X ${data.working_days} Days`}
                      </span>
                    </span>
                    <span className="flex space-x-2 items-center">
                      <span className="font-semibold">📍 Happening -</span>
                      <span>{data.mode}</span>
                    </span>
                  </div>
                  <ReverseTimer
                    applicationClosingDate={data.application_closing_date}
                  />
                  <div className="space-y-4">
                    {data.is_paid ? (
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
                    )}
                    <Button className="w-full" size={"xl"} variant={"outline"}>
                      Add to wishlist
                    </Button>
                  </div>
                  <div className="py-5 px-5 flex items-center text-secondary border border-black rounded-md bg-white">
                    <span className="text-sm text-[#333]">
                      {" "}
                      ⭐ {data.tagline}{" "}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium text-xl">
                      Contact organizer :-
                    </h3>
                    <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
                      {data.social_links.map(
                        (link) =>
                          link.length > 0 && (
                            <a
                              key={link}
                              className="p-4  w-full border border-secondary rounded-md color-[#fff]"
                              href={link}
                              target="_blank"
                            >
                              {(() => {
                                if (
                                  link.includes("youtube.com") ||
                                  link.includes("youtu.be")
                                )
                                  return (
                                    <div className="w-full p-[5px] pt-2 pb-2 flex">
                                      {" "}
                                      <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                        <Youtube />
                                      </div>
                                      <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                        {" "}
                                        <div className="font-archivo font-medium tracking-wide">
                                          Puneet's Youtube
                                        </div>
                                        <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                          youtube.com
                                        </div>{" "}
                                      </div>
                                    </div>
                                  )
                                if (link.includes("instagram.com"))
                                  return (
                                    <div className="w-full p-[5px] pt-2 pb-2 flex">
                                      {" "}
                                      <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                        <Instagram />
                                      </div>
                                      <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                        {" "}
                                        <div className="font-archivo font-medium tracking-wide">
                                          Puneet's Instagram
                                        </div>
                                        <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                          instagram.com
                                        </div>{" "}
                                      </div>
                                    </div>
                                  )
                                if (link.includes("facebook.com"))
                                  return (
                                    <div className="w-full p-[5px] pt-2 pb-2 flex">
                                      {" "}
                                      <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                        <Facebook />
                                      </div>
                                      <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                        {" "}
                                        <div className="font-archivo font-medium tracking-wide">
                                          Puneet's Facebook
                                        </div>
                                        <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                          facebook.com
                                        </div>{" "}
                                      </div>
                                    </div>
                                  )
                                if (link.includes("discord.gg"))
                                  return (
                                    <div className="w-full p-[5px] pt-2 pb-2 flex">
                                      {" "}
                                      <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                        <RiDiscordLine className="text-2xl" />
                                      </div>
                                      <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                        {" "}
                                        <div className="font-archivo font-medium tracking-wide">
                                          Puneet's Discord
                                        </div>
                                        <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                          discord.gg
                                        </div>{" "}
                                      </div>
                                    </div>
                                  )
                                if (link.includes("whatsapp.com"))
                                  return (
                                    <div className="w-full p-[5px] pt-2 pb-2 flex">
                                      {" "}
                                      <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                        <RiWhatsappLine className="text-2xl" />
                                      </div>
                                      <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                        {" "}
                                        <div className="font-archivo font-medium tracking-wide">
                                          Puneet's Whatsapp
                                        </div>
                                        <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                          whatsapp.com
                                        </div>{" "}
                                      </div>
                                    </div>
                                  )
                                return (
                                  <div className="w-full p-[5px] pt-2 pb-2 flex">
                                    {" "}
                                    <div className="m-[0px] p-[19px] pt-[20px] pb-[20x] rounded-md bg-[#333]   text-[#fff]">
                                      <Mail />
                                    </div>
                                    <div className="w-[75%] flex flex-col ml-4 justify-center gap-y-1">
                                      {" "}
                                      <div className="font-archivo font-medium tracking-wide">
                                        Puneet's Instagram
                                      </div>
                                      <div className="p-[5px] pt-[8px] pb-[8px] font-archivo font-bold text-[#0D46D5] border border-black rounded-md text-[9px] text-center">
                                        instagram.com
                                      </div>{" "}
                                    </div>
                                  </div>
                                )
                              })()}
                            </a>
                          )
                      )}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default WorkshopPage
