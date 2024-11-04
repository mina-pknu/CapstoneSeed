import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/ItemDetail.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LookBookGrid = ({ userVirtualFits, item }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFit, setSelectedFit] = useState(null);

  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  // 모달 열기
  const openModal = (fit) => {
    setSelectedFit(fit);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFit(null);
  };

  // 오버레이 클릭으로 모달 닫기 (화살표 제외)
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("virtualfit-modal-overlay")) {
      closeModal();
    }
  };

  const getColorNmae = (colorCode) => {
    const colorMap = {
      "#000000": "블랙",
      "#FFFFFF": "화이트",
      "#808080": "그레이",
      "#FF007F": "핑크",
      "#FF0000": "빨강",
      "#FFFF00": "노란",
      "#1DDB16": "초록",
      "#0000FF": "파란",
      "#F5F5DC": "베이지",
      "#8B4513": "브라운",
    };
    return colorMap[colorCode];
  };

  return (
    <div className="lookbook-grid">
      <div className="empty-div">
        <div className="empty-div-img">
          <div
            className="empty-div-togo-codimap"
            onClick={() =>
              navigate("/virtual-fit", {
                state: {
                  style: item.style,
                  color: item.color,
                  category: item.category,
                  subcategory: item.subcategory,
                  id: item.id,
                },
              })
            }
          >
            + 나만의 가상 착용샷 만들기
          </div>
        </div>
        <div className="empty-div-text"></div>
      </div>
      {userVirtualFits.length > 0 && (
        <>
          {userVirtualFits.map((fit, index) => (
            <div key={index} className="user-virtualfit-item">
              <img
                src={fit.image[0]}
                alt={`VirtualFit ${index}`}
                className="user-virtualfit-img"
                onClick={() => openModal(fit)}
              />
              <p className="user-virtualfit-text">
                {fit.style}의 {getColorNmae(fit.color)} {fit.subcategory}
                <br />
                AI 착용샷
              </p>
            </div>
          ))}
        </>
      )}

      {isModalOpen && (
        <div className="virtualfit-modal-overlay" onClick={handleOverlayClick}>
          <div
            className="virtualfit-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedFit && (
              <Slider {...settings2} className="virtualfit-Slider">
                {selectedFit.image.map((url, index) => (
                  <div key={index} className="virtualfit-slider-item">
                    <img
                      src={url}
                      alt={`Modal ${index}`}
                      className="virtualfit-slider-img"
                    />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LookBookGrid;
