import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { saveAs } from "file-saver";
import "../css/VirtualFit.css";

import Footer from "./Footer"; /////////추가/////////////////////////

function VirtualFit() {
  // 아이템 받아오기
  const location = useLocation();
  const { style, color, category, subcategory, id } = location.state || {};

  console.log(style, color, category, subcategory);

  const getColorName = (colorCode) => {
    const colorMap = {
      "#000000": "검정색",
      "#FFFFFF": "흰색",
      "#808080": "회색",
      "#FF007F": "핑크색",
      "#FF0000": "빨간색",
      "#FFFF00": "노란색",
      "#1DDB16": "초록색",
      "#0000FF": "파란색",
      "#F5F5DC": "베이지",
      "#8B4513": "브라운",
    };
    return [colorMap[colorCode]] || [];
  };

  const [selectedOption, setSelectedOption] = useState("");
  const [imageUrls, setImageUrls] = useState([]); // 생성된 이미지 URL 저장
  const [currentImageSet, setCurrentImageSet] = useState(0); // 현재 표시할 이미지 세트 (0: 첫 2장, 1: 마지막 2장)
  const [savedImages, setSavedImages] = useState([]); // 저장된 이미지 URL을 저장
  const [isEditing, setIsEditing] = useState(false); // 편집 모드 관리
  const [selectedForDelete, setSelectedForDelete] = useState([]); // 삭제할 이미지 관리

  ///////////////////////////////////////////추가////////////////////////////////////////////
  const [isCollapsed, setIsCollapsed] = useState(true); //사이드바 접기 상태

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setIsCollapsed(false); // 옵션 선택 시 하위 사이드바 열기
  };
  /////////////////////////////////////////////////////////////////////////////////////////

  // 선택된 키워드 상태
  const [selectedKeywords, setSelectedKeywords] = useState({
    gender: "남성", // 디폴트 남성
    style: style || "",
    color: getColorName(color) || "",
    clothing: [],
  });

  console.log(selectedKeywords.clothing);

  // 모든 선택된 키워드를 초기화하는 함수
  const handleClearKeywords = () => {
    setSelectedKeywords({
      gender: "",
      style: "",
      color: [],
      clothing: [],
    });
  };

  useEffect(() => {
    if (subcategory) {
      setSelectedKeywords((prev) => ({
        ...prev,
        clothing: [{ clothing: subcategory, color: getColorName(color)[0] }],
      }));
    }
  }, [subcategory, color]);

  // 성별, 스타일, 색상, 카테고리 키워드 정의
  const styles = [
    { kr: "아메카지", en: "Ame-Kaji", type: "style" },
    { kr: "캐주얼", en: "Casual", type: "style" },
    { kr: "고프코어", en: "Gorp Core", type: "style" },
    { kr: "스트릿", en: "Street", type: "style" },
    { kr: "로맨틱", en: "Romantic", type: "style" },
    { kr: "스포츠", en: "Sport", type: "style" },
  ];

  const colors = [
    { kr: "검정색", en: "Black", type: "color" },
    { kr: "흰색", en: "White", type: "color" },
    { kr: "회색", en: "Gray", type: "color" },
    { kr: "핑크색", en: "Pink", type: "color" },
    { kr: "빨간색", en: "Red", type: "color" },
    { kr: "노란색", en: "Yellow", type: "color" },
    { kr: "초록색", en: "Green", type: "color" },
    { kr: "파란색", en: "Blue", type: "color" },
    { kr: "베이지", en: "Beige", type: "color" }, ////////////////////////////////영어부분 중복 수정
    { kr: "브라운", en: "Brown", type: "color" }, ////////////////////////////////영어부분 중복 수정
  ];

  const clothingTypes = {
    상의: [
      { kr: "반팔티", en: "T-shirt", type: "clothing" },
      { kr: "후드티", en: "Hoodie", type: "clothing" },
      { kr: "맨투맨/니트", en: "Sweater", type: "clothing" },
      { kr: "셔츠/블라우스", en: "Shirt/Blouse", type: "clothing" },
    ],
    하의: [
      { kr: "데님 팬츠", en: "Denim Pants", type: "clothing" },
      { kr: "트레이닝 팬츠", en: "Training Pants", type: "clothing" },
      { kr: "슬랙스", en: "Slacks", type: "clothing" },
    ],
    아우터: [
      { kr: "가디건", en: "Cardigan", type: "clothing" },
      { kr: "패딩", en: "Padding", type: "clothing" },
      { kr: "후드집업", en: "Hooded Zip-up", type: "clothing" },
    ],
    원피스: [
      { kr: "원피스", en: "Dress", type: "clothing" },
      { kr: "미니 스커트", en: "Mini Skirt", type: "clothing" },
      { kr: "롱스커트", en: "Long Skirt", type: "clothing" },
    ],
    신발: [
      { kr: "운동화", en: "Sneakers", type: "clothing" },
      { kr: "워커/부츠", en: "Boots", type: "clothing" },
      { kr: "샌들/슬리퍼", en: "Sandals/Slippers", type: "clothing" },
      { kr: "구두", en: "Dress Shoes", type: "clothing" },
    ],
    가방: [
      { kr: "크로스백", en: "Crossbody Bag", type: "clothing" },
      { kr: "백팩", en: "Backpack", type: "clothing" },
      { kr: "토트백", en: "Tote Bag", type: "clothing" },
    ],
  };

  const genderOptions = [
    { kr: "남성", en: "Male", type: "gender" },
    { kr: "여성", en: "Female", type: "gender" },
  ];

  const renderSubOptions = () => {
    let options = [];
    switch (selectedOption) {
      case "gender":
        options = genderOptions;
        break;
      case "style":
        options = styles;
        break;
      case "color":
        options = colors;
        break;
      case "clothing":
        options = Object.entries(clothingTypes); // clothingTypes에서 카테고리 가져오기
        break;
      default:
        return null;
    }
    ////////////////////////////////ul,li class로 변경///////////////////////////////////////////
    if (selectedOption === "clothing") {
      return (
        <div>
          {options.map(([category, items]) => (
            <div key={category}>
              <h4 classname="h4">{category}</h4>
              <ul className="ul">
                {items.map((item) => (
                  <li
                    key={item.en}
                    onClick={() => handleKeywordClick(item, category)}
                    className="li"
                  >
                    {item.kr}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <ul className="ul">
          {options.map((item) => (
            <li
              key={item.en}
              onClick={() => handleKeywordClick(item)}
              className="li"
            >
              {item.kr}
            </li>
          ))}
        </ul>
      );
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////

  const handleKeywordClick = (keyword, category) => {
    console.log("Item:", keyword.kr, "Category:", category); // category 값 확인용 log

    setSelectedKeywords((prev) => {
      if (keyword.type === "clothing") {
        const clothingArray = Array.isArray(prev.clothing) ? prev.clothing : [];

        if (clothingArray.some((item) => item.clothing === keyword.kr)) {
          return {
            ...prev,
            clothing: clothingArray.filter(
              (item) => item.clothing !== keyword.kr
            ),
          };
        } else {
          const color =
            prev.color.length > 0 ? prev.color[prev.color.length - 1] : "";
          return {
            ...prev,
            color: [], // 옷이 선택되면 색상 배열을 초기화
            clothing: [
              ...clothingArray,
              { color, clothing: keyword.kr, type: category },
            ],
          };
        }
      } else if (keyword.type === "color") {
        return {
          ...prev,
          color: [...prev.color, keyword.kr],
        };
      } else {
        return {
          ...prev,
          [keyword.type]: prev[keyword.type] === keyword.kr ? "" : keyword.kr,
        };
      }
    });
  };

  const handleGenerateImage = async () => {
    try {
      // 성별 변환
      const genderEn = selectedKeywords.gender
        ? genderOptions.find((option) => option.kr === selectedKeywords.gender)
            ?.en || ""
        : "";

      const styleEn = selectedKeywords.style
        ? styles.find((option) => option.kr === selectedKeywords.style)?.en ||
          ""
        : "";

      const colorsEn =
        Array.isArray(selectedKeywords.color) &&
        selectedKeywords.color.length > 0
          ? selectedKeywords.color.map(
              (color) => colors.find((option) => option.kr === color)?.en || ""
            )
          : [];

      const clothingEn =
        Array.isArray(selectedKeywords.clothing) &&
        selectedKeywords.clothing.length > 0
          ? selectedKeywords.clothing.map((item) => ({
              color: item.color
                ? colors.find((option) => option.kr === item.color)?.en || ""
                : "",
              clothing: item.clothing
                ? Object.values(clothingTypes)
                    .flat()
                    .find((option) => option.kr === item.clothing)?.en || ""
                : "",
            }))
          : [];

      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: genderEn,
          style: styleEn,
          colors: colorsEn,
          clothing_items: clothingEn.map(
            (item) => `${item.color} ${item.clothing}`
          ),
        }),
      });

      if (!response.ok) {
        throw new Error("이미지 생성에 실패했습니다. 다시 시도해 주세요.");
      }

      const data = await response.json();
      setImageUrls(data.image_urls); // 이미지 URL을 상태로 저장
    } catch (error) {
      alert(error.message); // 경고 문구 표시
    }
  };

  // 이미지 2장씩 표시하기 위한 함수
  const renderImages = () => {
    const imagesToShow = imageUrls.slice(
      currentImageSet * 2,
      currentImageSet * 2 + 2
    ); // 2장씩 자르기
    return (
      <div className="image-container">
        {imagesToShow.map((url, index) => (
          <img key={index} src={url} alt={`Generated ${index}`} />
        ))}
      </div>
    );
  };

  //이미지 이동
  const handleNextImages = () => {
    if (currentImageSet < 1) {
      setCurrentImageSet(currentImageSet + 1);
    }
  };

  const handlePrevImages = () => {
    if (currentImageSet > 0) {
      setCurrentImageSet(currentImageSet - 1);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////추가한 함수들///////////////////////////////////////////////////////////////////////////////////
  const handleSaveImages = () => {
    // 중복된 이미지를 제외한 새로운 이미지 추가
    setSavedImages((prev) => {
      const newImages = imageUrls.filter((url) => !prev.includes(url)); // 중복된 이미지 제거
      return [...prev, ...newImages];
    });

    //!!!!!!!!!!!!!!!!!!!!!!!!!! 구혜연 수정 !!!!!!!!!!!!!!!!!!!!!!!
    const storedVirtualFits =
      JSON.parse(localStorage.getItem("virtualFits")) || {};

    const newVirtualFit = {
      image: imageUrls,
      itemId: id,
      color: color,
      style: style,
      category: category,
      subcategory: subcategory,
    };

    if (!storedVirtualFits[id]) {
      storedVirtualFits[id] = [];
    }

    storedVirtualFits[id].push(newVirtualFit);

    localStorage.setItem("virtualFits", JSON.stringify(storedVirtualFits));

    // 저장된 이미지 로컬에 다운로드로 저장
    imageUrls.forEach((url, index) => {
      const link = document.createElement("a");
      link.href = url;
      link.download = `generated_image_${index + 1}.png`; // 각 이미지를 다른 이름으로 저장
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // 섬네일 형식으로 사진 저장
  const renderSavedImages = () => {
    return (
      <div className="saved-images-container">
        {savedImages.map((url, index) => (
          <div key={index} className="thumbnail-wrapper">
            {isEditing && (
              <input
                type="checkbox"
                checked={selectedForDelete.includes(url)}
                onChange={() => handleImageSelect(url)}
                className="image-checkbox"
              />
            )}
            <img src={url} alt={`Saved ${index}`} className="thumbnail-image" />
          </div>
        ))}
      </div>
    );
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing); // 편집 모드 토글
    setSelectedForDelete([]); // 편집 모드 변경 시 선택된 이미지 초기화
  };

  const deleteSelectedImages = () => {
    setSavedImages((prev) =>
      prev.filter((url) => !selectedForDelete.includes(url))
    ); // 선택된 이미지를 제외한 나머지 저장
    setIsEditing(false); // 편집 모드 종료
  };

  const handleImageSelect = (url) => {
    if (selectedForDelete.includes(url)) {
      setSelectedForDelete(
        selectedForDelete.filter((selected) => selected !== url)
      ); // 선택 취소
    } else {
      setSelectedForDelete([...selectedForDelete, url]); // 선택 추가
    }
  };
  const navigate = useNavigate();

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => navigate("/homepage")}> Otcha </h1>
      </header>

      <div className="sidebar-container">
        <div className="sidebar">
          <h3
            id="h3"
            onClick={() => handleOptionSelect("style")}
            className={selectedOption === "style" ? "selected-option" : ""}
          >
            스타일
          </h3>
          <h3
            id="h3"
            onClick={() => handleOptionSelect("color")}
            className={selectedOption === "color" ? "selected-option" : ""}
          >
            색상
          </h3>
          <h3
            id="h3"
            onClick={() => handleOptionSelect("clothing")}
            className={selectedOption === "clothing" ? "selected-option" : ""}
          >
            카테고리
          </h3>
          <h3
            id="h3"
            onClick={() => handleOptionSelect("gender")}
            className={selectedOption === "gender" ? "selected-option" : ""}
          >
            성별
          </h3>
        </div>

        {/*////////////////////////////////수정///////////////////////////////////////// */}
        <div className={`sub-sidebar ${isCollapsed ? "collapsed" : ""}`}>
          <h2 id="h2">
            {selectedOption === "gender"
              ? "성별"
              : selectedOption === "style"
              ? "스타일"
              : selectedOption === "color"
              ? "색상"
              : selectedOption === "clothing"
              ? "카테고리"
              : " "}
          </h2>
          {renderSubOptions()}
          {/*////////////////////////////////서브 옵션 접기 버튼 추가///////////////////////////////////////// */}
          <button className="collapse-button" onClick={toggleSidebar}>
            {/* {isCollapsed ? "" : "<"} */}
            <img
              src="/arrow.png"
              alt="toggle arrow"
              className={
                isCollapsed ? "arrow-icon-collapsed" : "arrow-icon-expanded"
              }
            />
          </button>
        </div>
      </div>
      <main
        id="main"
        className={isCollapsed ? "main-collapsed" : "main-expanded"}
      >
        {/* 프롬프트 부분 */}
        <div className="prompt-container">
          <p>
            <span className="underlined">{selectedKeywords.style}</span>{" "}
            스타일의{" "}
            {Array.isArray(selectedKeywords.clothing) &&
            selectedKeywords.clothing.length > 0
              ? selectedKeywords.clothing
                  .filter((item) => item.color && item.clothing) // color와 clothing이 모두 있는 경우만 출력
                  .map((item) => (
                    <span key={item.clothing} className="underlined">
                      {item.color} {item.clothing}
                    </span>
                  ))
                  .reduce((prev, curr) => [prev, ", ", curr], [])
              : ""}
            {selectedKeywords.clothing.length > 0 ? "을/를 입은 " : ""}
            <span className="underlined">{selectedKeywords.gender}</span>을/를
            그려줘
          </p>
        </div>
        <button className="button" onClick={handleGenerateImage}>
          이미지 생성
        </button>
        <button className="button" onClick={handleClearKeywords}>
          지우기
        </button>
        {/* 이미지 부분 */}
        <div>
          {renderImages()}
          <div className="navigation-buttons">
            <button
              onClick={handlePrevImages}
              disabled={currentImageSet === 0}
              className="arrow-button"
            >
              &#10094; {/* 왼쪽 화살표 */}
            </button>
            {/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!저장 버튼 수정!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!*/}
            <button onClick={handleSaveImages} className="button">
              저장
            </button>
            <button
              onClick={handleNextImages}
              disabled={currentImageSet === 1}
              className="arrow-button"
            >
              &#10095; {/* 오른쪽 화살표 */}
            </button>
          </div>
        </div>

        {/* 저장된 이미지 */}
        <hr />
        <div>
          <button onClick={toggleEditMode} className="edit-button">
            {isEditing ? "편집 완료" : "편집"}
          </button>
          {isEditing && (
            <button
              onClick={deleteSelectedImages}
              className="delete-button"
              disabled={selectedForDelete.length === 0}
            >
              삭제
            </button>
          )}
        </div>

        {renderSavedImages()}
      </main>
      {/*lookbook이 아니라 virtualFit 수정*/}
      <Footer currentSection="virtualFit" />
    </div>
  );
}

export default VirtualFit;
