"use client"

import { useAlert } from "@/states/alert"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Terminal } from "lucide-react"
import { Button } from "./ui/button"

function AppAlert() {
  const { show, data, hideAlert } = useAlert()
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
      {data?.clickClose?.text && (
        <Button
          onClick={hideAlert}
          className="float-right text-neutral-800"
          variant={"outline"}
          size={"xsm"}
        >
          {data?.clickClose?.text}
        </Button>
      )}
      {data?.action && (
        <div className="flex space-x-2 items-center float-right">
          {data.action.cancelText && (
            <Button
              className="text-neutral-800"
              onClick={hideAlert}
              variant={"ghost"}
              size={"xsm"}
            >
              {data.action.cancelText}
            </Button>
          )}
          <Button
            className="text-neutral-800"
            onClick={() => {
              data.action?.callback()
              hideAlert()
            }}
            variant={"outline"}
            size={"xsm"}
          >
            {data?.action?.text}
          </Button>
        </div>
      )}
    </Alert>
  )
}

export default AppAlert
