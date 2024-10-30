import React from "react";
import { BsPlus } from "react-icons/bs";

const UploadButton = ({ onUpload }) => {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="upload-button">
      <label htmlFor="upload-input">
        <BsPlus className="upload-icon" />
      </label>
      <input
        id="upload-input"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadButton;
