import "./organize.scss"
import Image from "next/image"
import Contestill from "../../assests/contest.webp"
import Workshopill from "../../assests/workshop.webp"
import Illustration from "../../assests/illustration.jpg"
import Link from "next/link"

export default function Organize() {
  return (
    <div className="organize-container">
      <div className="organize-categories">
        <div className="oc-left">
          <h1>Select an Opportunity you want to organize <span>→</span> </h1>
        </div>
        <div className="oc-right">
          <div className="ocr-cards">
            <div className="workshop-card">
              <h1>Workshop</h1>
              <p>Host an interactive workshop with everything you need with diverse range of workshops categories.</p>
            </div>
            <div className="contest-card">
              <h1>Contest</h1>
              <p>Host a contest with everything you need from team building to announcements to finishing and everything in between</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
