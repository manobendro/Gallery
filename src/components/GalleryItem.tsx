import React, { useState } from "react";
import "./GalleryItem.css";

export interface GalleryItemProps {
  imageUrl: string;
  id: string;
  selected: boolean;
  onSelected: (id: string, value: boolean) => void;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
}

const GalleryItem: React.FC<GalleryItemProps> = ({
  id,
  imageUrl,
  onSelected,
  onMouseDown,
  selected,
}) => {
  const [isHover, setHover] = useState(false);
  const isDummy = imageUrl.match("dummy");
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onMouseDown && onMouseDown(e);
  };
  return (
    <div
      id={id}
      onMouseDown={handleMouseDown}
      onMouseUp={(e) => e.preventDefault()}
      onMouseMove={(e) => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="gallery-item"
      style={{
        backgroundImage: `url(${!isDummy ? imageUrl : ""})`,
        opacity: isHover && !isDummy ? 0.8 : 1,
      }}
    >
      {isDummy ? (
        <div className="dummy"></div>
      ) : (
        (isHover || selected) && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => {
              onSelected(id, !selected);
            }}
          ></input>
        )
      )}
    </div>
  );
};

export default GalleryItem;
