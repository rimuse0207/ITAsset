import React, { useEffect } from "react";
import {
  Sliders,
  Layers,
  Check,
  Calendar,
  RotateCcw,
  Cpu,
  Smartphone,
  Tv,
} from "lucide-react";
import ModalLayout from "./public/ModalLayout";
import * as M from "./public/ModalStyle";
import styled from "styled-components";
import useModalForm from "../../../../hooks/InfrastructureAsset/Modal/useModalForm";

export default function AssetFilterModal({
  isOpen,
  onClose,
  onApply,
  currentFilters,
}) {
  // 🚀 1. 기본 상태 정의: categories의 기본값을 ['PC']로 지정
  const initialFormState = {
    categories: ["PC"], // ✨ 최초 진입 시 컴퓨터/노트북 기본 체크
    statuses: [],
    startDate: "",
    endDate: "",
    specCpu: "",
    minRam: "",
    monitorSize: "",
    telecom: "ALL",
  };

  const { formData, setFormData, handleInputChange, handleSubmit } =
    useModalForm({
      isOpen,
      mode: "create",
      targetAsset: null,
      initialFormState,
      onSave: onApply,
      onClose,
    });

  useEffect(() => {
    if (isOpen) {
      if (currentFilters) {
        // 이전에 저장된 필터 스냅샷이 있다면 그대로 복원
        setFormData(currentFilters);
      } else {
        // 저장된 필터가 없다면 PC가 기본 선택된 초기 상태로 세팅
        setFormData(initialFormState);
      }
    }
  }, [isOpen, currentFilters]);

  // 다중선택 칩 토글러
  const toggleChipSelect = (field, value) => {
    const currentList = formData[field] || [];
    const isSelected = currentList.includes(value);

    const updatedList = isSelected
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];

    setFormData((prev) => ({ ...prev, [field]: updatedList }));
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  const titleZone = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#2563eb",
      }}
    >
      <Sliders size={18} />
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "700",
          margin: 0,
          color: "#0f172a",
        }}
      >
        인프라 자산 상세 필터 매트릭스
      </h2>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="540px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={(e) => handleSubmit(e, (form) => form)}>
        <M.ModalBody style={{ padding: "24px 28px" }}>
          {/* Section 1: 자산 종류 기종 선택 */}
          <M.FormSection>
            <M.SectionLabel>
              <Layers size={14} /> 자산 대분류 링킹 (복수 선택)
            </M.SectionLabel>
            <M.ChipGroup>
              {[
                { key: "PC", label: "데스크탑/노트북" },
                { key: "IPHONE", label: "아이폰" },
                { key: "MONITOR", label: "모니터" },
              ].map((item) => {
                const isSelected = formData.categories?.includes(item.key);
                return (
                  <M.FilterChip
                    key={item.key}
                    type="button"
                    selected={isSelected}
                    onClick={() => toggleChipSelect("categories", item.key)}
                  >
                    {isSelected && <Check size={12} />} {item.label}
                  </M.FilterChip>
                );
              })}
            </M.ChipGroup>
          </M.FormSection>

          {/* Section 2: 자산 상태 */}
          <M.FormSection>
            <M.SectionLabel>
              <Check size={14} /> 장비 가동 상태
            </M.SectionLabel>
            <M.ChipGroup>
              {["사용중", "재고", "고장", "수리중"].map((status) => {
                const isSelected = formData.statuses?.includes(status);
                return (
                  <M.FilterChip
                    key={status}
                    type="button"
                    selected={isSelected}
                    onClick={() => toggleChipSelect("statuses", status)}
                  >
                    {isSelected && <Check size={12} />} {status}
                  </M.FilterChip>
                );
              })}
            </M.ChipGroup>
          </M.FormSection>

          {/* Section 3: 입고/구매 범위 타임라인 서치 */}
          <M.FormSection>
            <M.SectionLabel>
              <Calendar size={14} /> 도입/입고 일자 범위 (Purchase Date)
            </M.SectionLabel>
            <DateRangeGridLocal>
              <M.Input
                type="date"
                name="startDate"
                value={formData.startDate || ""}
                onChange={handleInputChange}
                style={{ paddingLeft: "12px" }}
              />
              <span className="split-wave">~</span>
              <M.Input
                type="date"
                name="endDate"
                value={formData.endDate || ""}
                onChange={handleInputChange}
                style={{ paddingLeft: "12px" }}
              />
            </DateRangeGridLocal>
          </M.FormSection>

          {/* Section 4: 선택한 기종 종류에 따라 유기적으로 확장되는 가변 상세 스펙 필터 */}
          {(formData.categories?.includes("PC") ||
            formData.categories?.length === 0) && (
            <M.FormSection>
              <M.SectionLabel>
                <Cpu size={14} /> PC / 노트북 타겟 상세 사양
              </M.SectionLabel>
              <M.Grid style={{ gridTemplateColumns: "1.5fr 1fr" }}>
                <M.InputGroup>
                  <M.Input
                    type="text"
                    name="specCpu"
                    placeholder="CPU 명세 기입 (ex: M3, i7)"
                    value={formData.specCpu || ""}
                    onChange={handleInputChange}
                  />
                </M.InputGroup>
                <M.InputGroup>
                  <M.Input
                    type="text"
                    name="minRam"
                    placeholder="RAM (ex: 16GB)"
                    value={formData.minRam || ""}
                    onChange={handleInputChange}
                  />
                </M.InputGroup>
              </M.Grid>
            </M.FormSection>
          )}

          {/* {formData.categories?.includes("IPHONE") && (
            <M.FormSection>
              <M.SectionLabel>
                <Smartphone size={14} /> 모바일 단말 전용 통신망 분기
              </M.SectionLabel>
              <M.Select
                name="telecom"
                value={formData.telecom || "ALL"}
                onChange={handleInputChange}
              >
                <option value="ALL">전체 통신사</option>
                <option value="SKT">SKT 개통 단말</option>
                <option value="KT">KT 개통 단말</option>
                <option value="LGU+">LGU+ 개통 단말</option>
              </M.Select>
            </M.FormSection>
          )} */}

          {formData.categories?.includes("MONITOR") && (
            <M.FormSection>
              <M.SectionLabel>
                <Tv size={14} /> 디스플레이 화면 크기 필터
              </M.SectionLabel>
              <M.Input
                type="text"
                name="monitorSize"
                placeholder="조회할 화면 크기 기입 (ex: 27인치, 32인치)"
                value={formData.monitorSize || ""}
                onChange={handleInputChange}
              />
            </M.FormSection>
          )}
        </M.ModalBody>

        <M.ModalFooter
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 28px",
          }}
        >
          <ResetButton type="button" onClick={handleReset}>
            <RotateCcw size={14} /> 조건 전면 초기화
          </ResetButton>
          <div style={{ display: "flex", gap: "10px" }}>
            <M.CancelButton type="button" onClick={onClose}>
              닫기
            </M.CancelButton>
            <M.SubmitButton type="submit">조건 검색 적용</M.SubmitButton>
          </div>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

const DateRangeGridLocal = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  .split-wave {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 500;
  }
`;
const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  &:hover {
    color: #0f172a;
  }
`;
