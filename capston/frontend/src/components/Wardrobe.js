import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UploadButton from "./UploadButton";
import "../css/Wardrobe.css";
import Footer from "./Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const navigate = useNavigate();

  // 초기 로드 시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("clothingItems")) || [];
    console.log("Stored items:", storedItems); // 로컬 스토리지에서 불러온 데이터 확인
    setItems(storedItems);
  }, []);

  // items 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("clothingItems", JSON.stringify(items));
    }
  }, [items]);

  // !!!!!!!!!!!!!!!!!!!!!!!!수정!!!!!!!!!!
  // 파일을 Base64 형식으로 변환해서 저장하기
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // !!!!!!!!!!!!!!!!!!!!!!!!수정!!!!!!!!!!
  // 업로드 처리 시 Base64로 변환하여 저장
  const handleUpload = async (files) => {
    const newItems = await Promise.all(
      files.map(async (file) => {
        const base64Image = await fileToBase64(file); // Base64로 변환
        return {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: selectedType,
          image: base64Image, // Base64 이미지 저장
          category: selectedType !== "all" ? selectedType : "all",
        };
      })
    );

    setItems((prevItems) => [...prevItems, ...newItems]);
    setTimeout(() => {
      navigate("/item-detail", { state: { item: newItems[0] } });
    }, 0);
  };

  // Clothing Item에서만 삭제 !!!!!!!!!!!!!!!!!!!!!!!!수정!!!!!!!!!!
  const handleDelete = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    localStorage.setItem("clothingItems", JSON.stringify(updatedItems));
  };

  // 카테고리에 따라 아이템 필터링
  const filteredItems = items.filter((item) =>
    selectedType === "all" ? true : item.category === selectedType
  );

  // 사진 클릭 시 아이템 세부 정보 페이지로 이동
  const handleItemClick = (item) => {
    navigate(`/item-detail/${item.id}`, { state: { item } });
  };

  return (
    <div className="wardorb-container">
      <header className="wardorb-banner">
        <h1 onClick={() => navigate("/homepage")}>Otcha</h1>
        {/* Clothing Item 카테고리 필터 */}
        <div className="category-container ">
          {[
            "all",
            "top",
            "bottom",
            "outerwear",
            "dress",
            "shoes",
            "bag",
            "accessory",
          ].map((category) => (
            <button
              key={category}
              className={`category-button ${
                selectedType === category ? "selected-category" : ""
              }`}
              onClick={() => setSelectedType(category)}
            >
              {category === "all"
                ? "모두"
                : category === "top"
                ? "상의"
                : category === "bottom"
                ? "하의"
                : category === "outerwear"
                ? "아우터"
                : category === "dress"
                ? "원피스/치마"
                : category === "shoes"
                ? "신발"
                : category === "bag"
                ? "가방"
                : "액세서리"}
            </button>
          ))}
        </div>
      </header>

      {/* 아이템 목록 */}
      <div className="item-container">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="item-div"
            onClick={() => handleItemClick(item)}
          >
            <img
              src={item.image}
              alt="Clothing Item"
              className="item-div-image"
            />
            <button
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        ))}
      </div>

      {/* 업로드 버튼 */}
      <div className="upload-button-container-fixed">
        <UploadButton onUpload={handleUpload} />
      </div>

      {/* 공통 Footer 추가 */}
      <Footer currentSection="homepage" />
    </div>
  );
};

export default Wardrobe;
