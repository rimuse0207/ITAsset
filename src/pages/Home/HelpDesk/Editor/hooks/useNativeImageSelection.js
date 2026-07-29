import { useEffect } from "react";
import { NodeSelection } from "prosemirror-state";

export const useNativeImageSelection = (editor) => {
  useEffect(() => {
    if (!editor || !editor.view) return;

    const editorDom = editor.view.dom;

    const handleNativeMouseDown = (e) => {
      // 리사이즈 핸들 클릭 시 패스
      if (e.target.closest(".image-resize-handle")) return;

      const wrapperDiv = e.target.closest(".image-node-wrapper");
      if (!wrapperDiv) return;

      e.preventDefault();
      e.stopPropagation();

      const imgElement = wrapperDiv.querySelector("img");
      if (!imgElement) return;

      const pos = editor.view.posAtDOM(imgElement);

      if (pos !== null) {
        setTimeout(() => {
          const { view, state } = editor;
          try {
            const tr = state.tr.setSelection(
              NodeSelection.create(state.doc, pos),
            );
            view.dispatch(tr);
            editor.commands.focus();
          } catch (err) {
            try {
              const fallbackTr = state.tr.setSelection(
                NodeSelection.create(state.doc, pos - 1),
              );
              view.dispatch(fallbackTr);
              editor.commands.focus();
            } catch (e2) {
              console.error("포커스 최종 실패:", e2);
            }
          }
        }, 0);
      }
    };

    editorDom.addEventListener("mousedown", handleNativeMouseDown, true);
    return () =>
      editorDom.removeEventListener("mousedown", handleNativeMouseDown, true);
  }, [editor]);
};
