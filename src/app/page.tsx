import HomeHero from "@/components/navbar/home-hero/home-hero";
import "./home.scss";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="home-container">
       <HomeHero />
     
      </div>
    </div>
  );
}
