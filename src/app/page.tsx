import "./home.scss";
import HomeHero from "@/components/home-hero/home-hero";
import HomeTodo from "@/components/home-todo/home-todo";

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
