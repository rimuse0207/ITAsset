import React, { useState, useEffect } from "react";
import {
  User,
  Plus,
  Edit3,
  Briefcase,
  Calendar,
  Laptop,
  Search,
  Check,
} from "lucide-react";
import Select from "react-select"; // 🚀 react-select 임포트
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import useSoftwareForm from "../../../../hooks/InfrastructureAsset/useSoftwareForm";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import useSelectUser from "../../../../hooks/useSelectUser";
import styled from "styled-components";
import UserSelectModal from "./UserSelect/UserSelectModal";

export default function SoftwareUserModal({
  isOpen,
  onClose,
  credMode = "create",
  targetSW,
  targetVersion,
  targetUser,
  onSave,
}) {
  const { selectUserOption } = useSelectUser();
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);

  const getTodayString = () => new Date().toISOString().split("T")[0];

  const initialFormState = {
    userCode: credMode === "edit" ? targetUser?.userId || "" : "",
    name: credMode === "edit" ? targetUser?.fullName || "" : "",
    dept: credMode === "edit" ? targetUser?.departmentName || "" : "",
    assetId: credMode === "edit" ? targetUser?.assetId || "" : "",
    assignedDate:
      credMode === "edit"
        ? new Date(targetUser?.assignedDate).toISOString().split("T")[0] ||
          getTodayString()
        : getTodayString(),
  };

  const {
    formData,
    setFormData,
    handleInputChange,
    handleDirectChange,
    handleSubmit,
  } = useSoftwareForm({
    isOpen,
    mode: credMode,
    targetAsset: null,
    targetSW: credMode === "edit" ? { versions: [targetUser] } : null,
    initialFormState,
    onSave,
    onClose,
  });

  const handleUserChange = (selectedOption) => {
    if (selectedOption) {
      setFormData((prev) => ({
        ...prev,
        userCode: selectedOption.value,
        name: selectedOption.fullName,
        dept: selectedOption.departmentName || "부서 정보 없음",
      }));
    } else {
      setFormData((prev) => ({ ...prev, userCode: "", name: "", dept: "" }));
    }
  };

  // react-select 커스텀 스타일
  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "8px",
      borderColor: "#cbd5e1",
      fontSize: "14px",
      fontFamily: "inherit",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" },
    }),
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <User
        size={18}
        style={{ color: credMode === "edit" ? "#f59e0b" : "#2563eb" }}
      />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {credMode === "edit"
            ? "임직원 라이선스 할당 수정"
            : "라이선스 실사용자 배정"}
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
          Target: {targetSW?.swName} [{targetVersion?.versionStr}]
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="480px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={handleSubmit}>
        <M.ModalBody style={{ padding: "28px" }}>
          <M.FormSection style={{ marginBottom: 0 }}>
            <M.Grid>
              {/* 👥 1. 사용자 선택 (react-select) */}
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <User size={13} /> 실사용 임직원 선택{" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <Select
                  options={selectUserOption}
                  styles={selectStyles}
                  placeholder="성명 또는 사번으로 검색..."
                  isClearable
                  name="userCode"
                  value={
                    formData.userCode
                      ? selectUserOption.find(
                          (opt) => opt.value === formData.userCode,
                        )
                      : null
                  }
                  onChange={handleUserChange}
                />
              </M.InputGroup>

              {/* 💻 3. 지급 자산 코드 (클릭 시 서브 모달 오픈) */}
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <Laptop size={13} /> 소프트웨어가 설치된 자산 (Device){" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <div style={{ position: "relative" }}>
                  <M.Input
                    type="text"
                    name="assetId"
                    readOnly
                    required
                    placeholder={
                      formData.userCode
                        ? "여기룰 클릭하여 자산을 선택하세요."
                        : "먼저 사용자를 선택해 주세요."
                    }
                    value={formData.assetId}
                    onClick={() => {
                      if (!formData.userCode)
                        return alert("배정할 임직원을 먼저 선택해 주세요.");

                      setIsAssetPickerOpen(true);
                    }}
                    style={{
                      cursor: "pointer",
                      paddingRight: "40px",
                      fontFamily: "monospace",
                      fontWeight: "600",
                      zIndex: "99",
                    }}
                  />
                  <SearchIconBtn type="button">
                    <Search size={14} />
                  </SearchIconBtn>
                </div>
              </M.InputGroup>

              {/* 📅 4. 발령 일자 */}
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <Calendar size={13} /> 라이선스 등록일
                </M.SectionLabel>
                <M.Input
                  type="date"
                  name="assignedDate"
                  required
                  value={formData.assignedDate}
                  onChange={handleInputChange}
                />
              </M.InputGroup>
            </M.Grid>
          </M.FormSection>
        </M.ModalBody>

        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton
            type="submit"
            style={{ background: credMode === "edit" ? "#f59e0b" : "#2563eb" }}
          >
            <Check size={16} />{" "}
            {credMode === "edit" ? "정보 수정 완료" : "라이선스 배정 확정"}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>

      <UserSelectModal
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        userCode={formData.userCode}
        userName={formData.name}
        onSelect={(id) => handleDirectChange("assetId", id)}
      />
    </ModalLayout>
  );
}

/* --- 🎨 스타일 컴포넌트 --- */
const SearchIconBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  pointer-events: none;
`;
