import HomeHero from "@/components/home-hero/home-hero";
import "./home.scss";
import Link from "next/link";
import HomeTodo from "@/components/home-todo/home-todo";
import Card from "@/components/card/card";

export default function Home() {
  return (
    <div>
      <div className="home-container">
       <HomeHero />
       <HomeTodo />
       <Card />
      </div>
    </div>
  );
}
