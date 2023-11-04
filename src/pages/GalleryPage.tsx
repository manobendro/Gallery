import React, { useState } from "react";
import "./GalleryPage.css";
import GalleryItem from "../components/GalleryItem";

interface Point {
  x: number;
  y: number;
}

interface HandlerStyle {
  height?: number;
  width?: number;
  top?: number;
  left?: number;
  transform?: string;
  backgroundImage?: string;
}

interface ImageType {
  id: number;
  url: string;
  selected: boolean;
}


const _images_: ImageType[] = [
  { id: 1, url: "/images/image-1.webp", selected: false },
  { id: 2, url: "/images/image-2.webp", selected: false },
  { id: 3, url: "/images/image-3.webp", selected: false },
  { id: 4, url: "/images/image-4.webp", selected: false },
  { id: 5, url: "/images/image-5.webp", selected: false },
  { id: 6, url: "/images/image-6.webp", selected: false },
  { id: 7, url: "/images/image-7.webp", selected: false },
  { id: 8, url: "/images/image-8.webp", selected: false },
  { id: 9, url: "/images/image-9.webp", selected: false },
  { id: 10, url: "/images/image-10.jpeg", selected: false },
  { id: 11, url: "/images/image-11.jpeg", selected: false },
];
let currentSelectedImage: ImageType;
const padding = 2; //padding 2 + 2 for adding border for gallery item default have 1px solid border

function GalleryPage() {
  const [selected, setSelected] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [handlerStyle, setHandlerStyle] = useState<HandlerStyle>();
  const [prevMouseCoordinate, updatePrevMouseCoordinate] = useState<Point>({ x: 0, y: 0 });
  const [transform, updateTransform] = useState<Point>({ x: 0, y: 0 });
  const [offset, updateOffset] = useState<Point>({ x: 0, y: 0 });
  const [images, updateImages] = useState(_images_);

  const [selectedIndx, updateSelectedIndx] = useState(-1);
  const [dummyIndx, updateDummyIndx] = useState(selectedIndx);

  // Calculate mouse movement for transforming drag handler
  const calculateDeltaMove = (currentMouseCoordinate: Point) => {
    const out: Point = {
      x: currentMouseCoordinate.x - prevMouseCoordinate.x,
      y: currentMouseCoordinate.y - prevMouseCoordinate.y,
    };
    updatePrevMouseCoordinate({ x: currentMouseCoordinate.x, y: currentMouseCoordinate.y });
    return out;
  };

  // delete operation on selected images
  const deleteSelectedImages = () => {
    const updatedImages = images.filter((image) => !image.selected);
    updateImages(updatedImages);
    setSelected(0);
  };

  // trigger when one images is selected or deselected
  const itemSelectHandler = (id: string, value: boolean) => {
    if (value) {
      setSelected(selected + 1);
    } else {
      setSelected(selected - 1);
    }
    updateImages((prevImages) =>
      prevImages.map((_img, i) => {
        return i == Number(id) ? { ..._img, selected: value } : _img;
      })
    );
  };

  // filter out only gallery-items
  const _getGalleryItems = (items: Element[]) => {
    return items.filter((item) => item.className.match("gallery-item"));
  };

  // add or update a dummy image position in the grid
  const _updateDummyPosition = (_dummyIndx: number) => {
    if (dummyIndx >= 0) {
      images.splice(dummyIndx, 1);
    }
    images.splice(_dummyIndx, 0, { id: -1, url: "dummy", selected: false });
    updateImages(images);
    updateDummyIndx(_dummyIndx);
  };

  // mouse down handler for drag handler and gallery itself

  const _handleMouseDown = (e: React.MouseEvent) => {

    const target = e.target as HTMLElement;

    // need a gallery item for start a swap
    if (!target.className.match("gallery-item")) {
      return;
    }

    if (target.id) {
      updateSelectedIndx(Number(target.id));

      // temporary store current selected item
      currentSelectedImage = images[Number(target.id)];
      // remove selected item from images list
      images.splice(Number(target.id), 1);
      _updateDummyPosition(Number(target.id));
      updateDummyIndx(Number(target.id));
    }

    // changing some property for drag handler
    updateOffset({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setHandlerStyle({
      top: (e.target as HTMLElement).offsetTop,
      left: (e.target as HTMLElement).offsetLeft,
      height: (e.target as HTMLElement).clientHeight - padding,
      width: (e.target as HTMLElement).clientWidth - padding,
      backgroundImage: `url(${currentSelectedImage.url})`,
    });
    updatePrevMouseCoordinate({ x: e.clientX, y: e.clientY });
    setDragging(true);
  };


  const _handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) {
      //Updating dragging handler position
      const delta = calculateDeltaMove({ x: e.clientX, y: e.clientY });
      updateTransform({ x: transform.x + delta.x, y: transform.y + delta.y });

      // Is there any gallery item in current mouse coordinate
      const elements = _getGalleryItems(
        document.elementsFromPoint(e.clientX, e.clientY)
      );
      
      if (elements.length > 0) {

        // stopping rerendering images list if dummy index not changed though dummy image is also gallery item.
        if (dummyIndx != Number(elements[0].id)) {
          _updateDummyPosition(Number(elements[0].id));
        }


        // This block of code detect, Is handler is changing its size moving from featured to non featured or vise versa.
        if (
          handlerStyle!.height! + padding != elements[0].clientHeight ||
          handlerStyle!.width! + padding != elements[0].clientWidth
        ) {
          if (handlerStyle!.width! > elements[0].clientWidth) {
            updateTransform({
              x: transform.x + offset.x - offset.x * 0.5,
              y: transform.y + offset.y - offset.y * 0.5,
            });
            updateOffset({ x: offset.x * 0.5, y: offset.y * 0.5 });
          } else {
            updateTransform({
              x: transform.x + offset.x - offset.x * 2,
              y: transform.y + offset.y - offset.y * 2,
            });
            updateOffset({ x: offset.x * 2, y: offset.y * 2 });
          }
        }

        setHandlerStyle({
          ...handlerStyle,
          height: elements[0].clientHeight - padding,
          width: elements[0].clientWidth - padding,
          transform: `translate(${transform.x}px, ${transform.y}px)`,
        });
      } else {
        setHandlerStyle({
          ...handlerStyle,
          transform: `translate(${transform.x}px, ${transform.y}px)`,
        });
      }
      //-------------------------------------------------------------------
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _handleMouseUp = (_e: React.MouseEvent) => {

    if (dragging) {

      // doing the image swap
      images.splice(dummyIndx, 1);
      images.splice(dummyIndx, 0, currentSelectedImage);
      updateImages(images);
      
      // reset some variable for drag handler
      updateDummyIndx(-1);
      setDragging(false);
      updateTransform({ x: 0, y: 0 });
      updateSelectedIndx(-1);
    }
  };
  return (
    <>
    {/* Tool bar */}
      <div className="toolbar">
        <span>{selected > 0 ? `${selected} ${selected > 1 ? "files" : "file"} selected` : "Gallery"}</span>
        {selected > 0 && (
          <a onClick={deleteSelectedImages}>
            Delete {selected > 1 ? "files" : "file"}
          </a>
        )}
      </div>
      {/* Main gallery */}
      <div className="gallery-container">
        <div className="gallery" onMouseMove={(e) => _handleMouseMove(e)}>
          
          {/* Rendering images list */}
          {images.map((_img, index) => (
            <GalleryItem
              id={`${index}`}
              key={_img.id}
              selected={_img.selected}
              // Mouse handler for detecting drag start 
              onMouseDown={(e) => _handleMouseDown(e)}
              onSelected={(id, value) => itemSelectHandler(id, value)}
              imageUrl={_img.url}
            ></GalleryItem>
          ))}

          {/* Grid last item 'Add Images' */}
          <div className="add-image">
            <img src="/image-gallery.png"/>
            <span>Add Images</span>
          </div>
        </div>

        {/* Drag handler
        * When drag handler is visible mouse courser is always on top of handler.
        */}

        {dragging && (
          <div
            className="handler"
            onMouseUp={(e) => _handleMouseUp(e)}
            onMouseMove={(e) => _handleMouseMove(e)}
            onMouseDown={(e) => _handleMouseDown(e)}
            style={{ ...handlerStyle, backgroundSize: "cover" }}
          ></div>
        )}
      </div>
    </>
  );
}

export default GalleryPage;
