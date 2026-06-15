import React from "react";
import styled, { keyframes } from "styled-components";
import { X } from "lucide-react";
import { theme } from "../../../Style/MainStyle";

export default function ModalLayout({
  isOpen,
  onClose,
  maxWidth = "540px",
  titleZone,
  children,
}) {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          {titleZone}
          <CloseButton onClick={onClose} type="button">
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalBackdrop>
  );
}

const fadeIn = keyframes` from { opacity: 0; } to { opacity: 1; } `;
const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${() => theme.shadows.backdrop || "rgba(15, 23, 42, 0.3)"};
  backdrop-filter: blur(4px);
  z-index: 10000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  background: ${() => theme.colors.white};
  border-radius: 20px;
  box-shadow: ${() => theme.shadows.modal};
  overflow: hidden;
  font-family: sans-serif;
  animation: ${slideUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  padding: 24px 28px;
  border-bottom: 1px solid ${() => theme.colors.borderLight};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(180deg, #fff 0%, ${() => theme.colors.bg} 100%);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${() => theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  &:hover {
    color: ${() => theme.colors.textMain};
    background-color: ${() => theme.colors.borderLight};
  }
`;
