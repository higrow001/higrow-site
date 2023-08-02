import { getWorkshop } from "@/app/_actions/workshop"
import checkSession from "@/lib/utils/check-session"

export default async function details({ params }: { params: { id: string } }) {
  checkSession("/signin")
  const workshop = await getWorkshop(params.id)
  return (
    <>
      {workshop && (
        <div className="p-12 space-y-16 border-2 border-[#333] rounded-md shadow-[2px_2px_0_#333] bg-background">
          <div className="space-y-5">
            <h2 className="text-3xl text-secondary font-medium">
              About Instructor :-
            </h2>
            <div
              className="prose max-w-[90ch]"
              dangerouslySetInnerHTML={{ __html: workshop.instructor_info }}
            ></div>
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl text-secondary font-medium">
              About Workshop :-
            </h2>
            <div
              className="prose max-w-[90ch]"
              dangerouslySetInnerHTML={{ __html: workshop.workshop_info }}
            ></div>
          </div>
          <div className="space-y-5">
            <h2 className="text-3xl text-secondary font-medium">
              What you'll learn :-
            </h2>
            <div
              className="prose max-w-[90ch]"
              dangerouslySetInnerHTML={{ __html: workshop.describe_each_day }}
            ></div>
          </div>
        </div>
      )}
    </>
  )
}
