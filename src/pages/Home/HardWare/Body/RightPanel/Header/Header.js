import { X } from "lucide-react";
import React from "react";
import { theme } from "../../../../Style/MainStyle";
import styled from "styled-components";

const Header = ({ selectedAsset, setSelectedAsset }) => {
  return (
    <PanelHeader>
      <div>
        <span className="panel-code">{selectedAsset.id}</span>
        <h2 className="panel-title">{selectedAsset.name}</h2>
      </div>
      <CloseButton onClick={() => setSelectedAsset(null)}>
        <X size={20} />
      </CloseButton>
    </PanelHeader>
  );
};

const PanelHeader = styled.div`
  padding: 28px 32px;
  border-bottom: 1px solid ${() => theme.colors.borderLight};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .panel-code {
    font-family: monospace;
    font-size: 12px;
    font-weight: 700;
    color: ${() => theme.colors.primary};
  }
  .panel-title {
    font-size: 18px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
    margin-top: 2px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${() => theme.colors.textMuted};
  cursor: pointer;
  &:hover {
    color: ${() => theme.colors.textMain};
  }
`;
export default Header;
