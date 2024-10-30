import React from 'react';

const ItemTypeFilter = ({ selectedType, onTypeChange }) => {
  return (
    <div style={filterContainerStyle}>
      <button
        style={selectedType === 'all' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('all')}
      >
        모두
      </button>
      <button
        style={selectedType === 'top' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('top')}
      >
        상의
      </button>
      <button
        style={selectedType === 'bottom' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('bottom')}
      >
        하의
      </button>
      <button
        style={selectedType === 'outerwear' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('outerwear')}
      >
        아우터
      </button>
      <button
        style={selectedType === 'dress' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('dress')}
      >
        원피스
      </button>
      <button
        style={selectedType === 'shoes' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('shoes')}
      >
        신발
      </button>
      <button
        style={selectedType === 'bag' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('bag')}
      >
        가방
      </button>
      <button
        style={selectedType === 'accessory' ? selectedButtonStyle : buttonStyle}
        onClick={() => onTypeChange('accessory')}
      >
        액세서리
      </button>
    </div>
  );
};

const filterContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  margin: '10px 0'
};

const buttonStyle = {
  margin: '0 5px',
  padding: '10px 20px',
  backgroundColor: '#777',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '5px'
};

const selectedButtonStyle = {
  ...buttonStyle,
  backgroundColor: '#333'
};

export default ItemTypeFilter;