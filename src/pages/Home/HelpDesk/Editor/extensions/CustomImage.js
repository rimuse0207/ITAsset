// src/components/common/Editor/extensions/CustomImage.js
import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageNodeView } from "./ImageNodeView";

export const CustomImage = Image.extend({
  atom: true,
  isolating: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "auto",
        parseHTML: (element) => element.getAttribute("width") || "auto",
        renderHTML: (attributes) => {
          const widthStyle =
            attributes.width && attributes.width !== "auto"
              ? `width: ${attributes.width};`
              : "width: auto;";

          return {
            width: attributes.width,
            style: `display: block; margin: 1.5rem 0; max-width: 100%; height: auto; ${widthStyle}`,
          };
        },
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
