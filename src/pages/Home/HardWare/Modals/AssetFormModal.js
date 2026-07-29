import React from "react";
import {
  Monitor,
  Calendar,
  User,
  Check,
  Plus,
  Trash2,
  Layers,
  Search,
  Edit3,
  Smartphone,
  Tv,
} from "lucide-react";
import ModalLayout from "./public/ModalLayout";
import * as M from "./public/ModalStyle";
import useModalForm from "../../../../hooks/InfrastructureAsset/Modal/useModalForm";
import styled from "styled-components";
import useSelectUser from "../../../../hooks/useSelectUser";
import Select from "react-select";

export default function AssetFormModal({
  isOpen,
  onClose,
  mode = "create",
  targetAsset,
  onSave,
}) {
  // 폼 초기 상태 스키마
  const initialFormState = {
    deviceType: targetAsset?.deviceType || "PC",
    name: "",
    category: "데스크탑/노트북",
    date: new Date().toISOString().split("T")[0],
    specCpu: "",
    specRam: "",
    specStorage: "",
    monitorSize: "",
    phoneNumber: "",
    memo: "",
  };

  const {
    formData,
    setFormData,
    targetRows,
    handleInputChange,
    handleRowChange,
    addRow,
    removeRow,
    handleSubmit,
  } = useModalForm({
    isOpen,
    mode,
    targetAsset,
    initialFormState,
    onSave,
    onClose,
  });
  const { selectUserOption } = useSelectUser();

  const selectCustomStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "32px",
      height: "32px",
      background: "#fff",
      borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
      boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
      borderRadius: "6px",
      fontSize: "12.5px",
      fontFamily: "inherit",
      "&:hover": {
        borderColor: "#2563eb",
      },
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
      height: "32px",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: "32px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "4px",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "4px",
    }),
    input: (base) => ({
      ...base,
      margin: "0px",
      padding: "0px",
    }),
    menu: (base) => ({
      ...base,
      fontSize: "12.5px",
      zIndex: 9999,
    }),

    menuList: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),
    option: (base, state) => ({
      ...base,
      padding: "6px 12px",
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
          ? "#eff6ff"
          : "#fff",
      color: state.isSelected ? "#fff" : "#334155",
    }),
  };

  const titleZone = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div>
        <span className={`category-tag ${mode === "edit" ? "edit-mode" : ""}`}>
          {mode === "edit" ? "자산 수정" : "자산 신규 입고"}
        </span>
        <h2 style={{ fontSize: "18px", fontWeight: "700", marginTop: "4px" }}>
          {mode === "edit"
            ? `자산 항목 정보 수정 (${targetAsset?.id})`
            : "대량 자산 일괄 입고 등록"}
        </h2>
      </div>
    </div>
  );

  const customPayloadBuilder = (form, rows) => {
    const basePayload = {
      deviceType: form.deviceType,
      name: form.name,
      category: form.category,
      date: form.date,
      ...(form.deviceType === "PC" && {
        specCpu: form.specCpu,
        specRam: form.specRam,
        specStorage: form.specStorage,
      }),
      ...(form.deviceType === "MONITOR" && { monitorSize: form.monitorSize }),
      ...(form.deviceType === "IPHONE" && { phoneNumber: form.phoneNumber }),
    };

    if (mode === "edit") {
      return {
        id: targetAsset.id,
        ...basePayload,
        user: rows[0].user || null,
        serial: rows[0].serial,
        memo: rows[0].memo || "",
        ...(form.deviceType === "IPHONE" && { imei: rows[0].imei }),
      };
    } else {
      return rows.map((row) => ({
        ...basePayload,
        user: row.user || null,
        serial: row.serial,
        memo: row.memo || "",
        ...(form.deviceType === "IPHONE" && { imei: row.imei }),
      }));
    }
  };

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="1200px"
      titleZone={titleZone}
    >
      <M.StyledForm
        onSubmit={(e) =>
          handleSubmit(e, customPayloadBuilder, formData.deviceType)
        }
      >
        <M.FormBody style={{ padding: "4px 24px 24px 24px" }}>
          {/* [대분류 선택 탭] */}
          <DeviceTypeTabSelector>
            <TabButton
              type="button"
              active={formData.deviceType === "PC"}
              onClick={() =>
                mode !== "edit" &&
                setFormData((prev) => ({
                  ...prev,
                  deviceType: "PC",
                  category: "데스크탑/노트북",
                }))
              }
            >
              <Monitor size={18} />
              <div>사내 업무용 PC / 노트북</div>
            </TabButton>
            <TabButton
              type="button"
              active={formData.deviceType === "IPHONE"}
              onClick={() =>
                mode !== "edit" &&
                setFormData((prev) => ({
                  ...prev,
                  deviceType: "IPHONE",
                  category: "아이폰",
                }))
              }
            >
              <Smartphone size={18} />
              <div>모바일 단말 (iPhone)</div>
            </TabButton>
            <TabButton
              type="button"
              active={formData.deviceType === "MONITOR"}
              onClick={() =>
                mode !== "edit" &&
                setFormData((prev) => ({
                  ...prev,
                  deviceType: "MONITOR",
                  category: "모니터",
                }))
              }
            >
              <Tv size={18} />
              <div>디스플레이 / 모니터</div>
            </TabButton>
          </DeviceTypeTabSelector>

          {/* 1️⃣ 섹션: 공통 기초정보 */}
          <M.FormSection>
            <M.SectionTitle>
              <Layers size={16} /> 1. 선택 자산 기종 공통 스펙 명세
            </M.SectionTitle>
            <M.Grid>
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  자산 마스터 모델명 <span className="required">*</span>
                </M.SectionLabel>
                <M.InputWrapper>
                  <Monitor size={16} className="input-icon" />
                  <M.Input
                    type="text"
                    name="name"
                    required
                    placeholder={
                      formData.deviceType === "PC"
                        ? "예: 삼성 갤럭시 북5 PRO"
                        : formData.deviceType === "IPHONE"
                          ? "예: iPhone SE3 "
                          : "예: 삼성 LS24D300"
                    }
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </M.InputWrapper>
              </M.InputGroup>

              <M.InputGroup>
                <M.SectionLabel>고정 카테고리 분류</M.SectionLabel>
                <M.Input
                  type="text"
                  name="category"
                  value={formData.category}
                  readOnly
                  style={{ background: "#f8fafc", fontWeight: 600 }}
                />
              </M.InputGroup>

              <M.InputGroup>
                <M.SectionLabel>
                  {mode === "edit" ? "최근 실사/변경일" : "일괄 입고 등록일"}
                </M.SectionLabel>
                <M.Input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </M.InputGroup>
            </M.Grid>

            {/* 사양 분기 */}
            {formData.deviceType === "PC" && (
              <M.SpecRowGrid>
                <M.MiniInputGroup>
                  <M.SectionLabel className="mini">CPU 스펙</M.SectionLabel>
                  <M.Input
                    name="specCpu"
                    placeholder="예: i5-3세대"
                    value={formData.specCpu}
                    onChange={handleInputChange}
                  />
                </M.MiniInputGroup>
                <M.MiniInputGroup>
                  <M.SectionLabel className="mini">RAM 용량</M.SectionLabel>
                  <M.Input
                    name="specRam"
                    placeholder="예: 32GB"
                    value={formData.specRam}
                    onChange={handleInputChange}
                  />
                </M.MiniInputGroup>
                <M.MiniInputGroup>
                  <M.SectionLabel className="mini">Storage 용량</M.SectionLabel>
                  <M.Input
                    name="specStorage"
                    placeholder="예: 1TB SSD"
                    value={formData.specStorage}
                    onChange={handleInputChange}
                  />
                </M.MiniInputGroup>
              </M.SpecRowGrid>
            )}

            {formData.deviceType === "MONITOR" && (
              <M.SpecRowGrid style={{ gridTemplateColumns: "1fr" }}>
                <M.MiniInputGroup>
                  <M.SectionLabel className="mini">
                    디스플레이 화면 인치 수 (Size)
                  </M.SectionLabel>
                  <M.Input
                    name="monitorSize"
                    placeholder="예: 24인치, 27인치 "
                    value={formData.monitorSize}
                    onChange={handleInputChange}
                  />
                </M.MiniInputGroup>
              </M.SpecRowGrid>
            )}

            {formData.deviceType === "IPHONE" && (
              <M.SpecRowGrid style={{ gridTemplateColumns: "1fr" }}>
                <M.MiniInputGroup>
                  <M.SectionLabel className="mini">폰 번호</M.SectionLabel>
                  <M.Input
                    name="phoneNumber"
                    placeholder="예: 010-xxxx-xxxx"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </M.MiniInputGroup>
              </M.SpecRowGrid>
            )}
          </M.FormSection>

          {/* 2️⃣ 섹션: 자산 분할 매핑 테이블 리스트 영역 */}
          <M.FormSection>
            <M.SectionTitle style={{ marginBottom: "12px" }}>
              <Layers size={16} />{" "}
              {mode === "edit"
                ? "2. 매핑 사용자 및 디바이스 고유 식별/비고 정보 수정"
                : `2. 입고 대상 장비 일련번호 기입 매트릭스 (${targetRows.length}대)`}
            </M.SectionTitle>

            <M.BulkTableHeader
              style={{ gridTemplateColumns: "40px 1.8fr 1.8fr 1.8fr 40px" }}
            >
              <div className="col-user">실사용자 (부서)</div>
              <div className="col-serial">
                {formData.deviceType === "MONITOR"
                  ? "모니터 S/N *"
                  : formData.deviceType === "PC"
                    ? "제조사 시리얼 (S/N) *"
                    : "IMEI*"}
              </div>
              <div className="col-memo">ERP 자산코드</div>
              <div className="col-memo">자산 특이사항 (비고)</div>
              <div className="col-action">{mode === "create" && "제거"}</div>
            </M.BulkTableHeader>

            <M.BulkTableBody>
              {targetRows.map((row, index) => (
                <M.BulkRow
                  key={row.id}
                  style={{
                    gridTemplateColumns: "40px 1.8fr 1.8fr 1.8fr 40px",
                    overflow: "visible",
                  }}
                >
                  <div className="col-index">{index + 1}</div>

                  <div
                    className="col-user"
                    style={{ overflow: "visible", display: "block" }}
                  >
                    <Select
                      styles={selectCustomStyles}
                      options={selectUserOption}
                      placeholder="사원 검색..."
                      isClearable={true}
                      value={
                        row.user
                          ? selectUserOption.find(
                              (opt) => opt.value === row.user,
                            )
                          : null
                      }
                      onChange={(selectedOption) => {
                        const value = selectedOption
                          ? selectedOption.value
                          : null;
                        handleRowChange(row.id, "user", value);
                      }}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                    />
                  </div>

                  {/* 📟 시리얼 넘버 */}
                  <div className="col-serial">
                    <M.RowInput
                      type="text"
                      placeholder="일련번호 입력"
                      value={row.serial || ""}
                      onChange={(e) =>
                        handleRowChange(row.id, "serial", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-memo">
                    <M.RowInput
                      type="text"
                      placeholder="예: PC0111"
                      value={row.erpCode || ""}
                      onChange={(e) =>
                        handleRowChange(row.id, "erpCode", e.target.value)
                      }
                    />
                  </div>

                  {/* 📝 자산 비고 */}
                  <div className="col-memo">
                    <M.RowInput
                      type="text"
                      placeholder="예: DISCO PC, M24xxx"
                      value={row.memo || ""}
                      onChange={(e) =>
                        handleRowChange(row.id, "memo", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-action">
                    {mode === "create" && (
                      <M.RowDeleteButton
                        type="button"
                        onClick={() => removeRow(row.id)}
                      >
                        <Trash2 size={14} />
                      </M.RowDeleteButton>
                    )}
                  </div>
                </M.BulkRow>
              ))}
            </M.BulkTableBody>

            {mode === "create" && (
              <M.AddRowButton type="button" onClick={addRow}>
                <Plus size={14} /> 행 추가하기 (다음{" "}
                {formData.deviceType === "PC"
                  ? "컴퓨터"
                  : formData.deviceType === "IPHONE"
                    ? "스마트폰"
                    : "모니터"}{" "}
                입고)
              </M.AddRowButton>
            )}
          </M.FormSection>
        </M.FormBody>

        <M.FormFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit">
            {mode === "edit" ? (
              <>
                <Edit3 size={14} /> 변경 내용 저장
              </>
            ) : (
              <>
                <Check size={16} /> 총 {targetRows.length}대의{" "}
                {formData.deviceType} 일괄 입고 완료
              </>
            )}
          </M.SubmitButton>
        </M.FormFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

const DeviceTypeTabSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
`;
const TabButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  border-radius: 10px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  border: 1px solid ${(props) => (props.active ? "#2563eb" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#eff6ff" : "#fff")};
  color: ${(props) => (props.active ? "#2563eb" : "#64748b")};
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  div {
    font-size: 12px;
    font-weight: 700;
  }
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: ${(props) => (props.active ? "#eff6ff" : "#f8fafc")};
  }
`;
