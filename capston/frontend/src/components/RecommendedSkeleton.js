import React from "react";
import "../css/RecommendedSkeleton.css";  // 이 컴포넌트 전용 CSS 파일

const RecommendedSkeleton = () => {
  return (
    <div className="recommended-skeleton">
      <div className="image-container">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="skeleton-recommended-image"></div>
        ))}
      </div>
      <div className="dots-container">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="dot"></div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedSkeleton;
