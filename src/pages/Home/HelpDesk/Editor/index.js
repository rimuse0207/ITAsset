// src/components/common/Editor/index.jsx
import React, { useEffect, memo } from "react";
import { EditorContent } from "@tiptap/react";
import { useEditorCore } from "./useEditorCore";
import { EditorToolbar } from "./EditorToolbar";
import "./styles.css";
import { TableContextMenu } from "./extensions/TableConextMenu";

export const SharedEditor = memo(({ value, onChange, placeholder }) => {
  const editor = useEditorCore({ content: value, onChange, placeholder });

  const stopEventPropagation = (e) => {
    e.stopPropagation();
  };

  // ★ 신규: 하단 빈 여백 클릭 시 맨 마지막으로 포커스 이동시키는 핸들러
  const handleContainerClick = (e) => {
    if (!editor) return;

    // 사용자가 글자 자체를 클릭한 게 아니라, 아래쪽 padding 빈 공간을 클릭했는지 확인
    // (클릭된 대상이 .editor-content-area 본체이거나 내부 wrapper일 때만 작동)
    if (
      e.target.classList.contains("editor-content-area") ||
      e.target.classList.contains("ProseMirror")
    ) {
      // 에디터의 맨 끝 포지션으로 포커스를 잡아줍니다.
      editor.chain().focus("end").run();
    }
  };

  return (
    <div
      className="editor-container"
      onKeyDown={stopEventPropagation}
      onKeyUp={stopEventPropagation}
      onKeyPress={stopEventPropagation}
    >
      <EditorToolbar editor={editor} />
      {/* ★ 여기에 onClick 핸들러를 바인딩합니다. */}
      <div
        onClick={handleContainerClick}
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <EditorContent editor={editor} className="editor-content-area" />
      </div>
      <TableContextMenu editor={editor} />
    </div>
  );
});
