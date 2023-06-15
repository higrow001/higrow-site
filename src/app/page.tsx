import Navbar from "../components/navbar/navbar";
import "./home.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="home-container">
        <div className="home-hero">
          <div className="hero-top">
            <div className="htop-left">
              <h1> What do we do? </h1>

              <p>
                {" "}
                We're building a platform where organizers can organize any
                contest or workshop doesn’t matter which category is it & also
                participants to join any contest or workshop of each and every
                category at one stop{" "}
              </p>
            </div>
            <div className="htop-center">
              <h1> <span> HiGrow </span> - Say Hi 👋 to your growth 📈</h1>
              <p>
              Participate exciting workshops, contests and grow your knowledge in your field. Wanna listen something amazing? Even you can also organize your own workshop or contest
              </p>
              <Link href="#" className="htopc-button"><button>Explore Now</button></Link>
            </div>
            <div className="htop-right">
            <h1> Our Aim </h1>
            <p>
            To provide a one stop platform to both organizers and participants to join or organize any sort of contest or workshop from publishing to joining participants to the whole management to finishing it!
            </p>
            </div>
          </div>

          <div className="hero-bottom"></div>
        </div>
        <div className="hbottom-left"></div>
        <div className="hbottom-center"></div>
        <div className="hbottom-right"></div>
      </div>
    </div>
  );
}
