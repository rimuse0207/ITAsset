import React from "react";
import { Key, Plus, Edit3, ShieldCheck, Tag, FileText } from "lucide-react"; // 🚀 보안 및 식별 전용 아이콘 매핑
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import useSoftwareForm from "../../../../hooks/InfrastructureAsset/useSoftwareForm";
import * as M from "../../HardWare/Modals/public/ModalStyle";

/**
 * @param {string} credMode - 'create' (제품 키 최초 발급/추가) | 'edit' (기존 키 정보/메모 수정)
 * @param {object} targetSW - 현재 선택된 S/W 마스터 객체
 * @param {object} targetVersion - 현재 속해있는 배포 버전 객체
 * @param {object} targetKey - credMode가 'edit'일 때 넘어오는 단일 제품 키 데이터 객체
 */
export default function SoftwareKeyModal({
  isOpen,
  onClose,
  credMode = "create",
  targetSW,
  targetVersion,
  targetKey,
  onSave,
}) {
  const initialFormState = {
    keyType:
      credMode === "edit"
        ? targetKey?.keyType || "볼륨 라이선스"
        : "볼륨 라이선스",
    keyStr: credMode === "edit" ? targetKey?.keyStr || "" : "",
    description: credMode === "edit" ? targetKey?.description || "" : "",
  };

  const { formData, handleInputChange, handleDirectChange, handleSubmit } =
    useSoftwareForm({
      isOpen,
      mode: credMode,
      targetAsset: null,
      targetSW: credMode === "edit" ? { versions: [targetKey] } : null,
      initialFormState,
      onSave,
      onClose,
    });

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Key
        size={18}
        style={{ color: credMode === "edit" ? "#f59e0b" : "#2563eb" }}
      />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {credMode === "edit"
            ? "정품 라이선스 자산 키 수정"
            : "정품 라이선스 자산 키 신규 발급"}
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
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <Tag size={13} /> 라이선스 계약 유형 (Key Type)
                </M.SectionLabel>
                <M.ChipGroup>
                  {["볼륨 라이선스"].map((type) => (
                    <M.FilterChip
                      key={type}
                      type="button"
                      selected={formData.keyType === type}
                      onClick={() =>
                        handleDirectChange
                          ? handleDirectChange("keyType", type)
                          : handleInputChange({
                              target: { name: "keyType", value: type },
                            })
                      }
                    >
                      {type}
                    </M.FilterChip>
                  ))}
                </M.ChipGroup>
              </M.InputGroup>

              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <ShieldCheck size={13} /> 제품 인증 키 번호 (License Key
                  String) <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="text"
                  name="keyStr"
                  required
                  placeholder="예: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                  value={formData.keyStr}
                  onChange={handleInputChange}
                  style={{
                    paddingLeft: "12px",
                    fontFamily: "monospace",
                    fontWeight: "700",
                    letterSpacing: "0.03em",
                  }}
                />
              </M.InputGroup>

              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <FileText size={13} /> 관리자 식별 메모 (Description)
                </M.SectionLabel>
                <M.TextArea
                  rows={2}
                  name="description"
                  placeholder="예: 디자인팀 전용 구독 갱신 건, 2027년 만료 예정 등"
                  value={formData.description}
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
            {credMode === "edit" ? (
              <>
                <Edit3 size={14} /> 자산 키 수정 완료
              </>
            ) : (
              <>
                <Plus size={14} /> 정품 시리얼 키 등록
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}
