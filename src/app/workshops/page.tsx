import "./workshops.scss"
import { getWorkshops } from "../_actions/workshop"
import WorkshopNavbar from "@/components/navbar/workshops-nav"
import Card from "@/components/card/card"
import Link from "next/link"

interface WorkshopsPageProps {
  searchParams: {
    [key: string]: string | undefined
  }
}

const Workshops = async ({ searchParams }: WorkshopsPageProps) => {
  const { categories, search } = searchParams
  const workshops = await getWorkshops({ categories, search, approved: true })

  return (
    <div className="workshops-container">
      <WorkshopNavbar />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 justify-items-center py-16 gap-x-8 gap-y-16 xl:gap-16 px-10 sm:px-8 md:px-12 xl:px-24 2xl:px-32">
        {workshops?.map((workshop, index) => (
          <Link
            aria-label={workshop.name}
            key={index}
            href={`/workshop/${workshop.id}`}
            className="block w-full max-w-[400px] h-full"
          >
            <Card
              name={workshop.name}
              tagline={workshop.tagline}
              instructor_name={workshop.instructor_name}
              is_paid={workshop.is_paid}
              workshop_amount={workshop.workshop_amount}
              workshop_starting_date={workshop.workshop_starting_date}
              thumbnail_url={workshop.thumbnail_url}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Workshops
