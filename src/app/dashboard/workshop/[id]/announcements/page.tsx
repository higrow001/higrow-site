import { getWorkshop } from "@/app/_actions/workshop"
import checkSession from "@/lib/utils/check-session"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"

export const dynamic = "force-dynamic"

export default async function announcements({
  params,
}: {
  params: { id: string }
}) {
  checkSession("/signin")
  const workshop = await getWorkshop(params.id)
  return (
    <>
      {workshop && workshop.announcements.length > 0 ? (
        <div className="w-full space-y-4">
          {workshop.announcements.map((ann, index) => (
            <div
              key={index}
              className="py-6 px-8 md:py-10 md:px-16 space-y-6 border-t border-b md:border-2 border-[#333] md:rounded-md bg-background"
            >
              <div className="flex items-center justify-between w-full">
              <h3 className="text-xl md:text-3xl font-semibold font-archivo">
              {ann.title} <span className="text-xs ml-3 md:ml-6 tracking-wider md:text-base font-light">
                {formatDateInDDMMYYYY(ann.timestamp, false)}
              </span>
            </h3>
              </div>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: ann.message }}
              ></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <p className="text-center text-xl">
            No announcments posted till now.
          </p>
        </>
      )}
    </>
  )
}
