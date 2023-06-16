import React from "react";
import "./card.scss";
import { BsGoogle, BsInstagram, BsWhatsapp, BsDiscord, BsLink45Deg } from "react-icons/bs";
import Link from "next/link";

const Card = () => {
  return (
    <div className="card-binder">
      <div className="card">
        <div className="card-container">
          <div className="card-top">
            <div className="ct-left">
                <h1>Complete UI Design Workshop</h1>
                
            </div>
            <div className="ct-right">
            <p>workshop</p>
            </div>
          </div>
          <div className="card-middle">
            <div className="cm-top">
                <p>Biggest Designathon happening online ever in history!</p>
            </div>
            <div className="cm-bottom">
                <div className="cmb-left">
                    <div className="cmb-button">Live</div>
                    <div className="cmb-button">Online</div>
                </div>
                <div className="cmb-right">
                    <div className="cmb-links"> <BsInstagram /> </div>
                    <div className="cmb-links"> <BsWhatsapp /> </div>
                    <div className="cmb-links"> <BsDiscord /> </div>
                    <div className="cmb-links"> <BsLink45Deg /> </div>
                </div>
            </div>
          </div>
          <div className="card-bottom">
          <div className="cbb-left">
                    <div className="cbb-button-category">Design</div>
                    <div className="cbb-button-date">Starts <span>16/07/2023</span> </div>
                </div>
                <div className="registration-button">
                   <Link className="rb-button" href=""> <button> Join ₹299 </button> </Link> 
                </div>
          </div>
          
        </div>
      </div>
      </div>
  );
};

export default Card;
