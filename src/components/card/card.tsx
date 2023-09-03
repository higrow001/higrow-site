import "./card.scss"
import { WorkshopDataType } from "@/lib/types"
import { formatDateInDDMMYYYY } from "@/lib/utils/format-date"
import Image from "next/image"

const Card = (
  props: Pick<
    WorkshopDataType,
    | "name"
    | "tagline"
    | "instructor_name"
    | "workshop_starting_date"
    | "is_paid"
    | "workshop_amount"
    | "thumbnail_url" 
  >
) => {
  return (
    <div className="card">
      <div className="card-thumbnail">
        <Image
          src={
            props.thumbnail_url ??
            "https://img.freepik.com/free-vector/design-process-concept-landing-page_23-2148313670.jpg"
          }
          alt="Thumbnail image"
          width={400}
          height={280}
        />
      </div>
      <div className="card-title">
        <h1>{props.name}</h1>
        <div className="instructor-name">
          {" "}
          <p>By {props.instructor_name}</p> <span>Workshop</span>{" "}
        </div>
      </div>
      <div className="card-tagline">
        <p>{props.tagline}</p>
      </div>
      <div className="card-extra">
        <div className="start-date">
          <p>
            {" "}
            Starts -{" "}
            <span>
              {" "}
              {formatDateInDDMMYYYY(props.workshop_starting_date)}{" "}
            </span>{" "}
          </p>
        </div>
        <div className="price">
          <p>{props.is_paid ? `${props.workshop_amount}₹` : "FREE"}</p>
        </div>
        </div>
        </div>
  )
}

export default Card
