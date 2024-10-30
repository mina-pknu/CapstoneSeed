import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/ItemDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const LookBookGrid = ({ userVirtualFits, item }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFit, setSelectedFit] = useState(null);

  // 커스텀 화살표 컴포넌트
  const NextArrow = ({ className, onClick }) => (
    <div className={className} onClick={onClick}>
      <i className="fas fa-chevron-right"></i>
    </div>
  );

  const PrevArrow = ({ className, onClick }) => (
    <div className={className} onClick={onClick}>
      <i className="fas fa-chevron-left"></i>
    </div>
  );

  const settings = {
    dots: true, // 하단에 점으로 페이지네이션 표시
    infinite: true, // 무한 반복
    speed: 500, // 슬라이더 속도
    slidesToShow: 2, // 한 번에 보여줄 슬라이드 수 (반응형에 따라 변경됨)
    slidesToScroll: 2, // 한 번에 넘어가는 슬라이드 수
    nextArrow: <NextArrow />, // 커스텀 다음 화살표
    prevArrow: <PrevArrow />, // 커스텀 이전 화살표
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1, // 화면 크기가 768px 이하일 때 슬라이드 1개만 표시
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
                src={fit.image[0]} // 사진 중 첫번째 이미지만 보이도록
                alt={`VirtualFit ${index}`}
                className="user-virtualfit-img"
                onClick={() => openModal(fit)} // 해당 사진의 fit이 전달됨
              />
              <p className="user-virtualfit-text">
                {fit.style}의 {getColorNmae(fit.color)} {fit.subcategory}
                <br></br>AI 착용샷
              </p>
            </div>
          ))}
        </>
      )}

      {/**모달 구현 */}
      {isModalOpen && (
        <>
          <div className="virtualfit-modal-overlay">
            <div className="virtualfit-modal-content">
              <button
                onClick={closeModal}
                className="virtualfit-modal-close-btn"
              >
                <FontAwesomeIcon icon={faCircleXmark} />
              </button>
              {selectedFit && (
                <Slider {...settings} className="virtualfit-Slider">
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
        </>
      )}
    </div>
  );
};

export default LookBookGrid;
