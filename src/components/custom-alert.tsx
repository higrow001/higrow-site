"use client"

import { useAlert } from "@/states/alert"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Terminal } from "lucide-react"

function AppAlert() {
  const { show, data } = useAlert()
  return (
    <Alert
      variant={data?.type}
      className={`w-full max-w-2xl fixed left-1/2 -translate-x-1/2 top-4 transition duration-300 ${
        show ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      {data?.type === "default" ? (
        <Terminal className="h-4 w-4" />
      ) : (
        <AlertCircle className="h-4 w-4" />
      )}
      <AlertTitle>{data?.title}</AlertTitle>
      <AlertDescription>{data?.description}</AlertDescription>
    </Alert>
  )
}

export default AppAlert
