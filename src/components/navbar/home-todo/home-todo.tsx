import React from "react";
import "./home-todo.scss";

const HomeTodo = () => {
  return (
    <div className="hometodo-container">
      <div className="htd-title">
        <h1>Things you can do 👇</h1>
      </div>
      <div className="htd-boxes">
        <div className="htd-boxleft">
          <h1>
            <span> Explore </span>Oppurtunities
          </h1>
          <p>
            Become even greater in your field or upscale your skills by joining
            workshops.  <br /> <br /> Explore different contests and compete with the fellows
            to upscale your skills!
          </p>
        </div>
        <div className="htd-boxright">
          <h1>
            <span> Host </span>Oppurtunities
          </h1>
          <p>
            Host any contest or workshop of any category according to your
            interest. <br /> <br />  HiGrow gives you audience* so you don't have to spend money
            on marketing!{" "}
          </p>
        </div>
      </div>
      <div className="htd-bottom">
        <p>*At this early stage we don't have so much audience but feel free to become a starting part of a big story ;)</p>
      </div>
    </div>
  );
};

export default HomeTodo;
