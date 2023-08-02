"use client"
import { useAdminAccess } from "@/states/admin"

export default function ProtectLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { adminAccess } = useAdminAccess()
  if (!adminAccess)
    return (
      <div className="flex justify-center items-center h-full w-full">
        <h1 className="text-4xl font-archivo font-semibold text-red-600">
          Access Denied!!
        </h1>
      </div>
    )
  return children
}
