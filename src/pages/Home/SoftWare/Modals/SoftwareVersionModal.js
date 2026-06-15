import React from "react";
import { Shield, Calendar, Check, Edit3 } from "lucide-react";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import useSoftwareForm from "../../../../hooks/InfrastructureAsset/useSoftwareForm";
import * as M from "../../HardWare/Modals/public/ModalStyle";

export default function SoftwareVersionModal({
  isOpen,
  onClose,
  versionMode = "create",
  targetSW,
  targetVersion,
  onSave,
}) {
  const initialFormState = {
    versionStr: "",
    releaseDate: new Date().toISOString().split("T")[0],
  };

  const { formData, handleInputChange, handleSubmit } = useSoftwareForm({
    isOpen,
    mode: versionMode,
    targetAsset: null,
    // 🚀 훅 내부에서 원시값 디펜던시(targetSW.versions[0].versionStr)를 감시하므로
    // 이제 이 리터럴 객체를 그대로 던져도 무한 루프가 터지지 않고 완벽히 작동합니다.
    targetSW: versionMode === "VER_EDIT" ? { versions: [targetVersion] } : null,
    initialFormState,
    onSave,
    onClose,
  });

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {/* 🚀 사내 관제 플랫폼 시그니처 블루 톤앤매너 테마로 일치화 */}
      <Shield size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {versionMode === "VER_EDIT"
            ? "배포 버전 정보 수정"
            : "새로운 배포 버전 등록"}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#2563eb",
            fontWeight: "600",
            fontFamily: "monospace",
            margin: "2px 0 0 0",
          }}
        >
          Target S/W: {targetSW?.swName}
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="460px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={handleSubmit}>
        <M.ModalBody style={{ padding: "28px" }}>
          <M.FormSection style={{ marginBottom: 0 }}>
            <M.Grid>
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  배포 버전 식별자 <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="text"
                  name="versionStr"
                  required
                  placeholder="예: v16.0.18, v2026.2"
                  // 🚀 [수정 포인트]: 렌더링 시 언디파인드 제어 버그 전면 방어
                  value={formData?.versionStr || ""}
                  onChange={handleInputChange}
                  style={{ paddingLeft: "12px" }}
                />
              </M.InputGroup>

              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <Calendar size={13} /> 릴리즈 배포 일자
                </M.SectionLabel>
                <M.Input
                  type="date"
                  name="releaseDate"
                  // 🚀 [수정 포인트]: 데이터 포커싱 안전벽 설치
                  value={formData?.releaseDate || ""}
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
          <M.SubmitButton type="submit">
            {versionMode === "VER_EDIT" ? (
              <>
                <Edit3 size={14} /> 버전 수정
              </>
            ) : (
              <>
                <Check size={16} /> 버전 추가
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}
