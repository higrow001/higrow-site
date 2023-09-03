import { Button } from "@/components/ui/button";
import Link from "next/link";

function HomeHero() {
    return (  <div className="home-hero">
    <div className="hero-top">
      <div className="htop-left">
        <h1 className="font-archivo">We're on a mission! </h1>
        <p>
          Cultivating online marketplace for learning, creativity and
          connecting enthusiasts globally.
        </p>
      </div>
      <div className="htop-center">
        <h1 className="font-archivo pb-8 md:pb-12">
          {" "}
          <span> HiGrow </span> - Say Hi👋 to your growth📈
        </h1>
        <Button
          asChild
          className="h-12 md:h-16 text-sm md:text-lg px-8 md:px-14 bg-secondary md:hover:bg-secondary/90 text-primary-foreground md:hover:shadow-[6px_6px_0_#333] hover:shadow-[2px_2px_0_#333] rounded-none transition duration-100"
        >
          <Link href="/workshops">Explore Now</Link>
        </Button>
      </div>
      <div className="htop-right">
        <h1 className="font-archivo"> What you can do? </h1>
        <p>
          Become even greater in your field or upscale your skills by
          joining workshops. Even you can create one!
        </p>
      </div>
    </div>

    <div className="hero-bottom">
      <div className="hbottom-left">
        <Link className="hbottom-links" href="mailto:higrow25@gmail.com">
          <button>
            Give Us Feedback <span> → </span>{" "}
          </button>
        </Link>
      </div>
      <div className="hbottom-center">
        <p>
          {" "}
          We’re an early stage startup so your feedback or suggestions
          means a lot to us :){" "}
        </p>
      </div>
      <div className="hbottom-right">
        <Link className="hbottom-links" href="mailto:higrow25@gmail.com">
          <button> Contact Us</button>
        </Link>
      </div>
    </div>
  </div> );
}

export default HomeHero;