import { useState, useEffect, useRef } from "react";

export const useImageResize = (initialWidth, updateAttributes) => {
  const imageRef = useRef(null);
  const [width, setWidth] = useState(initialWidth || "auto");

  useEffect(() => {
    if (initialWidth) {
      setWidth(initialWidth);
    }
  }, [initialWidth]);

  const startResize = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startWidth =
      imageRef.current?.getBoundingClientRect().width ||
      parseInt(width, 10) ||
      300;
    let finalWidth = startWidth;

    const handleMouseMove = (moveEvent) => {
      const diffX = moveEvent.clientX - startX;
      finalWidth = Math.max(50, startWidth + diffX);
      setWidth(`${finalWidth}px`);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      updateAttributes({ width: `${finalWidth}px` });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return { width, imageRef, startResize };
};
