"use client"
import "react-quill/dist/quill.snow.css"
import { useEffect, useState } from "react"
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
import { Timestamp, addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function MakeAnnoucement({
  workshop_id,
}: {
  workshop_id: string
}) {
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

            await addDoc(
              collection(db, "workshops", workshop_id, "announcements"),
              {
                title,
                message: value,
                timestamp: Timestamp.now(),
              }
            )
            showAutoCloseAlert({
              title: "Announcement created.",
              type: "default",
              description: "You can close this popup now.",
            })
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
              className="text-lg mt-4"
              theme="snow"
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
            <div className="prose-sm border rounded-md w-full border-secondary p-4">
              <h1>{title}</h1>
              <div dangerouslySetInnerHTML={{ __html: value }}></div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
