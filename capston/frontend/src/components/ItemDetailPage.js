import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/ItemDetailPage.css";

const ItemDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { item, section } = location.state || {};

  const [category, setCategory] = useState(item?.category || "");
  const [subcategory, setSubcategory] = useState(""); // 서브 카테고리도 필수

  const [style, setStyle] = useState(""); // 선택된 스타일 저장

  const [season, setSeason] = useState("spring");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // 선택된 색상 저장

  const handleSave = () => {
    // 필수 항목이 비어있으면 경고 메시지 표시
    if (!category || !subcategory || !style || !season || !selectedColor) {
      alert("정보를 모두 입력해 주세요.");
      return;
    }

    const updatedItem = {
      ...item,
      category,
      subcategory,
      style,
      season,
      description,
      color: selectedColor, // 선택된 색상 추가
    };

    const storedItems = JSON.parse(localStorage.getItem("clothingItems")) || [];
    const updatedItems = storedItems.map((storedItem) =>
      storedItem.id === updatedItem.id ? updatedItem : storedItem
    );
    localStorage.setItem("clothingItems", JSON.stringify(updatedItems));

    navigate(`/item-detail/${updatedItem.id}`, {
      state: { item: updatedItem, section },
    });
  };

  const subcategories = {
    top: ["반팔티", "후드티", "맨투맨/니트", "셔츠/블라우스", "기타"],
    bottom: ["데님 팬츠", "트레이닝 팬츠", "슬랙스", "기타"],
    outerwear: ["가디건", "패딩", "후드집업", "기타"],
    dress: ["원피스", "미니 스커트", "롱스커트", "기타"],
    shoes: ["운동화", "워커/부츠", "샌들/슬리퍼", "구두", "기타"],
    bag: ["백팩", "숄더백", "크로스백", "기타"],
    accessory: ["모자", "선글라스", "기타"],
  };

  const styles = [
    "아메카지",
    "캐주얼",
    "고프코어",
    "스트릿",
    "로맨틱",
    "스포츠",
  ];

  const seasons = ["봄", "여름", "가을", "겨울"]; // 계절 선택

  const renderSubcategoryBubbles = () => {
    if (!category) return null;

    return (
      <div className="bubble-container">
        {subcategories[category]?.map((subcat) => (
          <div
            key={subcat}
            className={`bubble ${subcategory === subcat ? "selected" : ""}`}
            onClick={() => setSubcategory(subcat)}
          >
            {subcat}
          </div>
        ))}
      </div>
    );
  };

  const renderStyleBubbles = () => {
    return (
      <div className="bubble-container">
        {styles.map((styleOption) => (
          <div
            key={styleOption}
            className={`bubble ${style === styleOption ? "selected" : ""}`}
            onClick={() => setStyle(styleOption)}
          >
            {styleOption}
          </div>
        ))}
      </div>
    );
  };

  const renderSeasonBubbles = () => {
    return (
      <div className="bubble-container">
        {seasons.map((seasonOption) => (
          <div
            key={seasonOption}
            className={`bubble ${season === seasonOption ? "selected" : ""}`}
            onClick={() => setSeason(seasonOption)}
          >
            {seasonOption}
          </div>
        ))}
      </div>
    );
  };

  const colors = [
    "#000000", // black
    "#FFFFFF", // white
    "#808080", // grey
    "#FF007F", // pink
    "#FF0000", // red
    "#FFFF00", // yellow
    "#1DDB16", // green
    "#0000FF", // blue
    "#F5F5DC", // beige
    "#8B4513", // brown
  ];

  return (
    <div className="item-detail-container">
      <h2>상세 정보 입력</h2>
      <img src={item?.image} alt="Uploaded Item" />

      <div>
        <label>카테고리</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">선택하세요</option>
          <option value="top">상의</option>
          <option value="bottom">하의</option>
          <option value="outerwear">아우터</option>
          <option value="dress">원피스/치마</option>
          <option value="shoes">신발</option>
          <option value="bag">가방</option>
          <option value="accessory">액세서리</option>
        </select>
      </div>

      {/* 서브 카테고리 선택 */}
      <div className="subcategory-container">{renderSubcategoryBubbles()}</div>

      <div>
        <label>스타일</label>
        <div className="style-bubbles-container">{renderStyleBubbles()}</div>
      </div>

      {/* 계절 선택 */}
      <div>
        <label>계절</label>
        <div className="season-bubbles-container">{renderSeasonBubbles()}</div>
      </div>

      {/* 색상 선택 */}
      <div>
        <label>색상</label>
        <div className="color-palette">
          {colors.map((color) => (
            <div
              key={color}
              className={`color-circle ${
                selectedColor === color ? "selected" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
        </div>
      </div>

      <div>
        <label>설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button onClick={handleSave}>저장</button>
    </div>
  );
};

export default ItemDetailPage;
