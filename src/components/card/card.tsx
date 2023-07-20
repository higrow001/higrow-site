"use client"

import "./card.scss";
import { useEffect, useRef } from "react";



const Card = () => {
  const cardRefs = useRef([]);

  useEffect(() => {
    // Function to calculate the tallest title and tagline height in each row and apply them to all cards in that row
    const adjustCardHeights = () => {
      const rows = {};

      cardRefs.current.forEach((cardRef) => {
        const rowIndex = cardRef.offsetTop;

        const cardTitle = cardRef.querySelector(".card-title h1");
        const cardTagline = cardRef.querySelector(".card-tagline p");

        const titleHeight = cardTitle.offsetHeight;
        const taglineHeight = cardTagline.offsetHeight;

        if (!rows[rowIndex] || titleHeight + taglineHeight > rows[rowIndex]) {
          rows[rowIndex] = titleHeight + taglineHeight;
        }
      });

      cardRefs.current.forEach((cardRef) => {
        const rowIndex = cardRef.offsetTop;

        const cardTitle = cardRef.querySelector(".card-title h1");
        const cardTagline = cardRef.querySelector(".card-tagline p");

        cardTitle.style.height = `${rows[rowIndex] - cardTagline.offsetHeight}px`;
        cardTagline.style.height = `${rows[rowIndex] - cardTitle.offsetHeight}px`;
      });
    };

    // Call the function when the component mounts and on window resize
    adjustCardHeights();
    window.addEventListener("resize", adjustCardHeights);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", adjustCardHeights);
    };
  }, []);
  return (
    <div className="card-container">
<div className="card" ref={(el) => (cardRefs.current[0] = el)}>
    <div className="card-thumbnail">
      <img src="https://img.freepik.com/free-vector/design-process-concept-landing-page_23-2148313670.jpg" />
    </div>
    <div className="card-title">
      <h1>How to build a Design System with Design Tokens in Figma How to build a Design System with Design Tokens in Figma </h1>
      <div className="instructor-name"> <p>By Puneet Kathuria</p> <span>Workshop</span> </div>
    </div>
    <div className="card-tagline">
      <p>Learn how to build complete design system from scratch in just 5 days!  Learn how to build complete design system from scratch in just 5 days!</p>
    </div>
    <div className="card-extra">
      <div className="start-date">
        <p> Starts - <span> 21/07/2023 </span> </p>
      </div>
      <div className="price">
        <p>Rs. 199</p>
      </div>
    </div>
    </div>

    <div className="card" ref={(el) => (cardRefs.current[0] = el)}>
    <div className="card-thumbnail">
      <img src="https://img.freepik.com/premium-photo/word-design-written-top-colorful-geometric-3d-shapes_2227-1663.jpg" />
    </div>
    <div className="card-title">
      <h1>How to build </h1>
      <div className="instructor-name"> <p>By Puneet Kathuria</p> <span>Workshop</span> </div>
    </div>
    <div className="card-tagline">
      <p>Learn how to build complete design system from scratch in just 5 days! </p>
    </div>
    <div className="card-extra">
      <div className="start-date">
        <p> Starts - <span> 21/07/2023 </span> </p>
      </div>
      <div className="price">
        <p>Rs. 199</p>
      </div>
    </div>
    </div>

    <div className="card" ref={(el) => (cardRefs.current[0] = el)}>
    <div className="card-thumbnail">
      <img src="https://sozuhack01.devfolio.co/_next/image?url=https%3A%2F%2Fassets.devfolio.co%2Fhackathons%2Fc6790e750ea84be79e2a5ae86f326021%2Fassets%2Fcover%2F899.png&w=1440&q=100" />
    </div>
    <div className="card-title">
      <h1>How to build a Design System with Design Tokens in Figma </h1>
      <div className="instructor-name"> <p>By Puneet Kathuria</p> <span>Workshop</span> </div>
    </div>
    <div className="card-tagline">
      <p>Learn how to build complete design system from scratch in just 5 days!  </p>
    </div>
    <div className="card-extra">
      <div className="start-date">
        <p> Starts - <span> 21/07/2023 </span> </p>
      </div>
      <div className="price">
        <p>Rs. 199</p>
      </div>
    </div>
    </div>
    </div>
    
  );
};

export default Card;
