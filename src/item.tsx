import { useState, MouseEventHandler } from "react";

export interface GalleryItemProps {
  imageUrl: string;
  id: string;
  onSelected: (id: string, value: boolean) => void;
  onMouseUp?: MouseEventHandler<HTMLDivElement> | undefined;
  onMouseDown?: MouseEventHandler<HTMLDivElement> | undefined;
  // onMouseEnter?: MouseEventHandler<HTMLDivElement> | undefined;
  // onMouseLeave?: MouseEventHandler<HTMLDivElement> | undefined;
  onMouseMove?: MouseEventHandler<HTMLDivElement> | undefined;
}

const GalleryItem = ({
  id,
  imageUrl,
  onSelected,
  onMouseDown,
  onMouseUp,
  onMouseMove,
}: GalleryItemProps) => {
  const [isHover, setHover] = useState(false);
  const [isSelected, setSelected] = useState(false);

  return (
    <div
      id={`${id}`}
      onMouseDown={(e) => onMouseDown!(e)}
      onMouseUp={(e) => onMouseUp!(e)}
      onMouseMove={(e) => onMouseMove!(e)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="gallery-item"
      style={{
        backgroundImage: `url(${imageUrl})`,
        opacity: isHover ? "0.8" : "1",
      }}
    >
      {(isHover || isSelected) && (
        <input
          type="checkbox"
          onChange={() => {
            setSelected(!isSelected);
            onSelected(id, !isSelected);
          }}
        ></input>
      )}
    </div>
  );
};
export default GalleryItem;
