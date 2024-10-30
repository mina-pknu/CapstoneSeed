import React, { useState } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchBar from "./components/SearchBar";
import ImageGrid from "./components/ImageGrid";
import Login from "./components/Login";
import AuthCallback from "./components/AuthCallback";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./css/App.css";
// index.js 또는 App.js
import "@fortawesome/fontawesome-free/css/all.min.css";

/*민아 JS*/
import Wardrobe from "./components/Wardrobe";
import ItemDetail from "./components/ItemDetail";
import ItemDetailPage from "./components/ItemDetailPage";
import LookBook from "./components/Lookbook";
import VirtualFit from "./components/VirtualFit";
import FreeLookbook from "./components/FreeLookbook";

const App = () => {
  const [images, setImages] = useState([]);
  const [showImages, setShowImages] = useState(false); // 초기값을 false로 변경
  const [showOverlay, setShowOverlay] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (query) => {
    setQuery(query);
    setImages([]); // 새로운 검색어가 입력되면 기존 이미지 초기화

    axios
      .post("http://127.0.0.1:5000/search", { query, scroll_Count: 1 }) // Flask 서버 IP 주소
      .then((response) => {
        setImages(response.data);
        setShowImages(true); // 검색 결과를 가져오면 이미지를 표시
        setShowOverlay(false); // 검색이 완료되면 오버레이 제거
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  };

  // 검색창 포커스 핸들러
  const handleFocus = () => {
    setShowImages(false); // 검색창 포커스 시 이미지를 숨김
    setShowOverlay(true);
  };

  // 취소 버튼 클릭 핸들러
  const handleCancel = () => {
    setShowImages(false); // 취소 버튼 클릭 시 이미지를 숨김
    setShowOverlay(false);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setShowImages(true);
  };

  /* 민아 코드*/
  const [items, setItems] = useState([]);

  return (
    <GoogleOAuthProvider clientId="845578172695-a9pll682qulsg8u18v6tsgi6ru96hid3.apps.googleusercontent.com">
      <BrowserRouter>
        {showOverlay && (
          <div className="overlay" onClick={handleOverlayClick}></div>
        )}
        <Routes>
          <Route
            path="/search"
            element={
              <div className="App">
                <SearchBar
                  onSearch={handleSearch}
                  onFocus={handleFocus}
                  onCancel={handleCancel}
                />
                {showImages && (
                  <ImageGrid initialImages={images} query={query} />
                )}{" "}
                {/* showImages 상태에 따라 이미지 그리드 표시 */}
              </div>
            }
          />

          <Route path="/" element={<Login />} />
          {/* <Route path="/ element={<Homepage />} /> */}
          <Route path="/auth/naver/callback" element={<AuthCallback />} />

          <Route path="/homepage" element={<Wardrobe items={items} />} />
          <Route path="/lookbook" element={<LookBook />} />
          <Route path="/free-lookbook" element={<FreeLookbook />} />
          <Route path="/item-detail" element={<ItemDetailPage />} />
          <Route path="/item-detail/:id" element={<ItemDetail />} />
          <Route path="/virtual-fit" element={<VirtualFit />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default App;
