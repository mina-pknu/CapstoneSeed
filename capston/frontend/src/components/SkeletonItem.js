import React from "react";
import "../css/Skeleton.css";  // 스켈레톤 UI 스타일을 위한 CSS 파일

const SkeletonItem = () => {
  return (
    <div className="skeleton-item">
      <div className="skeleton-image"></div>
      <div className="skeleton-likes"></div>
    </div>
  );
};

export default SkeletonItem;
