import React from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../../../Style/MainStyle";
import {
  Edit3,
  MessageSquare,
  Trash2,
  UserPlus,
  Wrench,
  RefreshCw,
} from "lucide-react";

const MouseContext = ({ menuRef, contextMenu, handleMenuAction }) => {
  return (
    <ContextMenuContainer
      ref={menuRef}
      style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
    >
      <MenuSectionTitle>자산 제어 ({contextMenu.asset.id})</MenuSectionTitle>
      <MenuItem onClick={() => handleMenuAction("edit", contextMenu.asset)}>
        <Edit3 size={14} /> <span>항목 정보 수정</span>
      </MenuItem>
      <MenuItem
        onClick={() => handleMenuAction("change-user", contextMenu.asset)}
      >
        <UserPlus size={14} /> <span>사용자/소유 변경</span>
      </MenuItem>

      {/* 🚀 [신규 추가]: 기기 운영 상태 원클릭 스위치 메뉴 */}
      <MenuItem onClick={() => handleMenuAction("status", contextMenu.asset)}>
        <RefreshCw size={14} />
        <span>상태 변경 및 메모 추가</span>
      </MenuItem>

      <MenuDivider />
      <MenuSectionTitle>이력 및 대시보드 추가</MenuSectionTitle>
      <MenuItem onClick={() => handleMenuAction("repair", contextMenu.asset)}>
        <Wrench size={14} /> <span>하드웨어 수리 이력 추가</span>
      </MenuItem>
      <MenuItem onClick={() => handleMenuAction("software", contextMenu.asset)}>
        <MessageSquare size={14} /> <span>소프트웨어 대응 로그 작성</span>
      </MenuItem>

      <MenuDivider />
      <MenuItem
        className="delete"
        onClick={() => handleMenuAction("delete", contextMenu.asset)}
      >
        <Trash2 size={14} /> <span>자산 삭제 및 폐기</span>
      </MenuItem>
    </ContextMenuContainer>
  );
};

const menuScale = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const ContextMenuContainer = styled.div`
  position: fixed;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  padding: 6px;
  width: 210px;
  box-shadow: ${() => theme.shadows.context};
  z-index: 9999;
  transform-origin: top left;
  animation: ${menuScale} 0.15s cubic-bezier(0.16, 1, 0.3, 1);
`;

const MenuSectionTitle = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: ${() => theme.colors.textMuted};
  padding: 6px 10px 4px 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  font-size: 13px;
  font-weight: 500;
  color: ${() => theme.colors.textSub};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover {
    background-color: ${() => theme.colors.primaryLight};
    color: ${() => theme.colors.primary};
  }

  &.delete:hover {
    background-color: ${() => theme.colors.errorBg};
    color: ${() => theme.colors.error};
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${() => theme.colors.borderLight};
  margin: 6px 4px;
`;

export default MouseContext;
