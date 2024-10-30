import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/ItemDetail.css";
import axios from "axios";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LookBookGrid from "./LookBookGrid";
import CodiMapGrid from "./CodimapGrid";
import RecommendedSkeleton from "./RecommendedSkeleton";

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

const ItemDetail = () => {
  const settings = {
    dots: true, // 하단에 점으로 페이지네이션 표시
    infinite: true, // 무한 반복
    speed: 500, // 슬라이더 속도
    slidesToShow: 5, // 한 번에 보여줄 슬라이드 수 (반응형에 따라 변경됨)
    slidesToScroll: 5, // 한 번에 넘어가는 슬라이드 수
    nextArrow: <NextArrow />, // 커스텀 다음 화살표
    prevArrow: <PrevArrow />, // 커스텀 이전 화살표
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3, // 화면 크기가 768px 이하일 때 슬라이드 1개만 표시
          slidesToScroll: 3,
        },
      },
    ],
  };

  const location = useLocation();
  const { item } = location.state || {}; // Wardrobe.js에서 전달된 item

  const [similarItems, setSimilarItems] = useState([]);
  const [anotherSimilarItems, setAnotherSimilarItems] = useState([]);

  const [loading, setLoading] = useState(false);
  const [anotherItemsLoading, setAnotherItemsLoading] = useState(false);

  // 룩북 아이템 상태 관리
  const [userVirtualFits, setUserVirtualFits] = useState([]);
  // 코디맵 아이템 상태 관리
  const [userCodiMaps, setUserCodiMaps] = useState([]);

  // 설명(추가설명) 상태 관리
  const [description, setDescription] = useState(item?.description || ""); // 기존 설명이 있으면 사용

  const [isSaving, setIsSaving] = useState(false);

  // const [clothingType, setClothingType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("옷 종류 선택");

  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // 드롭다운 열고 닫기
  };

  // 두 번째 슬라이더 설정 (사용자가 버튼을 눌러 유사 상품을 로딩할 때)
  const anotherSimilarItemsSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: anotherSimilarItems.length > 0 ? <NextArrow /> : <></>,
    prevArrow: anotherSimilarItems.length > 0 ? <PrevArrow /> : <></>,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  // 룩북, 코디맵 버튼변경 탭
  const [activeTab, setActiveTab] = useState("");

  // 룩북, 코디맵 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "lookbook") {
      // fetchLookbookItems();
    } else if (tab === "codimap") {
      // fetchCodimapItems();
    }
  };

  // 설명 변경 핸들러
  const handleDescriptionChange = (e) => {
    setIsSaving(true);
    setDescription(e.target.value);
    setIsSaving(false);
  };

  const saveDescription = async () => {
    setIsSaving(true);
    try {
      const storedItems =
        JSON.parse(localStorage.getItem("clothingItems")) || [];

      const updatedItems = storedItems.map((storedItem) =>
        storedItem.id === item.id ? { ...storedItem, description } : storedItem
      );

      // localStorage에 업데이트된 아이템 리스트 저장
      localStorage.setItem("clothingItems", JSON.stringify(updatedItems));

      alert("설명이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("Error saving description:", error);
      alert("설명 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 태그가 없거나 2개 미만일 때 처리하는 함수
  const getTags = () => {
    let tags = item.tags ? item.tags.split(",").map((tag) => tag.trim()) : [];

    // 태그가 없거나 최소 2개 미만이면 category와 season을 추가
    if (tags.length < 2) {
      if (!tags.includes(item.style)) {
        tags.push(item.style);
      }
      if (!tags.includes(item.category)) {
        tags.push(item.category);
      }
      if (!tags.includes(item.season)) {
        tags.push(item.season);
      }
    }

    return tags;
  };

  const tags = getTags();

  // 페이지가 로드될 때 유사한 옷 찾기
  useEffect(() => {
    // 유사한 아이템 가져오는 함수
    const fetchSimilarItems = async () => {
      setLoading(true);

      try {
        // 1. localStorage에서 저장된 설명 데이터 가져오기
        const storedItems =
          JSON.parse(localStorage.getItem("clothingItems")) || [];
        const currentItem = storedItems.find(
          (storedItem) => storedItem.id === item.id
        );

        // 설명이 존재하면 description 상태 업데이트
        if (currentItem) {
          setDescription(currentItem.description);
        }

        // 2. 유사한 아이템 데이터를 가져오는 비동기 요청
        const formData = new FormData();

        // 이미지 파일이 직접 서버로 전송되도록 설정
        // fetch를 통해 이미지 파일을 blob으로 가져오는 대신
        // item.image가 파일인 경우 해당 파일을 직접 추가
        if (item.image instanceof File) {
          formData.append("image", item.image, "uploaded_image.jpg");
        } else {
          const response = await fetch(item.image);
          const imageBlob = await response.blob();
          formData.append("image", imageBlob, "uploaded_image.jpg");
        }

        // category 정보도 추가
        formData.append("category", item.category);
        formData.append("subcategory", item.subcategory);

        // 서버로 이미지 전송
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData
        );

        // 서버로부터 유사한 이미지 데이터를 받아서 저장
        setSimilarItems(response.data);
      } catch (error) {
        console.error("Error fetching similar items:", error);
      } finally {
        setLoading(false);
      }
    };

    // 사용자가 만든 코디맵 가져오는 함수
    const fetchUserCodiMapsForItem = () => {
      const savedCodiMaps =
        JSON.parse(localStorage.getItem("savedLookbooks")) || [];
      const relatedCodiMaps = savedCodiMaps.filter(
        (codiMap) => codiMap.items.includes(item.id) // 현재 아이템의 ID가 포함된 코디맵 필터링
      );
      setUserCodiMaps(relatedCodiMaps); // 관련 사용자 코디맵 설정
    };

    // 사용자가 만든 착용샷 가져오는 함수
    const fetchUserVirtualFitItem = () => {
      //virtualFits 키로 만들어진 로컬스토리지 데이터를 가져옴
      const storedVirtualFits =
        JSON.parse(localStorage.getItem("virtualFits")) || {};
      const filteredFits = storedVirtualFits[item.id] || [];
      setUserVirtualFits(filteredFits);
    };

    // 두 작업 실행
    fetchSimilarItems();
    fetchUserCodiMapsForItem(); // 사용자가 만든 코디맵 불러오기
    fetchUserVirtualFitItem();

    console.log("현재 아이템 데이터:", item); // 각 컴포넌트에서 item 데이터 확인
  }, [item]);

  // 비슷한 아이템을 가져오는 함수
  // 선택한 옵션에 따른 유사한 아이템 요청
  const handleOptionSelect = async (clothingType, displayText) => {
    setSelectedOption(displayText); // 선택한 텍스트 표시
    setIsDropdownOpen(false); // 드롭다운 닫기
    setAnotherItemsLoading(true);

    try {
      const formData = new FormData();
      if (item.image instanceof File) {
        formData.append("image", item.image, "uploaded_image.jpg");
      } else {
        const response = await fetch(item.image);
        const imageBlob = await response.blob();
        formData.append("image", imageBlob, "uploaded_image.jpg");
      }
      formData.append("style", item.style);
      formData.append("clothingType", clothingType);

      const response = await axios.post(
        "http://localhost:5000/find_style_img",
        formData
      );
      setAnotherSimilarItems(response.data);
    } catch (error) {
      console.error("Error fetching similar items:", error);
    } finally {
      setAnotherItemsLoading(false);
    }
  };

  const getColorNmae = (colorCode) => {
    const colorMap = {
      "#000000": "black",
      "#FFFFFF": "white",
      "#808080": "grey",
      "#FF007F": "pink",
      "#FF0000": "red",
      "#FFFF00": "yellow",
      "#1DDB16": "green",
      "#0000FF": "blue",
      "#F5F5DC": "beige",
      "#8B4513": "brown",
    };
    return colorMap[colorCode];
  };

  const categoryMap = {
    top: "상의",
    bottom: "하의",
    outerwear: "아우터",
    dress: "원피스",
    shoes: "신발",
    bag: "가방",
    accessory: "액세서리",
  };

  const getAvailableClothingTypes = (style) => {
    switch (style) {
      case "아메카지":
        return [
          { value: "top", label: "상의" },
          { value: "pants", label: "바지" },
        ];
      case "캐주얼":
        return [
          { value: "top", label: "상의" },
          { value: "pants", label: "바지" },
          { value: "outerwear", label: "아우터" },
        ];
      case "로맨틱":
        return [
          { value: "top", label: "상의" },
          { value: "skirts", label: "치마" },
          { value: "outerwear", label: "아우터" },
        ];
      case "스포츠":
        return [{ value: "pants", label: "바지" }];
      case "고프코어":
      case "스트릿":
        return [
          { value: "top", label: "상의" },
          { value: "pants", label: "바지" },
          { value: "skirts", label: "치마" },
          { value: "outerwear", label: "아우터" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="detail-container">
      <header className="detail-banner" onClick={() => navigate("/homepage")}>
        <h1 className="detail-header-title">Otcha!</h1>
      </header>
      {/* <h2>상품 정보</h2> */}
      <div className="detail-box">
        <div className="item-image">
          <img src={item.image} alt="선택된 아이템" className="selected-item" />
        </div>
        <div className="item-info">
          <p>
            <span className="info-name">카테고리</span>{" "}
            <span>{categoryMap[item.category] || item.category}</span>
          </p>
          <p>
            <span className="info-name">서브 카테고리</span>{" "}
            <span>{item.subcategory || "서브 카테고리"}</span>
          </p>
          <p>
            <span className="info-name">태그</span>
            <span className="tags">
              {tags.map((tag, index) => (
                <span key={index} className="tag-box">
                  # {tag}{" "}
                </span>
              ))}
            </span>
          </p>
          <p className="info-color">
            <span className="info-name">색상</span>
            <div className="color-display-container">
              <div
                className="color-circle"
                style={{ backgroundColor: item.color }}
              ></div>
              <span className="color-name">{getColorNmae(item.color)}</span>
            </div>
          </p>
          <p>
            <span className="info-name">계절</span> <span>{item.season}</span>
          </p>
          <p className="info-name">추가 설명</p>
          {/*설명 입력 텍스트 박스*/}
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="이 옷에 대한 설명을 추가할 수 있어요😀"
            rows={5}
            className="description-textbox"
          ></textarea>
          <div className="save-btn-box">
            <button
              onClick={saveDescription}
              disabled={isSaving}
              className="des-save-button"
            >
              {" "}
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      </div>

      {/* 유사한 상품 섹션 */}
      <h2 className="recommend-h2">
        AI가 분석한 결과, 유사한 {item.subcategory}도 추천드려요!{" "}
      </h2>
      <div className="similar-section">
        {loading ? (
          <RecommendedSkeleton />
        ) : (
          <Slider {...settings} className="Slider">
            {similarItems.map((similarItem, index) => (
              <div key={index} className="slider-wrapper">
                <img
                  src={`http://localhost:5000/${similarItem.image_path}`}
                  alt={`similar_${index}`}
                  className="slider-image"
                />
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* 또다른 유사한 상품 섹션 */}
      <div className="another-similar-section">
        <span className="another-similar-styleType">
          AI가 찾아주는 {item.style} 스타일의
        </span>
        <div className="custom-select-wrapper">
          <button onClick={toggleDropdown} className="custom-select">
            {selectedOption}
          </button>

          {/* 드롭다운 */}
          {isDropdownOpen && (
            <ul className="custom-dropdown">
              {getAvailableClothingTypes(item.style)
                .filter((clothingType) => item.category !== clothingType.value) // 기존 조건 유지
                .map((option) => (
                  <li key={option.value} className="custom-option">
                    <button
                      onClick={() =>
                        handleOptionSelect(option.value, option.label)
                      }
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <span id="text">추천</span>

        {anotherItemsLoading ? (
          <RecommendedSkeleton />
        ) : (
          // <RecommendedSkeleton />
          <>
            <Slider
              {...anotherSimilarItemsSettings}
              className="Slider another-Slider"
            >
              {anotherSimilarItems.map((similarItem, index) => (
                <div key={index} className="slider-wrapper">
                  <img
                    src={`http://localhost:5000/${similarItem.image_path}`}
                    alt={`anoter_similar_${index}`}
                    className="slider-image"
                  />
                </div>
              ))}
            </Slider>
          </>
        )}
      </div>

      {/* 탭 UI */}
      <div className="tabs-container">
        <div className="tabs">
          <button
            onClick={() => handleTabChange("codimap")}
            className={activeTab === "codimap" ? "active" : ""}
          >
            나만의 코디맵
          </button>
          <button
            onClick={() => handleTabChange("lookbook")}
            className={activeTab === "lookbook" ? "active" : ""}
          >
            착용샷
          </button>
        </div>

        {/* 코디맵 콘텐츠 */}
        {activeTab === "codimap" && (
          <>
            <span className="codimap-span">
              자신만의 코디맵을 완성해보세요!
            </span>
            <div className="codimap-section">
              <CodiMapGrid userCodiMaps={userCodiMaps} />
            </div>
          </>
        )}

        {/* 룩북 콘텐츠 */}
        {activeTab === "lookbook" && (
          <>
            <span className="codimap-span">
              Stable diffusion으로 착용샷을 확인해봐요!
            </span>
            <div className="lookbook-section">
              <LookBookGrid userVirtualFits={userVirtualFits} item={item} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
