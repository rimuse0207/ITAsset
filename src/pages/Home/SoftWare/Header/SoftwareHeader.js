import React from "react";

import { Plus } from "lucide-react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";

const SoftwareHeader = ({ title, subTitle, onModalOpen, isButton = true }) => {
  return (
    <PanelHeader>
      <div>
        <PanelTitle>{title}</PanelTitle>
        <PanelSubtitle>{subTitle}</PanelSubtitle>
      </div>
      {isButton && (
        <IconButton onClick={() => onModalOpen()}>
          <Plus size={16} />
        </IconButton>
      )}
    </PanelHeader>
  );
};

export const PanelHeader = styled.div`
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.border-bottom {
    border-bottom: 1px solid ${() => theme.colors.borderLight};
  }
`;
export const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  margin: 0;
`;
export const PanelSubtitle = styled.p`
  font-size: 12px;
  color: ${() => theme.colors.textMuted};
  margin-top: 2px;
`;

const IconButton = styled.button`
  background: ${() => theme.colors.white};
  border: 1px solid ${() => theme.colors.border};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  color: ${() => theme.colors.textSub};
`;

export default SoftwareHeader;
