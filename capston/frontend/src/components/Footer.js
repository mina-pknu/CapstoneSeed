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
        옷장
      </button>
      <button
        className={
          currentSection === "lookbook" ? "button selected-button" : "button"
        }
        onClick={() => navigate("/lookbook")}
      >
        코디맵
      </button>
      <button
        className={
          currentSection === "lookbook" ? "button selected-button" : "button"
        }
        onClick={() => navigate("/virtual-fit")}
      >
        착용샷
      </button>
    </div>
  );
};

export default Footer;
