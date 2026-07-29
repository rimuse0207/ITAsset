// src/components/common/Editor/useEditorCore.js
import { useEditor } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { CustomImage } from "./extensions/CustomImage";
import { FontSize } from "./extensions/FontSize";
import { Color } from "@tiptap/extension-color";
import { useNativeImageSelection } from "./hooks/useNativeImageSelection";

import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import TextAlign from "@tiptap/extension-text-align";

import { Plugin, PluginKey } from "@tiptap/pm/state";
import { CellSelection } from "@tiptap/pm/tables";
import { useEffect } from "react";
import Blockquote from "@tiptap/extension-blockquote";
import Paragraph from "@tiptap/extension-paragraph";
import axios from "axios";
import { basicURL } from "./configs";

// 1. 인용구(Blockquote) 인라인 스타일 적용 (기존 스타일 보존)
const CustomBlockquote = Blockquote.extend({
  renderHTML({ HTMLAttributes }) {
    const existingStyle = HTMLAttributes.style || ""; // Tiptap이 넣은 기존 스타일
    return [
      "blockquote",
      {
        ...HTMLAttributes,
        style: `border-left: 4px solid #3b82f6; background-color: #f8fafc; padding: 0.75rem 1rem; margin: 1.25rem 0; border-radius: 0 0.5rem 0.5rem 0; color: #475569; font-style: italic; ${existingStyle}`,
      },
      0,
    ];
  },
});

// 2. 문단(Paragraph) 인라인 스타일 적용 (기존 스타일 보존 - ★정렬 해결 핵심)
const CustomParagraph = Paragraph.extend({
  renderHTML({ HTMLAttributes }) {
    const existingStyle = HTMLAttributes.style || "";
    return [
      "p",
      {
        ...HTMLAttributes,
        style: `min-height: 1.5em; margin: 0; ${existingStyle}`, // 기존 스타일 이어붙이기!
      },
      0,
    ];
  },
});

// 3. 표(Table) 최상위 태그 인라인 스타일 적용
const CustomTable = Table.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      {
        ...HTMLAttributes,
        style:
          "border-collapse: collapse; table-layout: fixed; width: 100%; margin: 30px 0; overflow: hidden;",
      },
      ["tbody", 0],
    ];
  },
});

// 4. 셀 서식(배경색, 정렬 등)과 기본 테두리를 융합하는 공통 로직
const cellFormattingAttributes = {
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor || null,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) return {};
          return { "data-bg": attributes.backgroundColor }; // 렌더링 시 사용할 임시 속성
        },
      },
      textAlign: {
        default: null,
        parseHTML: (element) => element.style.textAlign || null,
        renderHTML: (attributes) => {
          if (!attributes.textAlign) return {};
          return { "data-align": attributes.textAlign };
        },
      },

      // 2. 세로 정렬 (Vertical Align)
      verticalAlign: {
        default: "top", // 기본은 위쪽 맞춤
        parseHTML: (element) => element.style.verticalAlign || "top",
        renderHTML: (attributes) => {
          if (!attributes.verticalAlign || attributes.verticalAlign === "top")
            return {};
          return { style: `vertical-align: ${attributes.verticalAlign}` };
        },
      },
    };
  },
};

const CustomTableCell = TableCell.extend(cellFormattingAttributes).extend({
  renderHTML({ HTMLAttributes }) {
    const bg = HTMLAttributes["data-bg"]
      ? `background-color: ${HTMLAttributes["data-bg"]};`
      : "";
    const align = HTMLAttributes["data-align"]
      ? `text-align: ${HTMLAttributes["data-align"]};`
      : "";
    const existingStyle = HTMLAttributes.style || "";

    // 임시 속성 제거
    delete HTMLAttributes["data-bg"];
    delete HTMLAttributes["data-align"];

    return [
      "td",
      {
        ...HTMLAttributes,
        style: `min-width: 1em; border: 1px solid #ced4da; padding: 5px; vertical-align: middle; box-sizing: border-box; height: 60px; ${bg} ${align} ${existingStyle}`,
      },
      0,
    ];
  },
});

// 6. 헤더 셀(th) 인라인 스타일 적용
const CustomTableHeader = TableHeader.extend(cellFormattingAttributes).extend({
  renderHTML({ HTMLAttributes }) {
    const bg = HTMLAttributes["data-bg"]
      ? `background-color: ${HTMLAttributes["data-bg"]};`
      : "background-color: #f8f9fa;";
    const align = HTMLAttributes["data-align"]
      ? `text-align: ${HTMLAttributes["data-align"]};`
      : "text-align: left;";
    const existingStyle = HTMLAttributes.style || "";

    delete HTMLAttributes["data-bg"];
    delete HTMLAttributes["data-align"];

    return [
      "th",
      {
        ...HTMLAttributes,
        style: `min-width: 1em; border: 1px solid #ced4da; padding: 5px; vertical-align: middle; box-sizing: border-box; height: 60px; font-weight: bold; ${bg} ${align} ${existingStyle}`,
      },
      0,
    ];
  },
});

const TableSelectionGuard = Extension.create({
  name: "tableSelectionGuard",

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("tableSelectionGuardPlugin"),
        props: {
          handleDOMEvents: {
            mousedown: (view, event) => {
              if (event.button === 2) {
                const { selection } = view.state;
                if (selection instanceof CellSelection) {
                  event.preventDefault();
                  event.stopPropagation();
                  return true;
                }
              }
              return false;
            },
            contextmenu: (view, event) => {
              const { selection } = view.state;
              if (selection instanceof CellSelection) {
                event.preventDefault();
                return true;
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});

export const useEditorCore = ({ content, onChange, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        blockquote: false,
        paragraph: false,
      }),
      Underline,
      Highlight.configure({ multicolor: true }),
      TextStyle,
      FontSize,
      Color,
      Placeholder.configure({
        placeholder: placeholder || "내용을 입력해 주세요...",
        emptyEditorClass: "is-editor-empty",
      }),
      CustomImage.configure({ inline: false, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CustomTable.configure({ resizable: true }),
      TableRow,
      CustomBlockquote,
      CustomParagraph,
      CustomTableHeader,
      CustomTableCell,

      TableSelectionGuard,
    ],

    content,
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML());

      requestAnimationFrame(() => {
        const scrollContainer = document.querySelector(".editor-content-area");

        if (scrollContainer) {
          const { selection } = editor.state;
          const isEditingAtEnd =
            selection.to >= editor.state.doc.content.size - 2;

          if (isEditingAtEnd) {
            scrollContainer.scrollTo({
              top: scrollContainer.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      });
    },

    editorProps: {
      handleDrop(view, event) {
        if (
          event.dataTransfer?.files?.length &&
          !event.dataTransfer.getData("text/plain")
        ) {
          const imageFiles = Array.from(event.dataTransfer.files).filter(
            (file) => file.type.includes("image/"),
          );

          if (imageFiles.length > 0) {
            event.preventDefault();

            const coords = view.posAtCoords({
              left: event.clientX,
              top: event.clientY,
            });
            const insertPos = coords ? coords.pos : view.state.selection.from;

            (async () => {
              try {
                const uploadPromises = imageFiles.map(async (file) => {
                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await axios.post(
                    `${basicURL}/API/ITInfra/EditorImage/upload`,
                    formData,
                  );

                  return response.data.url;
                });

                const imageUrls = await Promise.all(uploadPromises);

                const { schema } = view.state;
                const nodes = imageUrls.map((url) =>
                  schema.nodes.image.create({ src: url }),
                );

                const tr = view.state.tr.insert(insertPos, nodes);
                view.dispatch(tr);
              } catch (error) {
                console.error("드롭 이미지 업로드 실패:", error);
              }
            })();

            return true;
          }
        }
        return false;
      },

      handlePaste(view, event) {
        const items = event.clipboardData?.items;
        if (!items) return false;

        const imageItems = Array.from(items).filter((item) =>
          item.type.includes("image/"),
        );

        if (imageItems.length > 0) {
          event.preventDefault();

          (async () => {
            try {
              const uploadPromises = imageItems.map(async (item) => {
                const file = item.getAsFile();
                if (!file) return null;

                const formData = new FormData();
                formData.append("file", file);

                const response = await axios.post(
                  `${basicURL}/API/ITInfra/EditorImage/upload`,
                  formData,
                );

                return response.data.url;
              });

              const imageUrls = (await Promise.all(uploadPromises)).filter(
                Boolean,
              );

              const { schema } = view.state;
              const nodes = imageUrls.map((url) =>
                schema.nodes.image.create({ src: url }),
              );

              if (nodes.length > 0) {
                const tr = view.state.tr
                  .deleteSelection()
                  .insert(view.state.selection.from, nodes);

                view.dispatch(tr);
              }
            } catch (error) {
              console.error("붙여넣기 이미지 업로드 실패:", error);
            }
          })();

          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const currentEditorContent = editor.getHTML();

    const isEditorEmpty =
      currentEditorContent === "<p></p>" || currentEditorContent === "";
    const isContentEmpty =
      content === "" || content === null || content === undefined;

    if (content !== currentEditorContent) {
      if (isContentEmpty && !isEditorEmpty) {
        editor.commands.clearContent(true);
      } else if (!isContentEmpty) {
        editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  useNativeImageSelection(editor);
  return editor;
};
