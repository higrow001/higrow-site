import React from "react";
import "./home-explore.scss";
import Link from "next/link";
import Card from "../card/card";

const HomeExplore = () => {
  return (
    <div className="he-container">
      <div className="workshop-card-container">
        <div className="he-top">
          <h1>Explore Workshops</h1>
          <Link href="workshops" className="explore-button">
            <button>See all</button>
          </Link>
        </div>
        <div className="he-bottom">
          <Card />
          <Card />
        </div>
      </div>
      <div className="contest-card-container">
        <div className="he-top">
          <h1>Explore Contests</h1>
          <Link href="workshops" className="explore-button">
            <button>See all</button>
          </Link>
        </div>
        <div className="he-bottom">
          <Card />
          <Card />
        </div>
      </div>
    </div>
  );
};

export default HomeExplore;
