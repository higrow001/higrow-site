import { getWorkshop } from "@/app/_actions/workshop"
import { PublicWorkshopData } from "@/lib/types"

export default async function details({ params }: { params: { id: string } }) {
  const {
    instructor_info,
    workshop_info,
    describe_each_day,
  }: PublicWorkshopData = await getWorkshop(params.id)
  return (
    <div className="p-12 space-y-16 border-2 border-[#333] rounded-md shadow-[2px_2px_0_#333] bg-background">
      <div className="space-y-5">
        <h2 className="text-3xl text-secondary font-medium">
          About Instructor :-
        </h2>
        <p className="text-[#333] tracking-wide leading-7 ">
          {instructor_info}
        </p>
      </div>
      <div className="space-y-5">
        <h2 className="text-3xl text-secondary font-medium">
          About Workshop :-
        </h2>
        <p className="text-[#333] tracking-wide leading-7">{workshop_info}</p>
      </div>
      <div className="space-y-5">
        <h2 className="text-3xl text-secondary font-medium">
          What you'll learn :-
        </h2>
        <p className="text-[#333] tracking-wide leading-7">
          {describe_each_day}
        </p>
      </div>
    </div>
  )
}
