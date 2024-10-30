import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas"; // html2canvas 추가
import "../css/Lookbook.css";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";
// import "../css/Wardrobe.css";

const LookBook = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("모두");
  const [items, setItems] = useState([]);
  const [canvasImages, setCanvasImages] = useState([]);
  const [gridItems, setGridItems] = useState([]);
  const [savedLookbooks, setSavedLookbooks] = useState([]); // 저장된 룩북들
  const [selectedMode, setSelectedMode] = useState("grid"); // 기본값을 Grid로 설정
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false); // 새로운 모달 상태
  const [selectedLookbook, setSelectedLookbook] = useState(null); // 선택된 룩북
  const [styleName, setStyleName] = useState(""); // 스타일명
  const [situation, setSituation] = useState(""); // 상황
  const [errorMessage, setErrorMessage] = useState(""); // 필수 입력 오류 메시지
  const canvasRef = useRef(null);
  const apiKey = "KG33YtWX4qL8pMrpSdU5kSff"; // remove.bg API key

  // Category mapping table
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

  // Load items from localStorage
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("clothingItems")) || [];
    setItems(storedItems);

    const storedGridItems = JSON.parse(localStorage.getItem("gridItems")) || [];
    setGridItems(storedGridItems);

    const storedLookbooks =
      JSON.parse(localStorage.getItem("savedLookbooks")) || [];
    setSavedLookbooks(storedLookbooks);
  }, []);

  // Store grid items in localStorage
  useEffect(() => {
    localStorage.setItem("gridItems", JSON.stringify(gridItems));
  }, [gridItems]);

  const filteredItems = items.filter((item) => {
    const itemCategoryInKorean = categoryMap[item.category];
    return selectedCategory === "모두"
      ? true
      : itemCategoryInKorean === selectedCategory;
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleImageClickFree = async (item) => {
    try {
      const formData = new FormData();
      const response = await fetch(item.image);
      const blob = await response.blob();
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
        },
      ]);
    } catch (error) {
      console.error("Error removing background:", error);
    }
  };

  const handleImageClickGrid = (item) => {
    if (gridItems.length >= 4) {
      alert("이미지는 최대 4개까지만 업로드할 수 있습니다.");
      return;
    }
    setGridItems((prevItems) => [...prevItems, item]);
  };

  const handleDeleteGridItem = (id) => {
    setGridItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleDeleteImage = (index) => {
    setCanvasImages((prevImages) =>
      prevImages.filter((_, idx) => idx !== index)
    );
  };

  const handleMouseDown = (index, e) => {
    const canvasContainer = canvasRef.current;
    const canvasRect = canvasContainer.getBoundingClientRect();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = canvasImages[index].x;
    const initialY = canvasImages[index].y;
    let initialWidth = canvasImages[index].width || 200;
    let initialHeight = canvasImages[index].height || 200;
    let initialRotation = canvasImages[index].rotation || 0;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      if (e.target.className === "resize-rotate-handle") {
        const newWidth = initialWidth + deltaX;
        const newHeight = initialHeight + deltaX;
        const newRotation = initialRotation + deltaY * 0.1;

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
        const newX = initialX + deltaX;
        const newY = initialY + deltaY;

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

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setStyleName("");
    setSituation("");
    setErrorMessage("");
  };

  // 룩북 삭제 함수 추가
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!로컬 스토리지에 삭제 추가 !!!!!!!!!!!!!!!!
  const deleteLookbook = (lookbook) => {
    const updatedLookbooks = savedLookbooks.filter((lb) => lb !== lookbook);
    setSavedLookbooks(updatedLookbooks);
    localStorage.setItem("savedLookbooks", JSON.stringify(updatedLookbooks));
    setIsLookbookModalOpen(false); // 모달 닫기
  };

  const situationIcons = {
    업무: "💼",
    일상: "🌞",
    모임: "👥",
    약속: "🗓️",
    휴식: "🔋",
    운동: "🏋️",
    여행: "✈️",
    집: "🏠",
    기타: "⋯",
  };

  // 룩북 클릭 시 모달 열기 (새로운 모달)
  const openLookbookModal = (lookbook) => {
    setSelectedLookbook(lookbook);
    setIsLookbookModalOpen(true); // 모달 열기
  };

  // 새로운 모달 닫기
  const closeLookbookModal = () => {
    setIsLookbookModalOpen(false);
  };

  // 저장 버튼 클릭 시 룩북 저장
  const saveLookbook = () => {
    // 필수 입력 체크
    if (!styleName || !situation) {
      setErrorMessage("스타일명과 상황을 모두 입력해 주세요.");
      return;
    }

    html2canvas(canvasRef.current).then((canvas) => {
      const imgURL = canvas.toDataURL("image/png");
      const newLookbook = {
        styleName,
        situation,
        image: imgURL,
        items: gridItems.map((item) => item.id), // 코디맵에 사용된 아이템 ID 저장
      };

      const updatedLookbooks = [...savedLookbooks, newLookbook];

      setSavedLookbooks(updatedLookbooks);

      localStorage.setItem("savedLookbooks", JSON.stringify(updatedLookbooks));
      closeModal();
    });
  };

  return (
    <div>
      <header className="lookbook-banner">
        <h1 onClick={() => navigate("/homepage")}>Otcha </h1>
      </header>

      {/* Grid/Free mode switch */}
      <div className="mode-switch-container">
        <button
          className={`mode-button ${selectedMode === "grid" ? "selected" : ""}`}
          onClick={() => setSelectedMode("grid")}
        >
          Grid
        </button>
        <button
          className={`mode-button ${selectedMode === "free" ? "selected" : ""}`}
          onClick={() => setSelectedMode("free")}
        >
          Free
        </button>
      </div>

      <div className="freeLookBook-container">
        {/* Canvas section */}
        <div ref={canvasRef} className="canvas-container">
          {selectedMode === "free" ? (
            canvasImages.map((image, index) => (
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
                <div
                  className="free-delete-button"
                  onClick={() => handleDeleteImage(index)}
                >
                  ✕
                </div>
                <div
                  className="resize-rotate-handle"
                  onMouseDown={(e) => handleMouseDown(index, e)}
                >
                  ↻
                </div>
              </div>
            ))
          ) : (
            // Grid 모드에서도 동일한 캔버스를 사용하여 그리드로 아이템 배치
            <div className="grid-container" style={{ border: "none" }}>
              {gridItems.map((item, index) => (
                <div
                  key={`${item.id}_${index}`}
                  style={{
                    position: "absolute",
                    left: `${index % 2 === 0 ? 50 : 250}px`,
                    top: `${Math.floor(index / 2) * 200 + 30}px`,
                    width: "200px",
                    height: "200px",
                  }}
                >
                  <img
                    src={item.image}
                    alt={`Grid Item ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteGridItem(item.id)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="save-button-container">
            <button className="save-button" onClick={openModal}>
              저장
            </button>
          </div>
        </div>

        <div className="category-item-selecton-container">
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

          <div className="item-selection-container">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="item"
                onClick={() =>
                  selectedMode === "grid"
                    ? handleImageClickGrid(item)
                    : handleImageClickFree(item)
                }
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

        {/* 모달 창 */}
        {isModalOpen && (
          <div className="lookbook-save-modal">
            <div className="lookbook-save-modal-content">
              <h3>스타일 저장</h3>
              {errorMessage && (
                <p className="error-message"> ⚠️ {errorMessage}</p>
              )}
              <label>스타일명</label>
              <input
                type="text"
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                placeholder="스타일명을 입력하세요"
              />
              {/* 상황 선택 */}
              <label>상황</label>
              <div className="situation-bubbles">
                {[
                  { label: "업무", icon: "💼" },
                  { label: "일상", icon: "🌞" },
                  { label: "모임", icon: "👥" },
                  { label: "약속", icon: "🗓️" },
                  { label: "휴식", icon: "🔋" },
                  { label: "운동", icon: "🏋️" },
                  { label: "여행", icon: "✈️" },
                  { label: "집", icon: "🏠" },
                  { label: "기타", icon: "⋯" },
                ].map((option, index) => (
                  <button
                    key={index}
                    className={`situation-bubble ${
                      situation === option.label ? "selected" : ""
                    }`}
                    onClick={() => setSituation(option.label)}
                  >
                    <span className="situation-icon">{option.icon}</span>{" "}
                    {/* 아이콘 부분 */}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>

              <div className="lookbook-save-modal-buttons">
                <button
                  className="lookbook-save-modal-button"
                  onClick={saveLookbook}
                >
                  저장
                </button>
                <button
                  className="lookbook-close-modal-button"
                  onClick={closeModal}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 새로운 모달 창 */}
      {isLookbookModalOpen && selectedLookbook && (
        <div className="lookbook-view-modal">
          <div className="lookbook-view-modal-content">
            <img
              src={selectedLookbook.image}
              alt="Selected Lookbook"
              className="lookbook-view-modal-main-image"
            />
            <div className="lookbook-view-modal-details">
              <h3>{selectedLookbook.styleName}</h3>
              <h3>
                {situationIcons[selectedLookbook.situation]}
                {selectedLookbook.situation}
              </h3>
            </div>

            <div className="lookbook-modal-buttons">
              <button
                className="lookbook-delete-button"
                onClick={() => deleteLookbook(selectedLookbook)}
              >
                룩북 삭제
              </button>
              <button
                className="lookbook-close-modal-button"
                onClick={closeLookbookModal}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="saved-lookbooks-container">
        {savedLookbooks.map((lookbook, index) => (
          <div
            className="saved-lookbook"
            key={index}
            onClick={() => openLookbookModal(lookbook)}
          >
            <img src={lookbook.image} alt={`Saved Lookbook ${index + 1}`} />
            {/* <p>{lookbook.styleName}</p>
            <p>{lookbook.situation}</p> */}
          </div>
        ))}
      </div>

      <Footer currentSection="lookbook" />
    </div>
  );
};

export default LookBook;
