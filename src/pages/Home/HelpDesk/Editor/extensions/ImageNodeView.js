import React from "react";
import { NodeViewWrapper } from "@tiptap/react";
import { useImageFocus } from "../hooks/useImageFocus";
import { useImageResize } from "../hooks/useImageResize";
import { ResizeHandle } from "./ResizeHandle";

export const ImageNodeView = (props) => {
  const { node, editor, getPos, updateAttributes } = props;

  // 훅을 통한 상태 및 로직 주입
  const isFocused = useImageFocus(editor, getPos);
  const { width, imageRef, startResize } = useImageResize(
    node.attrs.width,
    updateAttributes,
  );

  return (
    <NodeViewWrapper
      className="image-node-wrapper"
      style={{
        display: "block",
        margin: "1.5rem 0",
        outline: isFocused ? "3px solid #3b82f6" : "none",
        borderRadius: "8px",
        transition: "outline 0.1s ease",
        position: "relative",
        width: "fit-content",
      }}
    >
      <img
        {...node.attrs}
        ref={imageRef}
        draggable={false}
        style={{
          width: width,
          height: "auto",
          display: "block",
          borderRadius: "8px",
        }}
        alt="에디터 이미지"
      />

      {isFocused && <ResizeHandle onMouseDown={startResize} />}
    </NodeViewWrapper>
  );
};
