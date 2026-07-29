// src/components/common/Editor/EditorToolbar.jsx
import React, { useRef, useState, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  Quote,
  Undo,
  Redo,
  ImageIcon,
  Link as LinkIcon,
  Type,
  Highlighter,
  TableIcon,
  Columns,
  Rows,
  Trash2,
  Eraser,
} from "lucide-react";
import { COLOR_PALETTE } from "./utils/basicColor";
import axios from "axios";
import { basicURL } from "./configs/index";

export const EditorToolbar = ({ editor }) => {
  const fileInputRef = useRef(null);

  // ★ 팝업 상태 관리 (색상 피커 & 표 생성기 통합)
  const [activePopup, setActivePopup] = useState(null); // 'text', 'highlight', 'table', 'tableCreate'
  const toolbarRef = useRef(null);

  // ★ 표 생성기 마우스 호버 상태 관리
  const [hoveredTable, setHoveredTable] = useState({ rows: 0, cols: 0 });

  // 툴바 외부 클릭 시 모든 팝업 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        setActivePopup(null);
        setHoveredTable({ rows: 0, cols: 0 }); // 팝업 닫힐 때 초기화
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!editor) return null;

  const getCurrentTextStyle = () => {
    if (editor.isActive("heading", { level: 1 })) return "h1";
    if (editor.isActive("heading", { level: 2 })) return "h2";
    if (editor.isActive("heading", { level: 3 })) return "h3";
    return "p";
  };

  const handleTextStyleChange = (e) => {
    const value = e.target.value;
    if (value === "p") {
      editor.chain().focus().setParagraph().run();
    } else {
      const level = parseInt(value.replace("h", ""), 10);
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  const getCurrentFontSize = () => {
    return editor.getAttributes("textStyle")?.fontSize || "16px";
  };

  const handleFontSizeChange = (e) => {
    const size = e.target.value;
    editor.chain().focus().setFontSize(size).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("연결할 URL을 입력하세요", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter((file) => file.type.includes("image/"));

    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `${basicURL}/API/ITInfra/EditorImage/upload`,
          formData,
        );

        return response.data.url;
      });

      const imageUrls = await Promise.all(uploadPromises);

      const imageNodes = imageUrls.map((url) => ({
        type: "image",
        attrs: { src: url },
      }));

      editor.chain().focus().insertContent(imageNodes).run();
    } catch (error) {
      console.error("다중 업로드 실패:", error);
    }

    e.target.value = "";
  };

  // 색상 선택 처리
  const handleColorSelect = (color) => {
    if (activePopup === "text") {
      editor.chain().focus().setColor(color).run();
    } else if (activePopup === "highlight") {
      editor.chain().focus().setHighlight({ color }).run();
    } else if (activePopup === "table") {
      editor.chain().focus().setCellAttribute("backgroundColor", color).run();
    }
    setActivePopup(null);
  };

  // 색상 초기화 처리
  const handleColorClear = () => {
    if (activePopup === "text") {
      editor.chain().focus().unsetColor().run();
    } else if (activePopup === "highlight") {
      editor.chain().focus().unsetHighlight().run();
    } else if (activePopup === "table") {
      editor.chain().focus().setCellAttribute("backgroundColor", null).run();
    }
    setActivePopup(null);
  };

  // ★ 표 생성 처리
  const handleCreateTable = (rows, cols) => {
    if (rows > 0 && cols > 0) {
      editor
        .chain()
        .focus()
        .insertTable({ rows, cols, withHeaderRow: false })
        .run();
      setActivePopup(null);
      setHoveredTable({ rows: 0, cols: 0 });
    }
  };

  return (
    // ★ 전체 툴바에 ref를 걸어서 어디든 밖을 클릭하면 팝업이 닫히게 설정
    <div className="editor-toolbar" ref={toolbarRef}>
      {/* 1. 단락 선택 */}
      <select
        value={getCurrentTextStyle()}
        onChange={handleTextStyleChange}
        className="toolbar-select"
      >
        <option value="p">본문</option>
        <option value="h1">제목 1</option>
        <option value="h2">제목 2</option>
        <option value="h3">제목 3</option>
      </select>

      <div className="toolbar-divider" />

      {/* 2. 폰트 크기 선택 */}
      <select
        value={getCurrentFontSize()}
        onChange={handleFontSizeChange}
        className="toolbar-select font-size-select"
      >
        <option value="12px">12px</option>
        <option value="14px">14px</option>
        <option value="16px">16px (기본)</option>
        <option value="18px">18px</option>
        <option value="20px">20px</option>
        <option value="24px">24px</option>
        <option value="30px">30px</option>
      </select>

      <div className="toolbar-divider" />

      {/* 3. 컬러 피커 그룹 */}
      <div className="toolbar-btn-group" style={{ position: "relative" }}>
        <button
          type="button"
          className="toolbar-btn"
          title="글자 색상"
          onClick={() => setActivePopup(activePopup === "text" ? null : "text")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            backgroundColor: activePopup === "text" ? "#f3f4f6" : "transparent",
          }}
        >
          <Type size={16} strokeWidth={2.5} color="#374151" />
          <div
            style={{
              width: "16px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor:
                editor.getAttributes("textStyle").color || "#000000",
            }}
          />
        </button>

        <button
          type="button"
          className="toolbar-btn"
          title="배경 형광펜"
          onClick={() =>
            setActivePopup(activePopup === "highlight" ? null : "highlight")
          }
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            backgroundColor:
              activePopup === "highlight" ? "#f3f4f6" : "transparent",
          }}
        >
          <Highlighter size={16} strokeWidth={2.5} color="#374151" />
          <div
            style={{
              width: "16px",
              height: "4px",
              borderRadius: "2px",
              backgroundColor:
                editor.getAttributes("highlight").color || "#ffff00",
            }}
          />
        </button>

        {/* 컬러 피커 팝업 */}
        {(activePopup === "text" ||
          activePopup === "highlight" ||
          activePopup === "table") && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              marginTop: "8px",
              zIndex: 9999,
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              padding: "10px",
              width: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 4px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#6b7280",
                }}
              >
                {activePopup === "text"
                  ? "글자 색상"
                  : activePopup === "highlight"
                    ? "형광펜 색상"
                    : "표 배경색"}
              </span>
              <button
                type="button"
                onClick={handleColorClear}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "11px",
                  color: "#6b7280",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <Eraser size={12} /> 색상 지우기
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: "4px",
              }}
            >
              {COLOR_PALETTE.map((color) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  title={color}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    backgroundColor: color,
                    borderRadius: "4px",
                    border: "1px solid rgba(0,0,0,0.1)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="toolbar-divider" />

      {/* 4. 기본 텍스트 포맷 */}
      <div className="toolbar-btn-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`toolbar-btn ${editor.isActive("bold") ? "active" : ""}`}
        >
          <Bold size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`toolbar-btn ${editor.isActive("italic") ? "active" : ""}`}
        >
          <Italic size={16} strokeWidth={2.5} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`toolbar-btn ${editor.isActive("underline") ? "active" : ""}`}
        >
          <Underline size={16} strokeWidth={2.5} />
        </button>
      </div>

      <div className="toolbar-divider" />

      {/* 5. 미디어 및 기타 */}
      <div className="toolbar-btn-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`toolbar-btn ${editor.isActive("blockquote") ? "active" : ""}`}
        >
          <Quote size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`toolbar-btn ${editor.isActive("link") ? "active" : ""}`}
          title="링크 삽입"
        >
          <LinkIcon size={16} strokeWidth={2} />
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="toolbar-btn"
          title="이미지 첨부"
        >
          <ImageIcon size={16} strokeWidth={2} />
        </button>

        {/* ★ 표 생성 버튼 (10x10 그리드) */}
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={() =>
              setActivePopup(
                activePopup === "tableCreate" ? null : "tableCreate",
              )
            }
            className="toolbar-btn"
            title="표 삽입"
            style={{
              backgroundColor:
                activePopup === "tableCreate" ? "#f3f4f6" : "transparent",
            }}
          >
            <TableIcon size={16} strokeWidth={2} />
          </button>

          {/* 표 생성기 10x10 그리드 팝업 */}
          {activePopup === "tableCreate" && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                marginTop: "8px",
                zIndex: 9999,
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                padding: "12px",
                width: "max-content",
              }}
              onMouseLeave={() => setHoveredTable({ rows: 0, cols: 0 })}
            >
              <div
                style={{
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  textAlign: "center",
                }}
              >
                {hoveredTable.rows > 0 && hoveredTable.cols > 0
                  ? `${hoveredTable.cols} x ${hoveredTable.rows} 표`
                  : "표 삽입"}
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(10, 14px)",
                  gap: "2px",
                }}
              >
                {/* 10x10 반복 생성 */}
                {Array.from({ length: 10 }).map((_, rowIndex) =>
                  Array.from({ length: 10 }).map((_, colIndex) => {
                    const isHovered =
                      rowIndex < hoveredTable.rows &&
                      colIndex < hoveredTable.cols;
                    return (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        onMouseEnter={() =>
                          setHoveredTable({
                            rows: rowIndex + 1,
                            cols: colIndex + 1,
                          })
                        }
                        onClick={() =>
                          handleCreateTable(
                            hoveredTable.rows,
                            hoveredTable.cols,
                          )
                        }
                        style={{
                          width: "14px",
                          height: "14px",
                          backgroundColor: isHovered ? "#bfdbfe" : "#f3f4f6", // 파란색(선택됨) or 회색(기본)
                          border: isHovered
                            ? "1px solid #3b82f6"
                            : "1px solid #e5e7eb",
                          cursor: "pointer",
                          borderRadius: "2px",
                        }}
                      />
                    );
                  }),
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* 6. Undo/Redo */}
      <div className="toolbar-btn-group">
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="toolbar-btn text-gray-400"
        >
          <Undo size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="toolbar-btn text-gray-400"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* 7. 표 관리 툴바 */}
      {editor.isActive("table") && (
        <>
          <div className="toolbar-divider" />
          <div className="toolbar-btn-group bg-blue-50 rounded p-1">
            <button
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="toolbar-btn text-blue-600"
              title="우측에 열 추가"
            >
              <Columns size={16} />+
            </button>
            <button
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="toolbar-btn text-red-500"
              title="열 삭제"
            >
              <Columns size={16} />-
            </button>
            <button
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="toolbar-btn text-blue-600 ml-2"
              title="아래에 행 추가"
            >
              <Rows size={16} />+
            </button>
            <button
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="toolbar-btn text-red-500"
              title="행 삭제"
            >
              <Rows size={16} />-
            </button>
            <button
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="toolbar-btn text-red-600 ml-2"
              title="표 전체 삭제"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <button
            type="button"
            className="toolbar-btn ml-2"
            title="표 배경색"
            onClick={() =>
              setActivePopup(activePopup === "table" ? null : "table")
            }
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#e2e8f0",
                border: "1px solid #cbd5e1",
              }}
            />
          </button>
        </>
      )}
    </div>
  );
};
