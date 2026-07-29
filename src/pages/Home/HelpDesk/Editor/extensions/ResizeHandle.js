import React from "react";

export const ResizeHandle = ({ onMouseDown }) => {
  return (
    <div
      className="image-resize-handle"
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        right: "-4px",
        bottom: "-4px",
        width: "12px",
        height: "12px",
        backgroundColor: "#3b82f6",
        border: "2px solid #ffffff",
        borderRadius: "50%",
        cursor: "se-resize",
        zIndex: 10,
      }}
    />
  );
};
