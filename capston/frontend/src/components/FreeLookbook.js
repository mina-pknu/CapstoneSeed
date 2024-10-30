import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas"; // html2canvas 추가
import "../css/FreeLookbook.css";
import Footer from "./Footer";

const FreeLookbook = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("모두"); // 선택된 카테고리 상태
  const [items, setItems] = useState([]); // Clothing Item에서 가져온 아이템
  const [canvasImages, setCanvasImages] = useState([]); // Canvas에 올릴 이미지들
  const canvasRef = useRef(null);
  const apiKey = "DJhbuY4LtDJ5FXjPRLLck257"; // remove.bg API 키

  // 카테고리 영어 -> 한글 매핑 테이블
  const categoryMap = {
    all: "모두",
    top: "상의",
    bottom: "하의",
    outerwear: "아우터",
    dress: "원피스/치마",
    shoes: "신발",
    bag: "가방",
    accessory: "액세서리",
  };

  // 초기 로드 시 로컬 스토리지에서 데이터 불러오기 (Clothing Item에서 업로드된 데이터)
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("clothingItems")) || [];
    console.log(storedItems); // 저장된 아이템 확인
    setItems(storedItems);
  }, []);

  // 카테고리에 맞는 이미지 필터링
  const filteredItems = items.filter((item) => {
    const itemCategoryInKorean = categoryMap[item.category];
    return selectedCategory === "모두"
      ? true
      : itemCategoryInKorean === selectedCategory;
  });

  // 카테고리 변경 함수
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // 이미지 클릭 시 배경 제거 후 canvas에 추가
  const handleImageClick = async (item) => {
    try {
      const formData = new FormData();
      const response = await fetch(item.image); // 로컬 이미지를 불러오는 fetch 요청
      const blob = await response.blob(); // 이미지 파일을 blob으로 변환
      formData.append("image_file", blob);
      formData.append("size", "auto");

      const removeBgResponse = await fetch(
        "https://api.remove.bg/v1.0/removebg",
        {
          method: "POST",
          headers: {
            "X-Api-Key": apiKey,
          },
          body: formData,
        }
      );

      if (!removeBgResponse.ok) throw new Error("Failed to remove background");

      const removeBgBlob = await removeBgResponse.blob();
      const imgURL = URL.createObjectURL(removeBgBlob);

      const canvasContainer = canvasRef.current;
      const canvasRect = canvasContainer.getBoundingClientRect();

      const imageWidth = 200;
      const imageHeight = 200;

      const initialX = (canvasRect.width - imageWidth) / 2;
      const initialY = (canvasRect.height - imageHeight) / 2;

      setCanvasImages((prevImages) => [
        ...prevImages,
        {
          src: imgURL,
          x: initialX,
          y: initialY,
          width: imageWidth,
          height: imageHeight,
          rotation: 0,
        }, // 초기값 설정
      ]);
    } catch (error) {
      console.error("Error removing background:", error);
    }
  };

  // 이미지 삭제 핸들러
  const handleDeleteImage = (index) => {
    setCanvasImages((prevImages) =>
      prevImages.filter((_, idx) => idx !== index)
    );
  };

  // 이미지 드래그 앤 드롭 및 회전, 크기 조절 핸들러 추가
  const handleMouseDown = (index, e) => {
    const canvasContainer = canvasRef.current;
    const canvasRect = canvasContainer.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = canvasImages[index].x;
    const initialY = canvasImages[index].y;
    let initialWidth = canvasImages[index].width || 200; // 초기 이미지 크기
    let initialHeight = canvasImages[index].height || 200; // 초기 이미지 높이
    let initialRotation = canvasImages[index].rotation || 0; // 초기 회전값 (기본값 0)

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (e.target.className === "resize-rotate-handle") {
        // 크기 조절 및 회전 핸들러: X축 드래그로 크기 조절, Y축 드래그로 회전
        const newWidth = initialWidth + deltaX; // 가로 크기 변경
        const newHeight = initialHeight + deltaX; // 세로 크기 변경 (비율 유지)
        const newRotation = initialRotation + deltaY * 0.1; // 마우스 이동에 따른 회전값 조절 (0.1로 회전 속도 조절)

        setCanvasImages((prevImages) =>
          prevImages.map((image, idx) =>
            idx === index
              ? {
                  ...image,
                  width: newWidth,
                  height: newHeight,
                  rotation: newRotation,
                }
              : image
          )
        );
      } else {
        // 기본 드래그 앤 드롭
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

        // 드래그 가능한 범위를 캔버스 내부로 제한
        const maxX = canvasRect.width - initialWidth;
        const maxY = canvasRect.height - initialHeight;

        setCanvasImages((prevImages) =>
          prevImages.map((image, idx) =>
            idx === index
              ? {
                  ...image,
                  x: Math.min(Math.max(0, newX), maxX),
                  y: Math.min(Math.max(0, newY), maxY),
                }
              : image
          )
        );
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // canvas를 이미지로 저장하는 함수
  const handleSaveCanvas = () => {
    html2canvas(canvasRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "free-lookbook.png";
      link.click();
    });
  };

  return (
    <div>
      <header className="banner">
        <h1 onClick={() => navigate("/homepage")}>Otcha </h1>
      </header>

      {/* <header className="title">
        <h2>Free Lookbook</h2>
      </header> */}
      <div className="freeLookBook-container">
        {/* 캔버스 영역 */}
        <div ref={canvasRef} className="canvas-container">
          {canvasImages.map((image, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${image.x}px`,
                top: `${image.y}px`,
              }}
            >
              <img
                src={image.src}
                alt={`Canvas Item ${index + 1}`}
                style={{
                  width: `${image.width}px`,
                  height: `${image.height}px`,
                  transform: `rotate(${image.rotation}deg)`,
                  cursor: "move",
                  position: "relative",
                }}
                onMouseDown={(e) => handleMouseDown(index, e)}
              />
              {/* 삭제 버튼 */}
              <div
                className="free-delete-button"
                onClick={() => handleDeleteImage(index)}
              >
                ✕ {/* 흰색 X 아이콘 */}
              </div>
              {/* 크기 및 회전 핸들러 */}
              <div
                className="resize-rotate-handle"
                onMouseDown={(e) => handleMouseDown(index, e)}
              >
                ↻ {/* 아이콘 추가 */}
              </div>
            </div>
          ))}

          <div className="save-button-container">
            <button className="save-button" onClick={handleSaveCanvas}>
              저장
            </button>
          </div>
        </div>

        <div className="category-item-selecton-container">
          {/* 카테고리 섹션 */}
          <div className="category-container">
            {[
              "모두",
              "상의",
              "하의",
              "아우터",
              "원피스/치마",
              "신발",
              "가방",
              "액세서리",
            ].map((category, index) => (
              <button
                key={index}
                className={`category-button ${
                  selectedCategory === category ? "selected-category" : ""
                }`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* 선택된 카테고리에 따른 이미지 표시 */}
          <div className="item-selection-container">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="item"
                onClick={() => handleImageClick(item)}
              >
                <img
                  src={item.image}
                  alt={`Item ${index + 1}`}
                  className="item-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* 공통 Footer 추가 */}
      <Footer currentSection="lookbook" />
    </div>
  );
};

export default FreeLookbook;
