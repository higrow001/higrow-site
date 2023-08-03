"use client"
import "react-quill/dist/quill.snow.css"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ReactQuill from "react-quill"
import { useAlert } from "@/states/alert"
import { Announcement, Participant } from "@/lib/types"
import { createAnnouncement } from "@/app/_actions/workshop"
import LoadingSpinner from "../loading-spinner"

export default function MakeAnnoucement({
  workshop_id,
  announcements,
  participants,
  workshop_title
}: {
  workshop_id: string
  announcements: Announcement[]
  participants: Participant[]
  workshop_title: string
}) {
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState("")
  const [title, setTitle] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const { showAutoCloseAlert } = useAlert()
  return (
    <Dialog>
      <DialogTrigger className="w-full">
        <Button className="w-full" variant={"secondary"} size={"xl"}>
          Make New Announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="md:min-w-[50rem] p-6 md:p-12 space-y-6 md:max-h-[95%] overflow-y-auto">
        {isPending ? (
          <LoadingSpinner sizeStyle="w-12 h-12" />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="md:pt-0 pt-10">Make an announcment</DialogTitle>
              <DialogDescription>
                You can use announcements to convey a message to selected
                participants. You can also use links in your message to make your
                message more effective.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={async (event) => {
                event.preventDefault()
                if (!title)
                  return showAutoCloseAlert({
                    title: "Please enter title.",
                    type: "destructive",
                  })
                if (!value || value === "<p><br></p>" || value === "<p></p>")
                  return showAutoCloseAlert({
                    title: "Please enter message.",
                    type: "destructive",
                  })
                startTransition(async () => {
                  await createAnnouncement(announcements, workshop_id, title, value, participants, workshop_title)
                  showAutoCloseAlert({
                    title: "Success.",
                    description: "You can close the modal now."
                  })
                })
                setShowPreview(false)
                setTitle("")
                setValue("")
              }}
              className="space-y-10"
            >
              <div>
                <Label className="text-lg tracking-wider" htmlFor="title">
                  Title/Subject
                </Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-4"
                  name="title"
                />
              </div>
              <div>
                <Label className="text-xl tracking-wider" htmlFor="message">
                  Message
                </Label>
                <ReactQuill
                  theme="snow"
                  modules={{
                    toolbar: [
                      [
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "link",
                      ],
                      [
                        { list: "ordered" },
                        { list: "bullet" },
                      ],
                    ],
                  }}
                  value={value}
                  onChange={(val) => {
                    if (showPreview) setShowPreview(false)
                    setValue(val)
                  }}
                />
              </div>
              <div className="flex space-x-4 items-center">

                <Button type="submit">Submit</Button>
                <Button
                  onClick={() => setShowPreview(true)}
                  type="button"
                  variant={"outline"}
                >
                  Preview
                </Button>
              </div>
            </form>
            {showPreview && (
              <>
                <h3 className="text-xl">Preview in below box</h3>
                <div className="prose border rounded-md w-full border-secondary p-4">
                  <div className="not-prose">
                    <h1 className="text-3xl font-semibold">{title}</h1>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: value }}></div>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
