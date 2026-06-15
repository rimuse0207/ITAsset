import React, { useEffect } from "react";
import { UserPlus, Check, AlertCircle } from "lucide-react";
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

  // 폼 초기 상태 (기록용 메모 필드 `assignmentMemo` 확보)
  const initialFormState = {
    beforeUser: targetAsset?.user || "",
    newUser: "",
    reason: hasCurrentHolder ? "퇴사로 인한 회수" : "신규 지급",
    assignmentDate: new Date().toISOString().split("T")[0],
    nowStatus: targetAsset?.status,
    assignmentMemo: "", // 🚀 신규 추가: 발령 상세 메모 상태값
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
        nowStatus: targetAsset.status,
        assignmentMemo: "", // 오픈할 때마다 깔끔하게 비워두기
      });
    }
  }, [isOpen, targetAsset]);

  // 현재 기기 유무 상태에 맞춰 이원화된 가용한 사유 목록
  const availableReasons = hasCurrentHolder
    ? ["퇴사로 인한 회수", "노후화로 인한 회수"]
    : ["신규 지급"];

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
      <UserPlus size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>
          {hasCurrentHolder
            ? "자산 반납 및 창고 회수 처리"
            : "자산 신규 불출 및 지급"}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#2563eb",
            fontFamily: "monospace",
            fontWeight: "700",
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
        onSubmit={(e) =>
          handleSubmit(e, (form) => ({
            assetId: targetAsset.id,
            previousUser: targetAsset.user,
            ...form,
            newUser: form.reason.includes("회수") ? "-" : form.newUser,
            nextStatus: form.reason.includes("회수") ? "재고" : "사용중",
            actionType: "USER_CHANGE", // 통합 오디트 로그 대분류 명시
          }))
        }
      >
        <M.ModalBody style={{ overflow: "visible" }}>
          {/* 1. 상황별 최적화 사유 선택 칩 그룹 */}
          <M.FormSection>
            <M.SectionLabel>변경 사유 선택</M.SectionLabel>
            <M.ChipGroup>
              {availableReasons.map((reason) => (
                <M.FilterChip
                  key={reason}
                  type="button"
                  selected={formData.reason === reason}
                  onClick={() => handleDirectChange("reason", reason)}
                >
                  {reason}
                </M.FilterChip>
              ))}
            </M.ChipGroup>
          </M.FormSection>

          {/* 2. 소유 임직원 매핑 레이어 */}
          <M.FormSection style={{ overflow: "visible", marginTop: "16px" }}>
            <M.SectionLabel>현재 장비 소유자</M.SectionLabel>
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

            {/* ─── 🚀 사유 기반 컨텍스트 분기 구역 ─── */}
            {formData.reason.includes("회수") ? (
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
                <M.SectionLabel>
                  변경 적용 대상자 (신규 소유자){" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <div style={{ overflow: "visible", position: "relative" }}>
                  <Select
                    styles={selectCustomStyles}
                    options={selectUserOption}
                    placeholder="검색을 통해 새롭게 자산을 불출할 사원을 선택하세요..."
                    isClearable={true}
                    value={
                      formData.newUser
                        ? selectUserOption.find(
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

          {/* 🚀 3. [신규 구역]: 지급/회수 상세 코멘트 및 비고 기록란 */}
          <M.FormSection style={{ marginTop: "16px" }}>
            <M.SectionLabel>
              {formData.reason.includes("회수")
                ? "회수 및 반납 상세 메모"
                : "지급 및 불출 상세 메모"}{" "}
              <span className="required">*</span>
            </M.SectionLabel>
            <M.TextArea
              rows={3}
              name="assignmentMemo"
              value={formData.assignmentMemo}
              onChange={handleInputChange}
              placeholder={
                formData.reason.includes("회수")
                  ? "반납 기기의 외관 상태나 구체적인 회수 맥락을 기술하세요. (ex: 퇴사 처리 완 / 기기 노후화로 인한 창고 반납 입고)"
                  : "지급 대상 임직원에게 불출하는 구체적 배경을 기술하세요. (ex: 26년 6월 공채 신규 입사자 지급 / 개발 업무용 고사양 장비 추가 지급)"
              }
              required
            />
          </M.FormSection>

          {/* 4. 변경 기준일 */}
          <M.Grid style={{ marginTop: "16px" }}>
            <M.InputGroup>
              <M.SectionLabel>발령 및 변경 기준일</M.SectionLabel>
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
            <Check size={16} /> 소유권 발령 적용
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
