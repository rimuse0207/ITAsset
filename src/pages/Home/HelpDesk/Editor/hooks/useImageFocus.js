import { useState, useEffect } from "react";

export const useImageFocus = (editor, getPos) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!editor || typeof getPos !== "function") return;

    const updateSelection = () => {
      const { selection } = editor.state;
      setIsFocused(selection.from === getPos());
    };

    updateSelection();
    editor.on("selectionUpdate", updateSelection);
    editor.on("blur", () => setIsFocused(false));

    return () => {
      editor.off("selectionUpdate", updateSelection);
      editor.off("blur", () => setIsFocused(false));
    };
  }, [editor, getPos]);

  return isFocused;
};
