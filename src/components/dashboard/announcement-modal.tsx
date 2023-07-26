"use client"
import "react-quill/dist/quill.snow.css"
import { useState } from "react"
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
import { Announcement } from "@/lib/types"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function MakeAnnoucement({
  workshop_id,
  announcements,
}: {
  workshop_id: string
  announcements: Announcement[]
}) {
  const supabase = createClientComponentClient()
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
      <DialogContent className="min-w-[50rem] p-12 space-y-6 max-h-[95%] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Make an announcment</DialogTitle>
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

            const anns = announcements
            anns.push({
              title,
              message: value,
              timestamp: new Date().toISOString(),
            })
            await supabase
              .from("workshops")
              .update({
                announcements: anns,
              })
              .eq("id", workshop_id)
            showAutoCloseAlert({
              title: "Announcement created.",
              type: "default",
              description: "You can close this popup now.",
            })
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
                  [{ header: [1, 2, false] }],
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
                    { indent: "-1" },
                    { indent: "+1" },
                  ],
                  ["clean"],
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
            <Button
              onClick={() => setShowPreview(true)}
              type="button"
              variant={"secondary"}
            >
              Preview
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
        {showPreview && (
          <>
            <h3 className="text-xl">Preview in below box</h3>
            <div className="prose-sm prose-h1:text-2xl prose-h2:text-lg border rounded-md w-full border-secondary p-4">
              <div className="not-prose">
                <h1 className="text-3xl font-semibold">{title}</h1>
              </div>
              <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
