// src/components/common/Editor/extensions/TableContextMenu.jsx
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Columns,
  Rows,
  Trash2,
  Combine,
  SplitSquareHorizontal,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  LayoutGrid,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Eraser,
} from "lucide-react";
const CELL_BG_COLORS = [
  "#fef2f2",
  "#fffbeb",
  "#f0fdf4",
  "#eff6ff",
  "#f5f3ff",
  "#f3f4f6",
];

export const TableContextMenu = ({ editor }) => {
  const [menuState, setMenuState] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!editor || !editor.view) return;

    const editorDom = editor.view.dom;

    const handleContextMenu = (e) => {
      if (e.target.closest("table")) {
        e.preventDefault();

        let safeX = e.clientX;
        let safeY = e.clientY;

        if (safeX + 220 > window.innerWidth) safeX = window.innerWidth - 220;
        if (safeY + 380 > window.innerHeight) safeY = window.innerHeight - 380;

        setMenuState({
          visible: true,
          x: safeX,
          y: safeY,
        });
      }
    };

    editorDom.addEventListener("contextmenu", handleContextMenu);
    return () =>
      editorDom.removeEventListener("contextmenu", handleContextMenu);
  }, [editor]);

  useEffect(() => {
    const closeMenu = () =>
      setMenuState((prev) => ({ ...prev, visible: false }));

    if (menuState.visible) {
      // ★ click을 mousedown으로 변경!
      document.addEventListener("mousedown", closeMenu);
      window.addEventListener("scroll", closeMenu, true);
    }

    return () => {
      // ★ 여기도 mousedown으로 변경!
      document.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("scroll", closeMenu, true);
    };
  }, [menuState.visible]);

  if (!menuState.visible) return null;

  // 섹션 제목 템플릿
  const MenuSection = ({ title, icon: Icon }) => (
    <div className="table-context-menu-section">
      {Icon && <Icon size={12} />}
      {title}
    </div>
  );

  // 클래스 기반의 메뉴 버튼 템플릿
  const MenuButton = ({ icon: Icon, label, onClick, danger = false }) => (
    <button
      type="button"
      className={`table-context-menu-btn ${danger ? "btn-danger" : "btn-normal"}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        setMenuState((prev) => ({ ...prev, visible: false }));
      }}
    >
      <span className="table-context-menu-btn-content">
        <Icon size={14} className={danger ? "icon-danger" : "icon-default"} />
        {label}
      </span>
    </button>
  );

  return createPortal(
    <div
      className="table-context-menu-popup"
      style={{
        // 팝업 위치만큼은 동적 마우스 좌표여야 하므로 인라인 유지
        top: `${menuState.y}px`,
        left: `${menuState.x}px`,
        zIndex: 999999,
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 열 관리 */}
      <MenuSection title="열 관리" icon={Columns} />
      <MenuButton
        icon={ArrowLeft}
        label="왼쪽에 추가"
        onClick={() => editor.chain().focus().addColumnBefore().run()}
      />
      <MenuButton
        icon={ArrowRight}
        label="오른쪽에 추가"
        onClick={() => editor.chain().focus().addColumnAfter().run()}
      />
      <MenuButton
        icon={Trash2}
        label="열 삭제"
        onClick={() => editor.chain().focus().deleteColumn().run()}
        danger
      />

      <div className="table-context-menu-divider" />

      {/* 행 관리 */}
      <MenuSection title="행 관리" icon={Rows} />
      <MenuButton
        icon={ArrowUp}
        label="위쪽에 추가"
        onClick={() => editor.chain().focus().addRowBefore().run()}
      />
      <MenuButton
        icon={ArrowDown}
        label="아래쪽에 추가"
        onClick={() => editor.chain().focus().addRowAfter().run()}
      />
      <MenuButton
        icon={Trash2}
        label="행 삭제"
        onClick={() => editor.chain().focus().deleteRow().run()}
        danger
      />

      <div className="table-context-menu-divider" />

      {/* 셀 및 표 관리 */}
      <MenuSection title="셀 및 표" icon={LayoutGrid} />
      <MenuButton
        icon={Combine}
        label="셀 병합"
        onClick={() => editor.chain().focus().mergeCells().run()}
      />
      <MenuButton
        icon={SplitSquareHorizontal}
        label="셀 분할"
        onClick={() => editor.chain().focus().splitCell().run()}
      />
      <MenuButton
        icon={Table}
        label="표 전체 삭제"
        onClick={() => editor.chain().focus().deleteTable().run()}
        danger
      />
      <MenuSection title="스타일 및 정렬" icon={Palette} />

      {/* 1. 글자 정렬 버튼 3종 세트 (가로로 배치) */}
      <div style={{ display: "flex", gap: "4px", padding: "4px 8px" }}>
        <button
          type="button"
          className="table-context-menu-btn btn-normal"
          style={{ justifyContent: "center", padding: "6px" }}
          onClick={(e) => {
            e.stopPropagation();
            editor.chain().focus().setTextAlign("left").run();
            setMenuState((prev) => ({ ...prev, visible: false }));
          }}
          title="왼쪽 정렬"
        >
          <AlignLeft size={16} className="icon-default" />
        </button>
        <button
          type="button"
          className="table-context-menu-btn btn-normal"
          style={{ justifyContent: "center", padding: "6px" }}
          onClick={(e) => {
            e.stopPropagation();
            editor.chain().focus().setTextAlign("center").run();
            setMenuState((prev) => ({ ...prev, visible: false }));
          }}
          title="가운데 정렬"
        >
          <AlignCenter size={16} className="icon-default" />
        </button>
        <button
          type="button"
          className="table-context-menu-btn btn-normal"
          style={{ justifyContent: "center", padding: "6px" }}
          onClick={(e) => {
            e.stopPropagation();
            editor.chain().focus().setTextAlign("right").run();
            setMenuState((prev) => ({ ...prev, visible: false }));
          }}
          title="오른쪽 정렬"
        >
          <AlignRight size={16} className="icon-default" />
        </button>
      </div>

      {/* 2. 셀 배경색 팔레트 (가로로 나열) */}
      <div
        style={{
          display: "flex",
          gap: "6px",
          padding: "6px 8px 8px 8px",
          flexWrap: "wrap",
        }}
      >
        {/* 색상 초기화(투명) 버튼 */}
        <button
          type="button"
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "4px",
            border: "1px solid #d1d5db",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fff",
            cursor: "pointer",
          }}
          onClick={(e) => {
            e.stopPropagation();
            // setCellAttribute는 현재 선택된 노드(셀)의 속성을 바꿉니다.
            editor
              .chain()
              .focus()
              .setCellAttribute("backgroundColor", null)
              .run();
            setMenuState((prev) => ({ ...prev, visible: false }));
          }}
          title="배경색 지우기"
        >
          <Eraser size={12} color="#9ca3af" />
        </button>
      </div>
    </div>,

    document.body,
  );
};
