import { useState, MouseEvent, useEffect } from "react";
import "./App.css";
import GalleryItem from "./item";

interface Point {
  x: number;
  y: number;
}

const _images = [
  "/images/image-1.webp",
  "/images/image-2.webp",
  "/images/image-3.webp",
  "/images/image-4.webp",
  "/images/image-5.webp",
  "/images/image-6.webp",
  "/images/image-7.webp",
  "/images/image-8.webp",
  "/images/image-9.webp",
  "/images/image-10.jpeg",
  "/images/image-11.jpeg",
];
let currentSelectedImage = "";

function App() {
  const [selected, updateSelected] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [handlerStyle, setHandlerStyle] = useState({});
  const [prevMC, updatePrevMC] = useState<Point>({ x: 0, y: 0 });
  const [transform, updateTransform] = useState<Point>({ x: 0, y: 0 });
  const [offset, updateOffset] = useState<Point>({ x: 0, y: 0 });
  const [images, updateImages] = useState(_images);

  const [selectedIndx, updateSelectedIndx] = useState(-1);
  const [dummyIndx, updateDummyIndx] = useState(selectedIndx);

  const calDeltaMove = (currentMouseCordinate: Point) => {
    const out: Point = {
      x: currentMouseCordinate.x - prevMC.x,
      y: currentMouseCordinate.y - prevMC.y,
    };

    // console.log("Current vs Previous");
    // console.log(currentMouseCordinate);
    // console.log(prevMC);

    updatePrevMC({ x: currentMouseCordinate.x, y: currentMouseCordinate.y });
    return out;
  };

  const itemSelectHandler = (id: string, value: boolean) => {
    if (value) {
      updateSelected(selected + 1);
    } else {
      updateSelected(selected - 1);
    }
  };
  const _getItem = (items: Element[]) => {
    return items.filter((item) => item.className.match("gallery-item"));
  };
  const _updateDummyPosition = (_dummyIndx: number) => {
    if (dummyIndx >= 0) {
      images.splice(dummyIndx, 1);
    }
    images.splice(_dummyIndx, 0, "dummy");
    updateImages(images);
    updateDummyIndx(_dummyIndx);
  };

  const _handleMouseDown = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (!target.className.match("gallery-item")) {
      return;
    }
    // console.log(`Dragging started at node id: ${(e.target as HTMLElement).id}`);
    // console.log(e);
    if (target.id) {
      updateSelectedIndx(Number(target.id));
      currentSelectedImage = images[Number(target.id)];
      images.splice(Number(target.id), 1);
      _updateDummyPosition(Number(target.id));
      updateDummyIndx(Number(target.id));
    }
    updateOffset({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setHandlerStyle({
      top: (e.target as HTMLElement).offsetTop,
      left: (e.target as HTMLElement).offsetLeft,
      height: (e.target as HTMLElement).clientHeight - 4,
      width: (e.target as HTMLElement).clientWidth - 4,
    });
    updatePrevMC({ x: e.clientX, y: e.clientY });
    //updateTransform({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    // console.log(prevMC);
    setDragging(true);
  };
  const _handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      // console.log(`Dragging on node id: ${(e.target as HTMLElement).id}`);
      // console.log(e);
      const delta = calDeltaMove({ x: e.clientX, y: e.clientY });

      const elements = _getItem(
        document.elementsFromPoint(e.clientX, e.clientY)
      );
      // console.log(elements);

      updateTransform({ x: transform.x + delta.x, y: transform.y + delta.y });
      //console.log((e.relatedTarget as HTMLElement).id);
      // if (e.relatedTarget) {
      //   console.log((e.relatedTarget as HTMLElement).id);
      // }

      if (elements.length > 0) {
        _updateDummyPosition(Number(elements[0].id));

        if (
          handlerStyle.height + 4 != elements[0].clientHeight ||
          handlerStyle.width + 4 != elements[0].clientWidth
        ) {
          // console.log("----Size----");
          // console.log(handlerStyle);
          // console.log(elements[0]);
          // console.log("Size changed!");

          if (handlerStyle.width > elements[0].clientWidth) {
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

          // updateTransform({
          //   x: transform.x - elements[0].clientWidth / 2,
          //   y: transform.y - elements[0].clientHeight / 2,
          // });
        }

        setHandlerStyle({
          ...handlerStyle,
          height: elements[0].clientHeight - 4,
          width: elements[0].clientWidth - 4,
          transform: `translate(${transform.x}px, ${transform.y}px)`,
        });
      } else {
        setHandlerStyle({
          ...handlerStyle,
          transform: `translate(${transform.x}px, ${transform.y}px)`,
        });
      }
    }
  };

  const _handleMouseUp = (e: MouseEvent) => {
    // console.log("Dragging: False.");
    e.stopPropagation();
    if (dragging) {
      console.log("-----");
      console.log(images);
      console.log(dummyIndx);
      images.splice(dummyIndx, 1);
      images.splice(dummyIndx, 0, currentSelectedImage);
      console.log(images);
      updateImages(images);
      updateDummyIndx(-1);

      setDragging(false);
      updateTransform({ x: 0, y: 0 });
      updateSelectedIndx(-1);
    }
  };

  useEffect(() => {
    const globalMouseUp = (e: globalThis.MouseEvent) => {
      //  console.log(e);
      // images.splice(dummyIndx, 1);
      // images.splice(dummyIndx, 0, currentSelectedImage);
      // updateImages(images);
      e.stopPropagation();
      if (dragging) {
        console.log("-----");
        console.log(images);
        console.log(dummyIndx);
        images.splice(dummyIndx, 1);
        images.splice(dummyIndx, 0, currentSelectedImage);
        console.log(images);
        updateImages(images);
        updateDummyIndx(-1);

        setDragging(false);
        updateTransform({ x: 0, y: 0 });
        updateSelectedIndx(-1);
      }
    };

    const globalMouseLeave = (e: globalThis.MouseEvent)=>{
      console.log(e);
      if (dragging) {
        console.log("-----");
        console.log(images);
        console.log(dummyIndx);
        images.splice(dummyIndx, 1);
        images.splice(dummyIndx, 0, currentSelectedImage);
        console.log(images);
        updateImages(images);
        updateDummyIndx(-1);
  
        setDragging(false);
        updateTransform({ x: 0, y: 0 });
        updateSelectedIndx(-1);
      }
      //e.stopPropagation();
    };

    document.addEventListener("mouseup", globalMouseUp);
    document.addEventListener("mouseleave",globalMouseLeave);
    return () => {
      document.removeEventListener("mouseup", globalMouseUp);
      document.removeEventListener("mouseleave",globalMouseLeave);
    };
  }, []);

  return (
    <>
      <div className="toolbar">
        <span>{selected > 0 ? `${selected} Files selected` : "Gallery"}</span>
        {selected > 0 && <a>Delete {selected > 1 ? "files" : "file"}</a>}
      </div>
      <div className="gallery" onMouseMove={(e) => _handleMouseMove(e)}>
        {images.map((_img, index) => (
          <GalleryItem
            id={`${index}`}
            key={index}
            onMouseDown={(e) => _handleMouseDown(e)}
            onMouseUp={(e) => _handleMouseUp(e)}
            onMouseMove={(e) => {
              //_handleMouseMove(e);
              //console.log("Also id" + (e.target as HTMLElement).id);
              e.preventDefault();
            }}
            //onMouseMove={(e) => _handleMouseMove(e)}
            onSelected={(id, value) => itemSelectHandler(id, value)}
            imageUrl={_img}
          ></GalleryItem>
        ))}
      </div>
      {dragging && (
        <div
          className="handler"
          onMouseUp={(e) => {
            //e.preventDefault();
            _handleMouseUp(e);
          }}
          onMouseMove={(e) => {
            //e.preventDefault();
            _handleMouseMove(e);
            // console.log(`Propagaton status: ${e.isPropagationStopped()}`);
          }}
          onMouseDown={(e) => e.preventDefault()}
          style={{ ...handlerStyle }}
        ></div>
      )}
    </>
  );
}

export default App;
