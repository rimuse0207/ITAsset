/* ─── src/pages/Home/HardWare/Modals/public/ModalStyle.js 내용을 이걸로 교체하세요 ─── */
import styled, { keyframes } from "styled-components";
import { theme } from "../../../Style/MainStyle";

// ─── 1. 기본 폼 & 레이아웃 요소 ───
export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const FormBody = styled.div`
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-height: 70vh;
  overflow-y: auto;
`;

export const ModalBody = FormBody;

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

export const SectionLabel = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${() => theme.colors.textSub};
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  .required {
    color: ${() => theme.colors.error || "#ef4444"};
  }
`;

// ─── 2. 그리드 및 인풋 데코레이터 ───
export const Grid = styled.div`
  display: grid;
  grid-template-cols: repeat(2, minmax(0, 1fr));
  gap: 16px;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  &.full-width {
    grid-column: span 2;
  }
`;
export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%; /* 부모 너비를 꽉 채우도록 설정 */

  .input-icon {
    position: absolute;
    left: 14px;
    color: #94a3b8; /* theme.colors.textMuted 대용 컬러 */
    z-index: 2; /* 아이콘이 위로 올라오도록 조치 */
  }
`;
export const Input = styled.input`
  width: 100%;
  padding: 10px 14px;
  padding-left: ${(props) =>
    props.name?.startsWith("spec") ? "12px" : "38px"};
  border: 1px solid ${() => theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  box-sizing: border-box;
  color: ${() => theme.colors.textMain};
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
    box-shadow: ${() => theme.shadows.inputFocus};
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 10px 14px 10px 38px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${() => theme.colors.textSub};
  background-color: #fff;
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  box-sizing: border-box;
  line-height: 1.5;
  color: ${() => theme.colors.textMain};
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
    box-shadow: ${() => theme.shadows.inputFocus};
  }
`;

// ─── 3. 하드웨어 미니 스펙 행 그리드 ───
export const SpecRowGrid = styled.div`
  display: grid;
  grid-template-cols: repeat(3, minmax(0, 1fr));
  gap: 12px;
  background: #fafafa;
  padding: 12px;
  border-radius: 10px;
  margin-top: 14px;
`;

export const MiniInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

// ─── 4. 📊 엑셀 스타일 일괄 등록 테이블 요소 ───
export const BulkTableHeader = styled.div`
  display: flex;
  background: ${() => theme.colors.bg};
  padding: 10px 14px;
  border-radius: 8px 8px 0 0;
  border: 1px solid ${() => theme.colors.border};
  border-bottom: none;
  font-size: 12px;
  font-weight: 600;
  color: ${() => theme.colors.textSub};
  .col-user {
    width: 35%;
    padding-left: 24px;
  }
  .col-serial {
    width: 35%;
    padding-left: 14px;
  }
  .col-memo {
    width: 25%;
  }
  .col-action {
    width: 5%;
    text-align: center;
  }
`;

export const BulkTableBody = styled.div`
  border: 1px solid ${() => theme.colors.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
  background: #fff;
`;

export const BulkRow = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 14px;
  border-top: 1px solid ${() => theme.colors.borderLight};
  position: relative;
  .col-index {
    position: absolute;
    left: 6px;
    font-size: 11px;
    font-weight: 700;
    color: ${() => theme.colors.textMuted};
    font-family: monospace;
  }
  .col-user {
    width: 35%;
    display: flex;
    align-items: center;
    position: relative;
    .row-icon {
      position: absolute;
      left: 10px;
      color: ${() => theme.colors.textMuted};
    }
  }
  .col-memo {
    width: 25%;
    display: flex;
    justify-content: center;
    position: relative;
    .row-icon {
      position: absolute;
      left: 10px;
      color: ${() => theme.colors.textMuted};
    }
  }
  .col-serial {
    width: 35%;
    display: flex;
    align-items: center;
    position: relative;
    .row-icon {
      position: absolute;
      left: 10px;
      color: ${() => theme.colors.textMuted};
    }
  }
  .col-action {
    width: 5%;
    display: flex;
    justify-content: center;
  }
`;

export const RowInput = styled.input`
  width: 92%;
  padding: 8px 10px 8px 30px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  font-size: 13px;
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;

export const RowDeleteButton = styled.button`
  background: none;
  border: none;
  color: ${() => theme.colors.textMuted};
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: ${() => theme.colors.error};
    background: ${() => theme.colors.errorBg};
  }
`;

export const AddRowButton = styled.button`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border: 1px dashed ${() => theme.colors.border};
  background: #fff;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    border-color: ${() => theme.colors.textMuted};
    background-color: ${() => theme.colors.bg};
  }
`;

// ─── 5. 모달 버튼 하단 액션바 ───
export const ModalFooter = styled.div`
  padding: 16px 28px;
  border-top: 1px solid ${() => theme.colors.borderLight};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: ${() => theme.colors.bg};
`;

export const FormFooter = styled.div`
  padding: 20px 32px;
  border-top: 1px solid ${() => theme.colors.borderLight};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background-color: ${() => theme.colors.bg};
`;

export const CancelButton = styled.button`
  padding: 10px 16px;
  border: 1px solid ${() => theme.colors.border};
  background: white;
  border-radius: 8px;
  color: ${() => theme.colors.textSub};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: ${() => theme.colors.borderLight};
  }
`;

export const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 18px;
  border: none;
  background: ${() => theme.colors.primary};
  color: white;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  &:hover {
    background: ${() => theme.colors.primaryHover || "#1d4ed8"};
  }
`;

// ─── 6. 칩(배지) 선택용 컴포넌트 ───
export const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const FilterChip = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  background-color: ${(props) =>
    props.selected ? theme.colors.primaryLight : "#fff"};
  color: ${(props) =>
    props.selected ? theme.colors.primary : theme.colors.textSub};
  border: 1px solid
    ${(props) => (props.selected ? theme.colors.primary : theme.colors.border)};
`;

export const fadeIn = keyframes`
  from { opacity: 0; } to { opacity: 1; }
`;

export const slideUp = keyframes`
  from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;
export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  /* 💥 theme.colors.shadows가 아니라 theme.shadows로 올바르게 수정 */
  background-color: ${() => theme.shadows.backdrop};
  backdrop-filter: blur(4px); /* 뒷 배경 흐리게 처리 */
  z-index: 10000;
  animation: ${fadeIn} 0.2s ease-out;
`;

export const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 720px;
  background: ${() => theme.colors.white};
  border-radius: 20px;
  box-shadow: ${() => theme.shadows.modal};
  overflow: hidden;
  font-family: sans-serif;
  animation: ${slideUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

export const ModalHeader = styled.div`
  padding: 20px 28px;
  border-bottom: 1px solid ${() => theme.colors.borderLight};
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title-zone {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${() => theme.colors.primary};
  }
  .title-icon {
    color: ${() => theme.colors.primary};
  }
`;

export const ModalTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  margin: 0;
`;
export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${() => theme.colors.textMuted};
  cursor: pointer;
  &:hover {
    color: ${() => theme.colors.textMain};
  }
`;

export const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

/* 📅 기간 검색 대칭 정렬 그리드 */
export const DateRangeGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .split-wave {
    font-size: 14px;
    color: ${() => theme.colors.textMuted};
    font-weight: 500;
  }
`;

export const DateInput = styled.input`
  flex: 1;
  padding: 10px 12px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 8px;
  font-size: 13px;
  color: ${() => theme.colors.textSub};
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;

/* 💻 고급 스펙 정밀 서칭 존 */
export const SpecInputGrid = styled.div`
  display: grid;
  grid-template-cols: repeat(2, minmax(0, 1fr));
  gap: 12px;
`;

export const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: ${() => theme.colors.textMuted};
  cursor: pointer;
  &:hover {
    color: ${() => theme.colors.textMain};
  }
`;
