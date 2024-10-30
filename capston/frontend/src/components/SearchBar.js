import React, { useState, useEffect, useRef } from "react";
import "../css/SearchBar.css"; // SearchBar 전용 CSS 파일 추가
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchBar = ({ onSearch, onCancel, onFocus }) => {
  const [query, setQuery] = useState(""); // 현재 입력된 검색어 상태
  
  const [searchHistory, setSearchHistory] = useState([]); // 검색 기록 상태
  const [showHistory, setShowHistory] = useState(false); // 검색 기록 표시 여부 상태
  const searchContainerRef = useRef(null);
  const suggestions = ['청자켓', '스포츠브라', '셔츠', '여름가디건', '수영복', '스트릿패션']
  // 컴포넌트가 처음 렌더링될 때 로컬 스토리지에서 검색 기록을 불러옴
  
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  // 검색 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query) {
      onSearch(query); // 검색어를 부모 컴포넌트로 전달
      // 검색 기록 업데이트 및 로컬 스토리지에 저장
      const newHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ];
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      setQuery(""); // 검색창 초기화
      setShowHistory(false); // 검색 기록 숨김
    }
  };

  // 검색 기록 클릭 핸들러
  const handleHistoryClick = (query) => {
    setQuery(query); // 클릭한 검색어를 검색창에 설정
    setShowHistory(false); // 검색 기록 숨김
    onSearch(query); // 검색어를 부모 컴포넌트로 전달
  };

  const handleClickOutside = (event) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target)
    ) {
      setShowHistory(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTagClick = (text) => {
    setQuery(text);
  }

  return (
    <div className="search-container" ref={searchContainerRef}>
       <form onSubmit={handleSubmit} className={`search-bar ${searchHistory.length > 0 && showHistory ? 'focused' : ''}`}>
        <FontAwesomeIcon
          icon="fa-solid fa-magnifying-glass"
          className="search-icon"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력해주세요."
          onFocus={() => {
            setShowHistory(true);
            onFocus();
          }} // 검색창 포커스 시 검색 기록 표시
        />
        {query && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setQuery(""); // 검색창 초기화
              setShowHistory(false); // 검색 기록 숨김
              onCancel(); // 부모 컴포넌트에 알림
            }}
          >
            취소
          </button>
        )}
      </form>
      <div className="suggestions-header">추천 검색어</div>
      <div className="recommand-tags">
        {suggestions.map((suggestion, index) => (
          <span key={index} className="tag" onClick={() => handleTagClick(suggestion)}>
            {suggestion}
          </span>
        ))}
      </div>
      {showHistory && searchHistory.length > 0 && (
        <div className="search-history-container">
          <div className="search-history">
            {searchHistory.map((item, index) => (
              <div
                key={index}
                className="history-item"
                onClick={() => handleHistoryClick(item)}
              >
                <FontAwesomeIcon icon="fa-solid fa-magnifying-glass" />
                <div className="history-text">{item}</div>
                <div
                  className="history-delete"
                  onClick={(e) => {
                    e.stopPropagation(); // 부모 요소의 클릭 이벤트 전파 방지
                    // 검색 기록에서 항목 삭제 및 로컬 스토리지 업데이트
                    const newHistory = searchHistory.filter(
                      (historyItem) => historyItem !== item
                    );
                    setSearchHistory(newHistory);
                    localStorage.setItem(
                      "searchHistory",
                      JSON.stringify(newHistory)
                    );
                  }}
                >
                  ✖
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
