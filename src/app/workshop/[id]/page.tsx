import { WorkshopDataType, getWorkshop } from "@/app/_actions/workshop"
import Navbar from "@/components/navbar/navbar"
import ReverseTimer from "@/components/reverse-timer"
import { Button } from "@/components/ui/button"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { Clock, Facebook, Instagram, Mail, MapPin, Youtube } from "lucide-react"
import Link from "next/link"
import { BiInfoCircle } from "react-icons/bi"
import { RiDiscordLine, RiWhatsappLine } from "react-icons/ri"

async function WorkshopPage({ params }: { params: { id: string } }) {
  const data: Omit<WorkshopDataType, "id"> = await getWorkshop(params.id)

  return (
    <>
      <Navbar />
      <section className="py-20 px-80 w-full">
        <div className="bg-background border border-secondary">
          <header className="w-full space-y-1 py-8 px-12 border-b border-secondary">
            <h1 className="text-3xl font-bold font-archivo text-secondary-darker">
              {data.name}
            </h1>
            <span className="text-secondary font-medium inline-block">
              By {data.instructorName}
            </span>
          </header>
          <div className="flex">
            <main className="basis-[70%] border-r border-secondary space-y-12 py-8 px-12">
              <div className="space-y-4">
                <h2 className="text-2xl text-secondary font-medium">
                  About Instructor :-
                </h2>
                <p>{data.instructorInfo}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl text-secondary font-medium">
                  About Workshop :-
                </h2>
                <p>{data.workshopInfo}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl text-secondary font-medium">
                  About Instructor :-
                </h2>
                <p>{data.describeEachDay}</p>
              </div>
              <div
                className={`py-6 px-8 flex items-center space-x-6 text-secondary border border-black rounded-md bg-white`}
              >
                <BiInfoCircle className="text-7xl" />
                <p>
                  This opportunity has been listed by Name of instructor. Higrow
                  is not responsible for any content mentioned in this
                  opportunity or the process followed by the organizers for this
                  opportunity. However, please contact us if you want to report
                  this opportunity
                </p>
              </div>
            </main>
            <aside className="basis-[35%] h-full p-8 space-y-8">
              <div className="space-y-6">
                <span className="flex space-x-2 items-center">
                  <Clock />
                  <span className="font-semibold">Starts from -</span>
                  <span>{formatDateInDDMMYYYY(data.workshopStartingDate)}</span>
                </span>
                <span className="flex space-x-2 items-center">
                  <Clock />
                  <span className="font-semibold">Duration -</span>
                  <span>
                    {data.timeFormat === "hours"
                      ? `${data.timePerDay} hours X ${data.workingDays} Days`
                      : `${data.timePerDay} mins X ${data.workingDays} Days`}
                  </span>
                </span>
                <span className="flex space-x-2 items-center">
                  <MapPin />
                  <span className="font-semibold">Happening -</span>
                  <span>{data.mode}</span>
                </span>
              </div>
              <ReverseTimer firebaseDate={data.applicationClosingDate} />
              <div className="space-y-4">
                <Button
                  className="w-full text-base"
                  size={"xl"}
                  variant={"secondary"}
                >
                  Join Rs.299
                </Button>
                <Button className="w-full" size={"lg"} variant={"outline"}>
                  Add to wishlist
                </Button>
              </div>
              <p className="border border-secondary p-4 rounded-md text-sm">
                ⭐ {data.tagline}
              </p>
              <div className="space-y-4">
                <h3 className="font-medium text-xl">Contact organizer :-</h3>
                <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
                  {[
                    data.websiteLink,
                    data.facebookLink,
                    data.discordLink,
                    data.youtubeLink,
                    data.whatsappLink,
                    data.instagramLink,
                  ].map(
                    (link) =>
                      link.length > 0 && (
                        <Link
                          key={link}
                          className="p-3 border border-secondary rounded-md"
                          href={link}
                        >
                          {(() => {
                            if (
                              link.includes("youtube.com") ||
                              link.includes("youtu.be")
                            )
                              return <Youtube />
                            if (link.includes("instagram.com"))
                              return <Instagram />
                            if (link.includes("facebook.com"))
                              return <Facebook />
                            if (link.includes("discord.gg"))
                              return <RiDiscordLine className="text-2xl" />
                            if (link.includes("whatsapp.com"))
                              return <RiWhatsappLine className="text-2xl" />
                            return <Mail />
                          })()}
                        </Link>
                      )
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

export default WorkshopPage
