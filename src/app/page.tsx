import HomeHero from "@/components/navbar/home-hero/home-hero";
import "./home.scss";
import Link from "next/link";
import HomeTodo from "@/components/navbar/home-todo/home-todo";

export default function Home() {
  return (
    <div>
      <div className="home-container">
       <HomeHero />
       <HomeTodo />
      </div>
    </div>
  );
}
