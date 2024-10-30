import React, { useState } from "react";
import ImageCard from "./ImageCard";
import axios from "axios";
import "../css/ImageGrid.css";

const ImageGrid = ({ initialImages, query }) => {
  const [images, setImages] = useState(initialImages);
  const [scrollCount, setScrollCount] = useState(1);

  const handleLoadMore = () => {
    const newScrollCount = scrollCount + 1;
    axios
      .post("http://127.0.0.1:5000/search", {
        query,
        scroll_count: newScrollCount,
      })
      .then((response) => {
        const newImages = response.data.filter((url) => !images.includes(url));
        setImages((prevImages) => [...prevImages, ...newImages]);
        setScrollCount(newScrollCount);
      })
      .catch((error) => {
        console.error("Error fetching more images:", error);
      });
  };

  return (
    <div className="image-grid-container">
      <div className="image-grid">
        {images.map((url, index) => (
          <ImageCard key={index} url={`http://127.0.0.1:5000/static/${url}`} />
        ))}
      </div>
      {images.length > 0 && (
        <button className="load-more-button" onClick={handleLoadMore}>
          더보기
        </button>
      )}
    </div>
  );
};

export default ImageGrid;
