import "./organize.scss";
import Image from "next/image";
import Contestill from "../../assests/12953798_Jan-Success_1.jpg";
import Workshopill from "../../assests/6974855_4380.jpg";
import Link from "next/link";

export default function Organize() {
  return (
    <div className="organize-container">
      <div className="oc-top">
        <h1>You don’t have to spend on marketing to reach people 📈</h1>
        <p>
          Higrow works as a marketplace for contests and workshops. You can
          organize your own contest or workshop. What’s different then? Well by
          using HiGrow, you don’t have to spend on marketing to reach out to
          more people. You don’t have to be panic about how to recieve money
          from them. Just focus on what you’re good at. Rest of us is our duty!
        </p>
      </div>
      <h1 className="opportunity-type">Choose opportunity</h1>
      <div className="oc-bottom">
        <Link href="/organize/workshop">
          {" "}
          <div className="workshop-card">
            <div className="card-image">
              <Image src={Workshopill} alt="" />
            </div>
            <div className="card-text">
              <h1>Workshop</h1>
              <p>
                It’s period of discussion and practical work on a particular
                subject.
              </p>
            </div>
          </div>{" "}
        </Link>
        <Link href="/organize/contest">
          {" "}
          <div className="contest-card">
            <div className="card-image">
              <Image src={Contestill} alt="" />
            </div>
            <div className="card-text">
              <h1>Contest</h1>
              <p>
                Contests is an organized event in which people try to win
                something.
              </p>
            </div>
          </div>{" "}
        </Link>
      </div>
    </div>
  );
}
