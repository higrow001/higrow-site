import { getAnnouncements } from "@/app/_actions/workshop"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"

export default async function announcements({
  params,
}: {
  params: { id: string }
}) {
  const announcements = await getAnnouncements(params.id)
  return (
    <>
      {announcements.length > 0 ? (
        <div className="w-full space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="py-10 px-24 space-y-6 border-2 border-[#333] rounded-md shadow-[2px_2px_0_#333] bg-background"
            >
              <div className="flex items-center justify-between w-full">
                <h3 className="text-3xl font-semibold font-archivo">
                  {ann.title}
                </h3>
                <div className="flex space-x-4 items-center">
                  <span className="font-medium">
                    {formatDateInDDMMYYYY(ann.timestamp, true)}
                  </span>
                </div>
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
