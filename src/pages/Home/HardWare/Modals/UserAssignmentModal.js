import React, { useEffect } from "react";
import { UserPlus, Check, AlertCircle, ArrowRightLeft } from "lucide-react";
import ModalLayout from "./public/ModalLayout";
import * as M from "./public/ModalStyle";
import useModalForm from "../../../../hooks/InfrastructureAsset/Modal/useModalForm";
import styled from "styled-components";

// 🚀 사내 임직원 검색 연동을 위한 react-select 디펜던시
import Select from "react-select";
import useSelectUser from "../../../../hooks/useSelectUser";

export default function UserAssignmentModal({
  isOpen,
  onClose,
  targetAsset,
  onSave,
}) {
  const { selectUserOption } = useSelectUser();

  // 🚀 핵심 판별 플래그: 현재 자산에 실사용자(소유자)가 매핑되어 있는가?
  const hasCurrentHolder =
    targetAsset?.user &&
    targetAsset.user !== "재고" &&
    targetAsset.user !== "-";

  // 폼 초기 상태
  const initialFormState = {
    beforeUser: targetAsset?.user || "",
    newUser: "",
    reason: hasCurrentHolder ? "퇴사로 인한 회수" : "신규 지급",
    assignmentDate: new Date().toISOString().split("T")[0],
    nowStatus: targetAsset?.status,
    assignmentMemo: "",
  };

  const {
    formData,
    setFormData,
    handleInputChange,
    handleDirectChange,
    handleSubmit,
  } = useModalForm({
    isOpen,
    mode: "create",
    targetAsset,
    initialFormState,
    onSave,
    onClose,
  });

  // 팝업 오픈 트리거 시 초기화 로직
  useEffect(() => {
    if (isOpen) {
      setFormData({
        beforeUser: hasCurrentHolder ? targetAsset.user : "",
        newUser: "",
        reason: hasCurrentHolder ? "퇴사로 인한 회수" : "신규 지급",
        assignmentDate: new Date().toISOString().split("T")[0],
        nowStatus: targetAsset?.status,
        assignmentMemo: "",
      });
    }
  }, [isOpen, targetAsset, hasCurrentHolder, setFormData]);

  // 🚀 현재 기기 소유자 유무에 따른 사유 목록 ('사용자 간 이관' 추가)
  const availableReasons = hasCurrentHolder
    ? ["퇴사로 인한 회수", "노후화로 인한 회수", "사용자 간 이관"]
    : ["신규 지급"];

  // 현재 선택된 사유 판별 플래그
  const isReturnMode = formData.reason.includes("회수");
  const isTransferMode = formData.reason.includes("이관");

  // 사유 변경 시 newUser 초기화 핸들러
  const handleReasonSelect = (selectedReason) => {
    setFormData((prev) => ({
      ...prev,
      reason: selectedReason,
      newUser: "", // 사유 전환 시 선택했던 대상자 초기화
    }));
  };

  // 이관 시 현재 소유자 본인은 목록에서 제외하여 중복 선택 방지
  const filteredUserOptions = selectUserOption.filter(
    (opt) => opt.value !== formData.beforeUser,
  );

  // react-select 스타일셋
  const selectCustomStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "38px",
      height: "38px",
      background: state.isDisabled ? "#f8fafc" : "#fff",
      borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
      boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontFamily: "inherit",
      "&:hover": { borderColor: "#2563eb" },
    }),
    valueContainer: (base) => ({ ...base, padding: "0 12px", height: "38px" }),
    indicatorsContainer: (base) => ({ ...base, height: "38px" }),
    menu: (base) => ({ ...base, fontSize: "14px", zIndex: 99999 }),
    menuList: (base) => ({ ...base, zIndex: 99999 }),
    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    option: (base, state) => ({
      ...base,
      padding: "8px 12px",
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "#fff",
      color: state.isSelected ? "#fff" : "#334155",
    }),
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {isTransferMode ? (
        <ArrowRightLeft size={18} style={{ color: "#2563eb" }} />
      ) : (
        <UserPlus size={18} style={{ color: "#2563eb" }} />
      )}
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {hasCurrentHolder
            ? isTransferMode
              ? "자산 소유자 직접 이관 처리"
              : "자산 반납 및 창고 회수 처리"
            : "자산 신규 불출 및 지급"}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#2563eb",
            fontFamily: "monospace",
            fontWeight: "700",
            margin: "2px 0 0 0",
          }}
        >
          {targetAsset?.id} · {targetAsset?.name}
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} titleZone={titleZone}>
      <M.StyledForm
        onSubmit={(e) => {
          // 지급 또는 이관 모드일 때 대상자 미선택 방어
          if (!isReturnMode && !formData.newUser) {
            e.preventDefault();
            return alert(
              isTransferMode
                ? "자산을 이관받을 대상자를 선택해주세요."
                : "자산을 신규 지급할 대상자를 선택해주세요.",
            );
          }

          handleSubmit(e, (form) => ({
            assetId: targetAsset.id,
            previousUser: targetAsset.user,
            ...form,
            newUser: isReturnMode ? "-" : form.newUser,
            nextStatus: isReturnMode ? "재고" : "사용중",
            actionType: isTransferMode ? "USER_TRANSFER" : "USER_CHANGE",
          }));
        }}
      >
        <M.ModalBody style={{ overflow: "visible" }}>
          {/* 1. 상황별 사유 선택 칩 그룹 */}
          <M.FormSection>
            <M.SectionLabel>변경 사유 선택</M.SectionLabel>
            <M.ChipGroup>
              {availableReasons.map((reason) => (
                <M.FilterChip
                  key={reason}
                  type="button"
                  selected={formData.reason === reason}
                  onClick={() => handleReasonSelect(reason)}
                >
                  {reason === "사용자 간 이관" && (
                    <ArrowRightLeft size={12} style={{ marginRight: "4px" }} />
                  )}
                  {reason}
                </M.FilterChip>
              ))}
            </M.ChipGroup>
          </M.FormSection>

          {/* 2. 소유 임직원 매핑 레이어 */}
          <M.FormSection style={{ overflow: "visible", marginTop: "16px" }}>
            <M.SectionLabel>
              {isTransferMode
                ? "이관 전 장비 소유자 (인계자)"
                : "현재 장비 소유자"}
            </M.SectionLabel>
            <div
              style={{
                overflow: "visible",
                position: "relative",
                marginBottom: "16px",
              }}
            >
              <Select
                styles={selectCustomStyles}
                options={selectUserOption}
                placeholder="현재 이 장비는 전산실 창고에 [재고] 상태로 보관 중입니다."
                value={
                  formData.beforeUser
                    ? selectUserOption.find(
                        (opt) => opt.value === formData.beforeUser,
                      )
                    : null
                }
                isDisabled={true}
                menuPortalTarget={document.body}
                menuPosition="fixed"
              />
            </div>

            {/* ─── 🚀 사유 기반 컨텍스트 분기 구역 (회수 vs 지급/이관) ─── */}
            {isReturnMode ? (
              <InfoBannerZone>
                <AlertCircle size={15} />
                <div className="banner-txt">
                  <strong>[자산 반납 공지]</strong> 변경 발령 적용 시, 기존
                  임직원 맵핑 정보가 완전 해제되며 본 장비는 자동으로 전산실{" "}
                  <strong>'창고 재고'</strong> 상태로 안전 입고됩니다.
                </div>
              </InfoBannerZone>
            ) : (
              <>
                {isTransferMode && (
                  <TransferGuideBanner>
                    <ArrowRightLeft size={15} />
                    <div className="banner-txt">
                      <strong>[직접 이관 안내]</strong> 창고 입고(재고) 절차를
                      거치지 않고 기존 소유자에서{" "}
                      <strong>신규 인수자에게 즉시 소유권이 이전</strong>되며,
                      기기 상태는 <strong>'사용중'</strong>으로 유지됩니다.
                    </div>
                  </TransferGuideBanner>
                )}

                <M.SectionLabel>
                  {isTransferMode
                    ? "이관 대상자 선택 (인수자)"
                    : "변경 적용 대상자 (신규 소유자)"}{" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <div style={{ overflow: "visible", position: "relative" }}>
                  <Select
                    styles={selectCustomStyles}
                    options={filteredUserOptions}
                    placeholder={
                      isTransferMode
                        ? "장비를 인계받을 이관 대상 사원을 검색하여 선택하세요..."
                        : "검색을 통해 새롭게 자산을 불출할 사원을 선택하세요..."
                    }
                    isClearable={true}
                    value={
                      formData.newUser
                        ? filteredUserOptions.find(
                            (opt) => opt.value === formData.newUser,
                          )
                        : null
                    }
                    onChange={(selectedOption) =>
                      handleDirectChange(
                        "newUser",
                        selectedOption ? selectedOption.value : "",
                      )
                    }
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    required
                  />
                </div>
              </>
            )}
          </M.FormSection>

          {/* 3. 지급/회수/이관 상세 코멘트 및 비고 기록란 */}
          <M.FormSection style={{ marginTop: "16px" }}>
            <M.SectionLabel>
              {isReturnMode
                ? "회수 및 반납 상세 메모"
                : isTransferMode
                  ? "사용자 간 이관 상세 메모"
                  : "지급 및 불출 상세 메모"}{" "}
              <span className="required">*</span>
            </M.SectionLabel>
            <M.TextArea
              rows={3}
              name="assignmentMemo"
              value={formData.assignmentMemo}
              onChange={handleInputChange}
              placeholder={
                isReturnMode
                  ? "반납 기기의 외관 상태나 구체적인 회수 맥락을 기술하세요. (ex: 퇴사 처리 완 / 기기 노후화로 인한 창고 반납 입고)"
                  : isTransferMode
                    ? "장비를 직접 인계/인수하는 구체적인 사유를 기술하세요. (ex: 부서 내 업무 인수인계에 따른 장비 일괄 이관)"
                    : "지급 대상 임직원에게 불출하는 구체적 배경을 기술하세요. (ex: 26년 공채 신규 입사자 지급 / 개발 업무용 고사양 장비 추가 지급)"
              }
              required
            />
          </M.FormSection>

          {/* 4. 변경 기준일 */}
          <M.Grid style={{ marginTop: "16px" }}>
            <M.InputGroup>
              <M.SectionLabel>
                {isTransferMode ? "이관 기준일" : "발령 및 변경 기준일"}
              </M.SectionLabel>
              <M.Input
                type="date"
                name="assignmentDate"
                value={formData.assignmentDate}
                onChange={handleInputChange}
                required
              />
            </M.InputGroup>
          </M.Grid>
        </M.ModalBody>

        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit">
            <Check size={16} />{" "}
            {isTransferMode ? "자산 이관 확정" : "소유권 발령 적용"}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

const InfoBannerZone = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px 14px;
  svg {
    color: #16a34a;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .banner-txt {
    font-size: 12.5px;
    color: #166534;
    line-height: 1.4;
    strong {
      font-weight: 700;
    }
  }
`;

const TransferGuideBanner = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 14px;
  svg {
    color: #2563eb;
    flex-shrink: 0;
    margin-top: 1px;
  }
  .banner-txt {
    font-size: 12.5px;
    color: #1e40af;
    line-height: 1.4;
    strong {
      font-weight: 700;
    }
  }
`;
