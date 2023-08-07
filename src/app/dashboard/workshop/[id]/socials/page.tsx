import { getWorkshop } from "@/app/_actions/workshop"
import { Button } from "@/components/ui/button"
import checkSession from "@/lib/utils/check-session"
import { Link as LinkIcon, Mail } from "lucide-react"
import { BiInfoCircle } from "react-icons/bi"
import {
  RiDiscordLine,
  RiWhatsappLine,
  RiInstagramLine,
  RiMailLine,
  RiYoutubeLine,
  RiFacebookFill,
} from "react-icons/ri"

export default async function Socials({ params }: { params: { id: string } }) {
  checkSession("/signin")
  const workshop = await getWorkshop(params.id)
  return (
    <>
      <div className="grid w-full grid-cols-1 lg:grid-cols-2 gap-5">
        <div
          className="space-y-6 block bg-background w-full py-6 px-10 border-t border-b md:border border-black md:rounded-md"
        >
          <div className="flex space-x-6 items-center">
            <div className="p-4 bg-secondary text-white rounded-md">
              <RiMailLine className="w-6 h-7" />
            </div>
            <div className="space-y-1 flex flex-col">
              <span className="text-lg font-semibold">
                Mail
              </span>
              <span>
                {workshop?.instructor_name +
                  "'s Mail"}
              </span>
            </div>
          </div>
          <a
            className="inline-block w-full"
            href={`mailto:${workshop?.contact_email}`}
            target="_blank"
          >
            <Button
              className="border border-secondary rounded px-8 w-full"
              variant={"link"}
              size={"lg"}
            >
              <Mail className="mr-2 w-4 h-4" />
              {workshop?.contact_email}
            </Button>
          </a>
        </div>
        {workshop?.social_links.map((link) => (
          <div
            key={link}
            className="space-y-6 block bg-background w-full py-6 px-10 border border-black rounded-md"
          >
            <div className="flex space-x-6 items-center">
              <div className="p-4 bg-secondary text-white rounded-md">
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
              <div className="space-y-1 flex flex-col">
                <span className="text-lg font-semibold">
                  {(() => {
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
                </span>
                <span>
                  {workshop?.instructor_name +
                    "'s " +
                    (() => {
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
                      if (
                        link.includes("whatsapp.com") ||
                        link.includes("wa.me")
                      )
                        return "WhatsApp"
                      return "Website"
                    })()}
                </span>
              </div>
            </div>
            <a
              className="inline-block w-full"
              href={link.includes("http") ? link : `https://${link}`}
              target="_blank"
            >
              <Button
                className="border border-secondary rounded px-8 w-full"
                variant={"link"}
                size={"lg"}
              >
                <LinkIcon className="mr-2 w-4 h-4" />
                {link}
              </Button>
            </a>
          </div>
        ))}
      </div>
      <div
        className={`py-6 px-8 flex items-center space-x-6 text-secondary border-t border-b md:border border-black md:rounded-md bg-white`}
      >
        <BiInfoCircle className="w-10 h-10 md:w-6 md:h-6" />
        <p className="md:text-base text-sm text text-[#333] tracking-wide leading-6">
          If there’ll be any problem in contacting the organizer or if they’re
          not responding then please make sure to contact us.
        </p>
      </div>
    </>
  )
}
