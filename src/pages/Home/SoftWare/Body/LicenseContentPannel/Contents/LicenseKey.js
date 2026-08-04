import React, { useEffect } from "react";
import styled from "styled-components";
import {
  Key,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Edit3,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { theme } from "../../../../Style/MainStyle";
import {
  SectionAddButton,
  SectionBlock,
  SectionHeaderZone,
  SectionTitle,
  TableActionButton,
} from "../LicenseContentPannel";

const LicenseKey = ({ selectedVersion, onAction }) => {
  const handleKeyClickTrigger = (keyObj) => {
    if (!onAction) return;
    onAction("VIEW_VERIFY", "VIEW_VERIFY", keyObj);
  };

  return (
    <SectionBlock>
      <SectionHeaderZone>
        <SectionTitle>
          <Key size={15} /> 라이선스 시리얼 번호
        </SectionTitle>

        <SectionAddButton
          onClick={() => onAction && onAction("REGISTER", "KEY")}
        >
          <Plus size={12} /> 제품키 추가
        </SectionAddButton>
      </SectionHeaderZone>

      <KeyStackContainer>
        {/* 안내 가이드 배지 바 상시 노출 */}
        <KeyControlHeader>
          <InfoBadge>
            <AlertCircle size={11} /> 제품키 카드를 클릭하면 자산 배정 및 복호화
            승인 창이 열립니다.
          </InfoBadge>
        </KeyControlHeader>

        {/* 라이선스 키 배열 검증 및 목록 출력 */}
        {!selectedVersion?.licenseKeys ||
        selectedVersion.licenseKeys.length === 0 ? (
          <EmptyBufferZone>
            <ShieldAlert size={14} /> 제품 인증 시리얼이 비어있습니다. 우측 상단
            단추를 통해 키를 등록하세요.
          </EmptyBufferZone>
        ) : (
          selectedVersion.licenseKeys.map((keyObj, kIdx) => {
            console.log(keyObj);
            const isThisKeyRevealed = keyObj.viewUnlocked === true;

            return (
              <KeyRowCard
                key={kIdx}
                isRevealed={isThisKeyRevealed}
                onClick={() =>
                  !isThisKeyRevealed && handleKeyClickTrigger(keyObj)
                }
                title={
                  isThisKeyRevealed
                    ? "복호화 완료된 정품 키입니다."
                    : "클릭하여 지급 자산 배정 및 시리얼 확인 절차를 진행하세요."
                }
              >
                <div className="key-meta-info">
                  <span className="key-tag-badge">
                    {keyObj.keyType || "볼륨키"}
                  </span>
                  <span className="key-desc-text">
                    {keyObj.description || "사내 배포 공용 인증 세트"}
                  </span>
                </div>

                <KeyStringBox isRevealed={isThisKeyRevealed}>
                  {isThisKeyRevealed
                    ? keyObj.keyStr
                    : "••••• - ••••• - ••••• - ••••• - •••••"}
                </KeyStringBox>

                <RowActionOverlay onClick={(e) => e.stopPropagation()}>
                  <TableActionButton
                    title="제품 키 사양 수정"
                    onClick={() => {
                      if (!isThisKeyRevealed) {
                        alert("복호화를 진행 한 이후에 가능합니다.");
                        return;
                      }
                      onAction && onAction("EDIT", "KEY", keyObj);
                    }}
                  >
                    <Edit3 size={13} />
                  </TableActionButton>
                  <TableActionButton
                    title="영구 파기"
                    className="danger"
                    onClick={() =>
                      onAction && onAction("DELETE", "KEY", keyObj)
                    }
                  >
                    <Trash2 size={13} />
                  </TableActionButton>
                </RowActionOverlay>
              </KeyRowCard>
            );
          })
        )}
      </KeyStackContainer>
    </SectionBlock>
  );
};

const RowActionOverlay = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: translateX(8px);
  transition: all 0.15s ease-in-out;
`;

const KeyStackContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid ${() => theme.colors.borderLight};
  border-radius: 14px;
  padding: 16px;
  background: #fff;
`;

const KeyControlHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid ${() => theme.colors.borderLight};
  margin-bottom: 4px;

  .success-tag {
    font-size: 11px;
    font-weight: 700;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  background-color: #f1f5f9;
  padding: 4px 10px;
  border-radius: 6px;
`;

const EmptyBufferZone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 24px;
  font-size: 11.5px;
  color: ${() => theme.colors.textMuted};
  font-weight: 500;
`;

const KeyRowCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 8px;
  box-sizing: border-box;

  background: ${(props) => (props.isRevealed ? "#ffffff" : "#f8fafc")};
  border: 1px solid ${(props) => (props.isRevealed ? "#bfdbfe" : "#e2e8f0")};
  cursor: ${(props) => (props.isRevealed ? "default" : "pointer")};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  .key-meta-info {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 25%;
  }
  .key-tag-badge {
    font-size: 10px;
    font-weight: 700;
    background: #fff;
    border: 1px solid ${() => theme.colors.border};
    padding: 2px 6px;
    border-radius: 4px;
    color: ${() => theme.colors.textSub};
  }
  .key-desc-text {
    font-size: 11px;
    color: ${() => theme.colors.textMuted};
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &:hover {
    border-color: ${(props) => (props.isRevealed ? "#2563eb" : "#cbd5e1")};
    background: ${(props) => (props.isRevealed ? "#ffffff" : "#f1f5f9")};

    ${RowActionOverlay} {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const KeyStringBox = styled.div`
  flex: 1;
  text-align: center;
  font-family: monospace;
  font-size: 13.5px;
  letter-spacing: 0.03em;
  font-weight: ${(props) => (props.isRevealed ? "700" : "500")};
  color: ${(props) => (props.isRevealed ? "#2563eb" : "#94a3b8")};
`;

export default LicenseKey;
