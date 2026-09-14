import React, { useState, useEffect } from "react";
import { User, Check, Calendar, MinusSquare } from "lucide-react";
import Select from "react-select";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import useSelectUser from "../../../../hooks/useSelectUser";
import moment from "moment";

export default function ConsumableUserModal({
  isOpen,
  onClose,
  targetItem,
  onSave,
  mode = "create",
  targetHistory,
}) {
  const { selectUserOption } = useSelectUser();
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [isUnknownUser, setIsUnknownUser] = useState(false);
  const [formData, setFormData] = useState({
    userCode: "",
    name: "",
    dept: "",
    issueCount: 1,
    issueDate: getTodayString(),
    memo: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && targetHistory) {
        setFormData({ ...targetHistory });
        setIsUnknownUser(!targetHistory.userCode);
      } else {
        setFormData({
          userCode: "",
          name: "",
          dept: "",
          issueCount: 1,
          issueDate: getTodayString(),
          memo: "",
        });
        setIsUnknownUser(false);
      }
    }
  }, [isOpen, mode, targetHistory]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isUnknownUser && !formData.userCode) {
      alert("지급할 임직원을 선택하거나, '대상자 미지정'을 체크해주세요.");
      return;
    }

    // 지급 대상자 미지정일 경우 유저 정보 초기화
    const finalData = { ...formData };
    if (isUnknownUser) {
      finalData.userCode = null;
      finalData.name = "미지정 (부서 공용 등)";
      finalData.dept = "-";
    }

    if (
      mode === "create" &&
      finalData.issueCount > (Number(targetItem?.currentStock) || 0)
    ) {
      alert("현재 재고수량보다 많은 수량을 지급할 수 없습니다.");
      return;
    }

    onSave(finalData);
  };

  const selectStyles = {
    control: (base) => ({
      ...base,
      minHeight: "38px",
      borderRadius: "8px",
      borderColor: "#cbd5e1",
      fontSize: "14px",
      boxShadow: "none",
      "&:hover": { borderColor: "#2563eb" },
    }),

    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
    menu: (base) => ({ ...base, zIndex: 99999 }),
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <User
        size={18}
        style={{ color: mode === "edit" ? "#f59e0b" : "#2563eb" }}
      />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {mode === "edit" ? "지급 내역 수정" : "실사용자 소모품 지급"}
        </h2>
        <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0" }}>
          지급 품목: {targetItem?.name} (잔여: {targetItem?.currentStock}개)
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
        <M.ModalBody style={{ padding: "28px", overflow: "visible" }}>
          <M.FormSection style={{ marginBottom: 0 }}>
            <M.Grid>
              <M.InputGroup className="full-width">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "6px",
                  }}
                >
                  <M.SectionLabel style={{ marginBottom: 0 }}>
                    <User size={13} /> 지급 대상자 선택{" "}
                    <span className="required">*</span>
                  </M.SectionLabel>

                  <label
                    style={{
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      cursor: "pointer",
                      color: "#64748b",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isUnknownUser}
                      onChange={(e) => setIsUnknownUser(e.target.checked)}
                    />
                    대상자 미지정
                  </label>
                </div>

                <Select
                  options={selectUserOption}
                  styles={selectStyles}
                  menuPosition="fixed"
                  menuPortalTarget={document.body}
                  placeholder={
                    isUnknownUser
                      ? "미지정 처리됨"
                      : "성명 또는 사번으로 검색..."
                  }
                  isDisabled={isUnknownUser}
                  isClearable
                  name="userCode"
                  value={
                    formData.userCode && !isUnknownUser
                      ? selectUserOption.find(
                          (opt) => opt.value === formData.userCode,
                        )
                      : null
                  }
                  onChange={handleUserChange}
                />
              </M.InputGroup>

              <M.InputGroup>
                <M.SectionLabel>
                  <MinusSquare size={13} /> 지급 수량{" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="number"
                  name="issueCount"
                  required
                  min="1"
                  value={formData.issueCount}
                  onChange={handleInputChange}
                />
              </M.InputGroup>

              <M.InputGroup>
                <M.SectionLabel>
                  <Calendar size={13} /> 지급 일자
                </M.SectionLabel>
                <M.Input
                  type="date"
                  name="issueDate"
                  required
                  value={moment(formData.issueDate).format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                />
              </M.InputGroup>

              <M.InputGroup className="full-width">
                <M.SectionLabel>지급 사유 및 비고</M.SectionLabel>
                <M.Input
                  type="text"
                  name="memo"
                  placeholder="예: 공용 비품 비치, 신규 입사자 지급"
                  value={formData.memo}
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
            style={{ background: mode === "edit" ? "#f59e0b" : "#2563eb" }}
          >
            <Check size={16} />{" "}
            {mode === "edit" ? "정보 수정 완료" : "지급 등록"}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}
