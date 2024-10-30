import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import './UploadLookbook.css'; // CSS 파일로 스타일 분리

const UploadLookbook = () => {
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingElement, setDraggingElement] = useState(null);
  const canvasContainerRef = useRef(null);

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const img = await removeBackground(file);
        if (img) {
          return { src: img.src, id: Date.now() + Math.random() };
        }
        return null;
      })
    );
    setImages((prevImages) => [...prevImages, ...uploadedImages.filter(img => img !== null)]);
  };

  const removeBackground = async (file) => {
    const apiKey = 'bZSpDs1fR7zsYa5QJxXm58Lt'; // API 키 입력

    const formData = new FormData();
    formData.append('image_file', file);
    formData.append('size', 'auto');

    try {
      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': apiKey },
        body: formData
      });

      if (response.ok) {
        const blob = await response.blob();
        const img = document.createElement('img');
        img.src = URL.createObjectURL(blob);
        img.alt = file.name;
        return img;
      } else {
        console.error('Error:', response.statusText);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };

  const handleSave = () => {
    html2canvas(canvasContainerRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'lookbook.png';
      link.click();
    });
  };

  const handleDelete = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleDragStart = (e, img) => {
    setDraggingElement(img);
    setIsDragging(true);
  };

  const handleDrag = (e) => {
    if (isDragging && draggingElement) {
      const element = document.getElementById(draggingElement.id);
      element.style.left = `${e.clientX - 50}px`; // Adjust for drag start position
      element.style.top = `${e.clientY - 50}px`; // Adjust for drag start position
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggingElement(null);
  };

  return (
    <div>
      <header>
        <h1>My Lookbook (Auto)</h1>
      </header>
      <main>
        <div className="container">
          <input type="file" id="fileInput" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
          <button id="uploadButton" onClick={() => document.getElementById('fileInput').click()}>Upload</button>
          <button id="saveButton" onClick={handleSave}>Save</button>
          <div
            id="canvasContainer"
            className="canvas-container"
            ref={canvasContainerRef}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
          >
            {images.map((img) => (
              <div
                key={img.id}
                id={img.id}
                className="resizable"
                onMouseDown={(e) => handleDragStart(e, img)}
                style={{ position: 'absolute', left: '0px', top: '0px' }}
              >
                <img src={img.src} alt="Uploaded" />
                <button
                  className="delete-button"
                  onClick={() => handleDelete(img.id)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Clothing Selector</p>
      </footer>
    </div>
  );
};

export default UploadLookbook;