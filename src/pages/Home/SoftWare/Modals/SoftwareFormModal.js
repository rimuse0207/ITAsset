import React from "react";
import { Package, Layers, Check, Edit3, Lock, Unlock } from "lucide-react";
import styled from "styled-components";

import * as M from "../../HardWare/Modals/public/ModalStyle";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import useSoftwareForm from "../../../../hooks/InfrastructureAsset/useSoftwareForm";

export default function SoftwareFormModal({
  isOpen,
  onClose,
  mode = "create",
  targetSW,
  onSave,
}) {
  const initialFormState = {
    swCode: "",
    swName: "",
    swVendor: "",
    swCategory: "오피스/생산성",
    totalLicenses: "",
    isLicenseRequired: true,
  };

  const { formData, handleInputChange, handleDirectChange, handleSubmit } =
    useSoftwareForm({
      isOpen,
      mode,
      targetSW,
      initialFormState,
      onSave,
      onClose,
    });

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Package size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {mode === "edit"
            ? "소프트웨어 제품 정보 수정"
            : "사내 신규 S/W 마스터 등록"}
        </h2>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="500px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={handleSubmit}>
        <M.ModalBody style={{ padding: "28px" }}>
          {/* 구역 1: 라이선스 관리 정책 구분 */}
          <M.FormSection>
            <M.SectionLabel>
              라이선스 관리 정책 구분 <span className="required">*</span>
            </M.SectionLabel>
            <PolicySelectorGrid>
              <PolicyCard
                type="button"
                // 🚀 안전 배리어: 데이터가 로드 중일 때를 위해 기본값 true 처리 분기
                selected={formData?.isLicenseRequired !== false}
                onClick={() => handleDirectChange("isLicenseRequired", true)}
              >
                <div className="radio-circle">
                  {formData?.isLicenseRequired !== false && (
                    <div className="checked-dot" />
                  )}
                </div>
                <div className="policy-txt">
                  <div className="p-title">
                    <Lock size={12} className="icon-lock" /> 상용 라이선스 (인증
                    필수)
                  </div>
                  <div className="p-desc">
                    정품 키 매트릭스 관리 및 지출 품의서, 보유 카피 수 한도를
                    엄격하게 통제합니다.
                  </div>
                </div>
              </PolicyCard>

              <PolicyCard
                type="button"
                selected={formData?.isLicenseRequired === false}
                onClick={() => handleDirectChange("isLicenseRequired", false)}
              >
                <div className="radio-circle">
                  {formData?.isLicenseRequired === false && (
                    <div className="checked-dot" />
                  )}
                </div>
                <div className="policy-txt">
                  <div className="p-title">
                    <Unlock size={12} className="icon-unlock" /> 무료 / 오픈소스
                    (인증 불필요)
                  </div>
                  <div className="p-desc">
                    별도의 구매 증서나 제품키 없이 임직원 배포 및 소프트웨어
                    인벤토리 추적만 가동합니다.
                  </div>
                </div>
              </PolicyCard>
            </PolicySelectorGrid>
          </M.FormSection>

          {/* 구역 2: 소프트웨어 제품 기본 명세 */}
          <M.FormSection>
            <M.SectionTitle>
              <Layers size={15} /> 소프트웨어 제품 기본 명세
            </M.SectionTitle>
            <M.Grid>
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  소프트웨어 명 <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="text"
                  name="swName"
                  required
                  placeholder="예: Adobe Creative Cloud, IntelliJ, VS Code, Google Chrome"
                  // 🚀 [수정의 핵심]: formData가 빈 값일 때 undefined가 찍혀 락 걸리는 버그 차단
                  value={formData?.swName || ""}
                  onChange={handleInputChange}
                  style={{ paddingLeft: "12px" }}
                />
              </M.InputGroup>
              <M.InputGroup>
                <M.SectionLabel>
                  제조사 <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="text"
                  name="swVendor"
                  required
                  placeholder="예: Adobe, JetBrains, Microsoft, Google"
                  // 🚀 안전 배리어 주입
                  value={formData?.swVendor || ""}
                  onChange={handleInputChange}
                  style={{ paddingLeft: "12px" }}
                />
              </M.InputGroup>
              <M.InputGroup>
                <M.SectionLabel>카테고리</M.SectionLabel>
                <M.Select
                  name="swCategory"
                  // 🚀 안전 배리어 주입
                  value={formData?.swCategory || "오피스/생산성"}
                  onChange={handleInputChange}
                  style={{ paddingLeft: "12px" }}
                >
                  <option value="오피스/생산성">오피스 / 생산성</option>
                  <option value="그래픽/디자인">그래픽 / 디자인</option>
                  <option value="개발도구">개발 도구</option>
                  <option value="보안/인프라">보안 / 인프라</option>
                </M.Select>
              </M.InputGroup>
            </M.Grid>
          </M.FormSection>
        </M.ModalBody>

        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit">
            {mode === "edit" ? (
              <>
                <Edit3 size={14} /> 수정 반영
              </>
            ) : (
              <>
                <Check size={16} /> 제품 추가
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

/* ─── 🎨 스타일 컴포넌트 명세 유지 ─── */
const PolicySelectorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
`;
const PolicyCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  width: 100%;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  .radio-circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 1px solid #cbd5e1;
    background: #fff;
    margin-top: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.1s;
  }
  .checked-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #2563eb;
  }
  .policy-txt {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .p-title {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 4px;
    .icon-lock {
      color: #475569;
    }
    .icon-unlock {
      color: #0d9488;
    }
  }
  .p-desc {
    font-size: 11.5px;
    color: #64748b;
    line-height: 1.4;
    font-weight: 500;
  }
  ${(props) =>
    props.selected &&
    ` background: #f0f7ff; border-color: #bfdbfe; box-shadow: 0 1px 3px rgba(37, 99, 235, 0.02); .radio-circle { border-color: #2563eb; } .p-title { color: #2563eb; .icon-lock, .icon-unlock { color: #2563eb; } } .p-desc { color: #1e40af; } `} &:hover {
    ${(props) =>
      !props.selected && "border-color: #cbd5e1; background: #f1f5f9;"}
  }
`;
