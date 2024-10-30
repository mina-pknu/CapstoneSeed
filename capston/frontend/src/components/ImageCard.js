import React from 'react';
import "../css/ImageGrid.css"; 

const ImageCard = ({ url }) => {
  return (
    <div className='image-card'>
      <img src={url} alt='Pinterest' />
    </div>
  );
};

export default ImageCard;
