"use client"

import React from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import { Facebook, Instagram, Mail, Youtube } from "lucide-react"
import { RiDiscordLine, RiWhatsappLine } from "react-icons/ri"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { WorkshopDataType } from "@/lib/types"

export default async function AdminManage() {
  const supabase = createClientComponentClient()
  const req = await supabase.from("workshops").select("*").eq("approved", false)
  const workshops = req.data as WorkshopDataType[]
  if (workshops?.length === 0)
    return <p>No workshops or contests to approve right now.</p>

  return (
    <div className="flex flex-col max-w-7xl w-full my-20 mx-auto space-y-8">
      <h1 className="text-4xl font-semibold">Pending Workshops</h1>
      {workshops &&
        workshops.map((document, i) => (
          <React.Fragment key={i}>
            <Dialog>
              <div className="flex w-full py-4 px-4 items-center border border-input bg-background rounded-md divide-x-2 divide-input">
                <span className="px-4">
                  {i + 1 < 10 ? `0${i + 1}.` : `${i + 1}.`}
                </span>
                <h2 className="text-lg px-4 grow-[3] truncate">
                  {document.name}
                </h2>
                <DialogTrigger
                  className={`${buttonVariants({ variant: "ghost" })} mx-4`}
                >
                  Details
                </DialogTrigger>
                <Button
                  onClick={async () =>
                    await supabase
                      .from("workshops")
                      .delete()
                      .eq("id", document.id)
                  }
                  variant={"secondary"}
                  className="border-none mr-4 px-6"
                >
                  Decline
                </Button>
                <Button
                  onClick={async () => {
                    await supabase
                      .from("workshops")
                      .update({ approved: true })
                      .eq("id", document.id)
                  }}
                  className="border-none px-8"
                >
                  Approve
                </Button>
              </div>
              <DialogContent className="max-w-7xl gap-0 border border-secondary p-0 max-h-[95%] overflow-y-auto">
                <header className="w-full space-y-1 py-8 px-12 border-b border-secondary">
                  <h1 className="text-3xl font-bold font-archivo text-secondary-darker">
                    {document.name}
                  </h1>
                  <span className="text-secondary text-lg font-medium block">
                    {document.tagline}
                  </span>
                  <span className="text-secondary font-medium inline-block">
                    By {document.instructor_name}
                  </span>
                </header>
                <div className="flex">
                  <main className="basis-[70%] border-r border-secondary space-y-12 py-8 px-12">
                    <div className="space-y-4">
                      <h2 className="text-2xl text-secondary font-medium">
                        About Instructor :-
                      </h2>
                      <p>{document.instructor_info}</p>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl text-secondary font-medium">
                        About Workshop :-
                      </h2>
                      <p>{document.workshop_info}</p>
                    </div>
                    <div className="space-y-4">
                      <h2 className="text-2xl text-secondary font-medium">
                        About Instructor :-
                      </h2>
                      <p>{document.describe_each_day}</p>
                    </div>
                    <span className="flex space-x-2 items-center flex-wrap">
                      <span className="font-semibold text-xl">
                        Contact email -
                      </span>
                      <span className="text-xl">{document.contact_email}</span>
                    </span>
                    <span className="flex space-x-2 items-center flex-wrap">
                      <span className="font-semibold text-xl">Bank name -</span>
                      <span className="text-xl">
                        {document.bank_details.name}
                      </span>
                    </span>
                    <span className="flex space-x-2 items-center flex-wrap">
                      <span className="font-semibold text-xl">
                        Bank email -
                      </span>
                      <span className="text-xl">
                        {document.bank_details.email}
                      </span>
                    </span>
                    <span className="flex space-x-2 items-center flex-wrap">
                      <span className="font-semibold text-xl">
                        Bank account number -
                      </span>
                      <span className="text-xl">
                        {document.bank_details.account_number}
                      </span>
                    </span>
                    <span className="flex space-x-2 items-center flex-wrap">
                      <span className="font-semibold text-xl">Bank ifsc -</span>
                      <span className="text-xl">
                        {document.bank_details.IFSC}
                      </span>
                    </span>
                  </main>
                  <aside className="basis-[35%] h-full p-8 space-y-8">
                    <div className="space-y-6">
                      <span className="flex space-x-2 items-center flex-wrap">
                        <span className="font-semibold">
                          Application starts from -
                        </span>
                        <span>
                          {formatDateInDDMMYYYY(
                            document.application_closing_date,
                            true
                          )}
                        </span>
                      </span>
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">Starts from -</span>
                        <span>
                          {formatDateInDDMMYYYY(
                            document.workshop_starting_date,
                            true
                          )}
                        </span>
                      </span>
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">Ends on -</span>
                        <span>
                          {formatDateInDDMMYYYY(
                            document.workshop_ending_date,
                            true
                          )}
                        </span>
                      </span>
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">Duration -</span>
                        <span>
                          {document.time_format === "hours"
                            ? `${document.time_per_day} hours X ${document.working_days} Days`
                            : `${document.time_per_day} mins X ${document.working_days} Days`}
                        </span>
                      </span>
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">Happening -</span>
                        <span>{document.mode}</span>
                      </span>
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">Category -</span>
                        <span>{document.category}</span>
                      </span>
                      <span className="flex space-x-2 items-center">
                        <span className="font-semibold">Entry Amount -</span>
                        <span className="text-lg font-medium">
                          {document.is_paid ? document.workshop_amount : "Free"}
                        </span>
                      </span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-medium text-xl">
                        Contact organizer :-
                      </h3>
                      <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
                        {document.social_links.map(
                          (link: string) =>
                            link.length > 0 && (
                              <a
                                key={link}
                                className="p-3 border border-secondary rounded-md"
                                href={link}
                                target="_blank"
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
                                    return (
                                      <RiDiscordLine className="text-2xl" />
                                    )
                                  if (link.includes("whatsapp.com"))
                                    return (
                                      <RiWhatsappLine className="text-2xl" />
                                    )
                                  return <Mail />
                                })()}
                              </a>
                            )
                        )}
                      </div>
                    </div>
                  </aside>
                </div>
              </DialogContent>
            </Dialog>
          </React.Fragment>
        ))}
    </div>
  )
}