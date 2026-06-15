import React, { useEffect } from "react";
import { RefreshCw, Check, AlertCircle, FileText } from "lucide-react";
import ModalLayout from "./public/ModalLayout";
import useModalForm from "../../../../hooks/InfrastructureAsset/Modal/useModalForm";
import * as M from "./public/ModalStyle";
import styled from "styled-components";

export default function AssetStatusModal({
  isOpen,
  onClose,
  targetAsset,
  onSave,
}) {
  // 현재 자산에 실사용자가 매핑되어 있는지 여부 판별
  const hasCurrentHolder =
    targetAsset?.user &&
    targetAsset.user !== "재고" &&
    targetAsset.user !== "-";

  const initialFormState = {
    status: "사용중",
    statusMemo: "",
    isOnlyMemo: false,
  };

  const {
    formData,
    setFormData,
    handleInputChange,
    handleDirectChange,
    handleSubmit,
  } = useModalForm({
    isOpen,
    mode: "edit",
    targetAsset,
    initialFormState,
    onSave,
    onClose,
  });

  useEffect(() => {
    if (isOpen && targetAsset) {
      setFormData({
        status: targetAsset.status || "사용중",
        statusMemo: "",
        isOnlyMemo: false,
      });
    }
  }, [isOpen, targetAsset]);

  // 파란색 톤앤매너 테마 정의
  const statusThemes = {
    사용중: { color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
    재고: { color: "#475569", bg: "#f8fafc", border: "#cbd5e1" },
    고장: { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    수리중: { color: "#0d9488", bg: "#f0fdfa", border: "#ccfbf1" },
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="460px"
      titleZone={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <RefreshCw size={18} style={{ color: "#2563eb" }} />
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
              자산 가동 상태 및 기록 제어
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#2563eb",
                margin: "2px 0 0 0",
                fontFamily: "monospace",
                fontWeight: "700",
              }}
            >
              {targetAsset?.id} · {targetAsset?.name}
            </p>
          </div>
        </div>
      }
    >
      <M.StyledForm
        onSubmit={(e) =>
          handleSubmit(e, (form) => ({
            assetId: targetAsset.id,
            prevStatus: targetAsset.status,
            ...form,
            autoReleaseUser: form.status === "재고" && hasCurrentHolder,
            status: form.isOnlyMemo ? targetAsset.status : form.status,
            actionType: form.isOnlyMemo ? "MEMO_EDIT" : "STATUS_CHANGE",
          }))
        }
      >
        <M.ModalBody style={{ padding: "24px" }}>
          {/* 1. 기능 모드 스위처 탭 */}
          <ModeTabGroup style={{ marginBottom: "20px" }}>
            <TabButton
              type="button"
              active={!formData.isOnlyMemo}
              onClick={() => {
                handleDirectChange("isOnlyMemo", false);
                handleDirectChange("status", targetAsset?.status || "사용중");
              }}
            >
              <RefreshCw size={13} /> 기기 가동 상태 변경
            </TabButton>
            <TabButton
              type="button"
              active={formData.isOnlyMemo}
              onClick={() => handleDirectChange("isOnlyMemo", true)}
            >
              <FileText size={13} /> 기타 특이사항 메모만 추가
            </TabButton>
          </ModeTabGroup>

          {/* 2. 가동 상태 선택 그리드 */}
          <M.FormSection
            style={{
              opacity: formData.isOnlyMemo ? 0.4 : 1,
              transition: "opacity 0.2s",
            }}
          >
            <M.SectionLabel>변경할 가동 상태 선택</M.SectionLabel>
            <StatusGridBox>
              {["사용중", "재고", "고장", "수리중"].map((st) => {
                const isSelected = formData.status === st;
                const themeDef = statusThemes[st];

                return (
                  <StatusSelectorCard
                    key={st}
                    type="button"
                    selected={isSelected}
                    themeDef={themeDef}
                    disabled={formData.isOnlyMemo}
                    onClick={() => handleDirectChange("status", st)}
                  >
                    <div className="radio-dot">
                      {isSelected && <Check size={12} className="check-icon" />}
                    </div>
                    <span className="status-text">{st}</span>
                  </StatusSelectorCard>
                );
              })}
            </StatusGridBox>
          </M.FormSection>

          {!formData.isOnlyMemo &&
            formData.status === "재고" &&
            hasCurrentHolder && (
              <WarningBanner>
                <AlertCircle size={15} />
                <div className="banner-txt">
                  <strong>[소유자 해제 경고]</strong> 본 자산은 현재 실사용자(
                  <strong>{targetAsset.user}</strong>)가 할당된 상태입니다.{" "}
                  <strong>'재고'</strong> 상태로 변경 시, 기존 소유 관계가
                  자동으로 회수(해제) 처리됩니다.
                </div>
              </WarningBanner>
            )}

          {/* 4. 상세 사유 기술란 */}
          <M.FormSection style={{ marginTop: "20px" }}>
            <M.SectionLabel>
              {formData.isOnlyMemo
                ? "추가할 정비 비고 / 일지 내용"
                : "상태 변경 사유 및 비고"}{" "}
              <span className="required">*</span>
            </M.SectionLabel>
            <M.TextArea
              rows={4}
              name="statusMemo"
              placeholder={
                formData.isOnlyMemo
                  ? "상태 변경 없이 자산 타임라인에 누적할 메모 내용을 상세히 기술하세요..."
                  : "예: 부서 내 보직 변경으로 창고 반납, 메인보드 고장 의심으로 공식 센터 입고 대기 등"
              }
              value={formData.statusMemo}
              onChange={handleInputChange}
              required
            />
          </M.FormSection>
        </M.ModalBody>

        <M.ModalFooter style={{ padding: "14px 24px" }}>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit" style={{ backgroundColor: "#2563eb" }}>
            <Check size={16} />{" "}
            {formData.isOnlyMemo ? "기록 추가 완료" : "상태 즉시 업데이트"}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

/* ─── 🎨 스타일 컴포넌트 ─── */
const StatusGridBox = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 6px;
`;
const StatusSelectorCard = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 10px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  text-align: left;
  transition: all 0.15s ease-in-out;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  .radio-dot {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    border: 2px solid #cbd5e1;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
  }
  .status-text {
    font-size: 14px;
    font-weight: 700;
    color: #475569;
  }
  ${(props) =>
    props.selected &&
    ` background: ${props.themeDef.bg}; border-color: ${props.themeDef.border}; box-shadow: 0 2px 8px ${props.themeDef.color}12; .radio-dot { border-color: ${props.themeDef.color}; background: ${props.themeDef.color}; } .check-icon { color: #fff; } .status-text { color: ${props.themeDef.color}; } `} &:hover {
    ${(props) =>
      !props.selected &&
      !props.disabled &&
      "border-color: #cbd5e1; background: #f1f5f9;"}
  }
`;
const ModeTabGroup = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
  gap: 4px;
`;
const TabButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 0;
  font-size: 13px;
  font-weight: 700;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.1s ease-in-out;
  background: ${(props) => (props.active ? "#fff" : "transparent")};
  color: ${(props) => (props.active ? "#2563eb" : "#64748b")};
  box-shadow: ${(props) =>
    props.active ? "0 1px 3px rgba(0,0,0,0.05)" : "none"};
  &:hover {
    ${(props) => !props.active && "background: #e2e8f0; color: #475569;"}
  }
`;

/* 🚀 경고 배너 톤 업그레이드 (Soft Red 스타일) */
const WarningBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 14px;

  svg {
    color: #ef4444;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .banner-txt {
    font-size: 12.5px;
    color: #991b1b;
    line-height: 1.4;
    strong {
      font-weight: 700;
      color: #7f1d1d;
    }
  }
`;
