import "./home.scss";
import HomeHero from "@/components/home-hero/home-hero";
import HomeTodo from "@/components/home-todo/home-todo";
import HomeExplore from "@/components/home-explore/home-explore";

export default function Home() {
  return (
    <div>
      <div className="home-container">
        <HomeHero />
        <HomeTodo />
        <HomeExplore />
      </div>
    </div>
  );
}
