// src/components/Footer.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Wardrobe.css";

const Footer = ({ currentSection }) => {
  const navigate = useNavigate();

  return (
    <div className="footer">
      <button
        className={
          currentSection === "homepage" ? "button selected-button" : "button"
        }
        onClick={() => navigate("/homepage")}
      >
        <div id="ai-icon">
          <img src="./hanger.png" alt="AI Icon" />
        </div>
        <div>옷장</div>
      </button>
      <button
        className={
          currentSection === "lookbook" ? "button selected-button" : "button"
        }
        onClick={() => navigate("/lookbook")}
      >
        <div id="ai-icon">
          <img src="./cloth.png" alt="AI Icon" />
        </div>
        <div>코디맵</div>
      </button>
      <button
        className={
          currentSection === "lookbook" ? "button selected-button" : "button"
        }
        onClick={() => navigate("/virtual-fit")}
      >
        <div id="ai-icon">
          <img src="./ai-icon.png" alt="AI Icon" />
        </div>
        <div>가상착용</div>
      </button>
    </div>
  );
};

export default Footer;
