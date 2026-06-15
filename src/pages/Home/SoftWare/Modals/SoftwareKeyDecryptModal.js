import React, { useState, useEffect } from "react";
import {
  Key,
  Laptop,
  RefreshCw,
  Lock,
  ShieldCheck,
  Check,
  AlertCircle,
  User,
} from "lucide-react";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import UserSelectModal from "./UserSelect/UserSelectModal";
import Select from "react-select"; // 🚀 react-select 임포트
import styled from "styled-components";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import useSelectUser from "../../../../hooks/useSelectUser";

export default function SoftwareKeyDecryptModal({
  isOpen,
  onClose,
  selectedSW,
  selectedVersion,
  targetKey,
  onDecryptSuccess,
}) {
  const { selectUserOption } = useSelectUser();
  const [workflowMode, setWorkflowMode] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [decryptPassword, setDecryptPassword] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const handleUserChange = (option) => {
    setSelectedUser(option);
    setSelectedAssetId("");
  };

  const closeAndReset = () => {
    setWorkflowMode(null);
    setSelectedUser(null);
    setSelectedAssetId("");
    setDecryptPassword("");
    onClose();
  };

  const handleProcessSubmit = (e) => {
    e.preventDefault();

    if (decryptPassword !== "dhkIT") {
      alert(
        "복호화 비밀번호가 일치하지 않습니다. 인증 권한을 다시 확인하세요.",
      );
      return;
    }

    const auditPayload = {
      keyId: targetKey?.id,
      workflowMode: workflowMode,
      userCode: selectedUser?.value || "UNASSIGNED",
      userName: selectedUser?.fullName || "미지정",
      assetId:
        workflowMode === "ASSIGN" ? selectedAssetId : "REINSTALL_OVERRIDE",
      decryptedKeyStr: targetKey?.keyStr,
    };

    if (onDecryptSuccess) {
      onDecryptSuccess(auditPayload);
    }
    closeAndReset();
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Lock size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          라이선스 키 복호화
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
          {selectedSW?.swName} · {targetKey?.keyType || "정품 키"} 복합 인증
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={closeAndReset}
      maxWidth="480px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={handleProcessSubmit}>
        <M.ModalBody style={{ padding: "24px" }}>
          {/* 1단계: 분기 체제 선택 존 */}
          {workflowMode === null ? (
            <WorkflowChoiceContainer>
              <ChoiceLabel>
                라이선스 발급 사유 및 자산 점유 방식을 선택하세요{" "}
                <span className="required">*</span>
              </ChoiceLabel>
              <ChoiceGrid>
                <ChoiceCard
                  type="button"
                  onClick={() => setWorkflowMode("ASSIGN")}
                >
                  <Laptop size={28} className="choice-icon blue" />
                  <div className="choice-txt-zone">
                    <div className="c-title">신규 PC 자산 할당 배정</div>
                    <div className="c-desc">
                      사용자 임직원의 하드웨어 기기 코드를 추적 바인딩하여 실사
                      대장에 등록합니다.
                    </div>
                  </div>
                </ChoiceCard>

                <ChoiceCard
                  type="button"
                  onClick={() => setWorkflowMode("REINSTALL")}
                >
                  <RefreshCw size={26} className="choice-icon teal" />
                  <div className="choice-txt-zone">
                    <div className="c-title">자산 등록 없이 단순 재설치</div>
                    <div className="c-desc">
                      기존 지급 기기의 포맷, OS 재설치 등 카피 수 증가가 없는
                      정비 건으로 통과합니다.
                    </div>
                  </div>
                </ChoiceCard>
              </ChoiceGrid>
            </WorkflowChoiceContainer>
          ) : (
            /* 2단계: 하부 폼 레이어 활성화 */
            <ActiveFormFormLayer>
              <SelectedModeSummaryBanner>
                <AlertCircle size={14} />
                <span>
                  선택된 사유:{" "}
                  <strong>
                    {workflowMode === "ASSIGN"
                      ? "신규 자산 매핑 등록"
                      : "단순 포맷/재설치 정비 건"}
                  </strong>
                </span>
                <button
                  type="button"
                  className="reset-mode-btn"
                  onClick={() => {
                    setWorkflowMode(null);
                    setSelectedUser(null);
                    setSelectedAssetId("");
                  }}
                >
                  변경
                </button>
              </SelectedModeSummaryBanner>

              {/* 🚀 [신규 연동 조인]: 1번 분기(신규 배정)일 때 react-select 임직원 검색창 가동 */}
              {workflowMode === "ASSIGN" && (
                <>
                  <M.FormSection style={{ marginTop: "16px" }}>
                    <M.SectionLabel>
                      <User
                        size={13}
                        style={{ marginRight: "4px", color: "#475569" }}
                      />{" "}
                      라이선스 대상 실사용자 검색{" "}
                      <span className="required">*</span>
                    </M.SectionLabel>
                    <Select
                      options={selectUserOption}
                      isLoading={isLoadingUsers}
                      value={selectedUser}
                      onChange={handleUserChange}
                      placeholder="사원명, 부서 또는 사번을 검색하세요..."
                      isSearchable={true}
                      isClearable={true}
                      styles={customSelectStyles}
                    />
                  </M.FormSection>

                  {/* 🚀 임직원이 먼저 선택 완료되어야만 자산 선택 인풋창 개설 */}
                  <M.FormSection style={{ marginTop: "16px" }}>
                    <M.SectionLabel>
                      라이선스를 연동할 실사용 디바이스 자산코드{" "}
                      <span className="required">*</span>
                    </M.SectionLabel>
                    <div style={{ position: "relative" }}>
                      <M.Input
                        type="text"
                        required
                        readOnly
                        disabled={!selectedUser}
                        placeholder={
                          selectedUser
                            ? `클릭하여 [${selectedUser.fullName}] 님의 보유 자산을 선택하세요.`
                            : "위에서 대상을 먼저 선택해 주세요."
                        }
                        value={selectedAssetId}
                        onClick={() =>
                          selectedUser && setIsAssetPickerOpen(true)
                        }
                        style={{
                          cursor: selectedUser ? "pointer" : "not-allowed",
                          paddingRight: "40px",
                          fontFamily: "monospace",
                          fontWeight: "700",
                          background: selectedUser ? "#fff" : "#f1f5f9",
                        }}
                      />
                      <FormSearchIconInside>🔍</FormSearchIconInside>
                    </div>
                  </M.FormSection>
                </>
              )}

              <M.FormSection style={{ marginTop: "16px" }}>
                <M.SectionLabel>
                  <ShieldCheck size={13} style={{ color: "#2563eb" }} />
                  복호화 암호 비밀번호 <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="password"
                  required
                  placeholder=" 복호화 비밀번호를 입력하세요"
                  value={decryptPassword}
                  onChange={(e) => setDecryptPassword(e.target.value)}
                  style={{ paddingLeft: "12px", letterSpacing: "0.2em" }}
                />
                <SecurityWarningText>
                  ※ 비밀번호 검증 완료 즉시 마스킹이 해제되며, 로그에 이력이
                  기록됩니다.
                </SecurityWarningText>
              </M.FormSection>
            </ActiveFormFormLayer>
          )}
        </M.ModalBody>
        <M.ModalFooter style={{ padding: "14px 24px" }}>
          <M.CancelButton type="button" onClick={closeAndReset}>
            취소
          </M.CancelButton>
          <M.SubmitButton
            type="submit"
            disabled={
              workflowMode === null ||
              (workflowMode === "ASSIGN" && (!selectedUser || !selectedAssetId))
            }
            style={{ background: "#2563eb" }}
          >
            <Check size={16} /> 정품 키 복호화 승인
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>

      {/* 🚀 react-select로 선택된 실시간 유저 정보 컨텍스트 매핑 */}
      <UserSelectModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        userCode={selectedUser?.value} // 고른 사번 전달
        userName={selectedUser?.fullName} // 고른 이름 전달
        onSelect={(id) => setSelectedAssetId(id)}
      />
    </ModalLayout>
  );
}

/* ─── 🎨 react-select 전산 폼 무드 매칭 커스텀 테마 커스터마이징 ─── */
const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    borderRadius: "8px",
    borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    fontSize: "13px",
    fontWeight: "500",
    padding: "2px",
    background: "#ffffff",
    "&:hover": { borderColor: "#cbd5e1" },
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "12.5px",
    fontWeight: state.isSelected ? "700" : "500",
    backgroundColor: state.isSelected
      ? "#2563eb"
      : state.isFocused
        ? "#f1f5f9"
        : "#ffffff",
    color: state.isSelected ? "#ffffff" : "#334155",
    cursor: "pointer",
  }),
  menu: (base) => ({ ...base, borderRadius: "8px", zIndex: 999999 }),
};

/* ─── 🎨 스타일셋 컴포넌트 존 ─── */
const WorkflowChoiceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const ChoiceLabel = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 12px;
  .required {
    color: #dc2626;
  }
`;
const ChoiceGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ChoiceCard = styled.button`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s ease;
  .choice-icon {
    flex-shrink: 0;
    &.blue {
      color: #2563eb;
    }
    &.teal {
      color: #0d9488;
    }
  }
  .choice-txt-zone {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .c-title {
    font-size: 14px;
    font-weight: 700;
    color: #1e293b;
  }
  .c-desc {
    font-size: 11.5px;
    color: #64748b;
    line-height: 1.45;
    font-weight: 500;
  }
  &:hover {
    background: #f0f7ff;
    border-color: #bfdbfe;
    transform: translateY(-1px);
  }
`;
const ActiveFormFormLayer = styled.div`
  display: flex;
  flex-direction: column;
`;
const SelectedModeSummaryBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background-color: #f0f7ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-size: 12px;
  color: #1e40af;
  box-sizing: border-box;
  span {
    flex: 1;
    font-weight: 500;
    strong {
      color: #1d4ed8;
      font-weight: 700;
    }
  }
  .reset-mode-btn {
    background: #fff;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    &:hover {
      background: #f1f5f9;
    }
  }
`;
const FormSearchIconInside = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  pointer-events: none;
  color: #94a3b8;
`;
const SecurityWarningText = styled.p`
  font-size: 11px;
  color: #ef4444;
  font-weight: 600;
  margin-top: 6px;
  margin-bottom: 0;
  line-height: 1.3;
`;
