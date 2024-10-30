import React from "react";
import { useNavigate } from "react-router-dom";

const CodiMapGrid = ({ userCodiMaps }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="user-codimap-container">
        <div className="empty-div">
          <div className="empty-div-img">
            <div
              className="empty-div-togo-codimap"
              onClick={() => navigate("/lookbook")}
            >
              + 나만의 코디맵 만들기
            </div>
          </div>
          <div className="empty-div-text"></div>
        </div>
        {userCodiMaps.length > 0 ? (
          <>
            {userCodiMaps.map((codiMap, index) => (
              <div key={index} className="user-codimap-item">
                <img
                  src={codiMap.image}
                  alt={`CodiMap_${index}`}
                  className="user-codimap-img"
                />
                <p className="user-codimap-style">{codiMap.styleName}</p>
                <p className="user-codimap-situation">{codiMap.situation}</p>
              </div>
            ))}
          </>
        ) : (
          <p></p>
        )}
      </div>
    </>
  );
};

export default CodiMapGrid;
