import React, { useState, useRef, useEffect } from "react";
import { BadgeDollarSign, Check, Upload, File, X } from "lucide-react";
import useModalForm from "../../../../hooks/InfrastructureAsset/Modal/useModalForm";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import styled from "styled-components";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";

export default function SoftwarePurchaseModal({
  isOpen,
  onClose,
  selectedSW,
  selectedVersion,
  onSave,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const initialFormState = {
    licenseCount: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    logMemo: "",
  };

  const { formData, setFormData, handleInputChange, handleSubmit } =
    useModalForm({
      isOpen,
      mode: "create",
      targetAsset: selectedVersion,
      initialFormState,
      onSave,
      onClose,
    });

  // 🚀 모달 팝업 오픈 시 이전 파일 스냅샷 세션 초기화
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setSelectedFile(e.dataTransfer.files[0]);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.licenseCount) return;

    const multipartFormData = new FormData();
    multipartFormData.append("softwareId", selectedSW?.id);
    multipartFormData.append("versionId", selectedVersion?.id);
    multipartFormData.append("purchaseDate", formData.purchaseDate);
    multipartFormData.append("originalFileName", selectedFile?.name);
    multipartFormData.append(
      "licenseCount",
      Number(formData.licenseCount) || 0,
    );
    multipartFormData.append("logMemo", formData.logMemo);

    multipartFormData.append("softwarePurchase", selectedFile);
    onSave(multipartFormData);
    setSelectedFile(null);
    onClose();
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <BadgeDollarSign size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>
          라이선스 자산 조달 및 수량 등록
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#2563eb",
            fontFamily: "monospace",
            fontWeight: "700",
          }}
        >
          {selectedSW?.swName} · {selectedVersion?.versionStr} 계약 입고
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} titleZone={titleZone}>
      <M.StyledForm onSubmit={handleFormSubmit}>
        <M.ModalBody style={{ padding: "24px" }}>
          {/* 1. 계약 명칭 */}
          {/* <M.FormSection>
            <M.SectionLabel>
              구매 계약 및 조달 명칭 <span className="required">*</span>
            </M.SectionLabel>
            <M.Input
              type="text"
              name="contractName"
              required
              placeholder="예: 2026년 상반기 MS Office 정기 라이선스 증설 건"
              value={formData.contractName}
              onChange={handleInputChange}
            />
          </M.FormSection> */}

          {/* 2. 날짜 및 카피 수 수량 매트릭스 복합 그리드 */}
          <M.Grid>
            <M.InputGroup>
              <M.SectionLabel>구매 집행 및 계약일</M.SectionLabel>
              <M.Input
                type="date"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleInputChange}
                required
              />
            </M.InputGroup>
            <M.InputGroup>
              <M.SectionLabel>
                확보 수량 (Copy 수) <span className="required">*</span>
              </M.SectionLabel>
              <M.Input
                type="number"
                name="licenseCount"
                placeholder="추가할 수량 개수 입력"
                min="1"
                required
                value={formData.licenseCount}
                onChange={handleInputChange}
              />
            </M.InputGroup>
          </M.Grid>

          {/* 3. 품의서 파일 업로드 드롭존 & 비용 병렬 그리드 */}
          <M.Grid style={{ gridTemplateColumns: "1fr", marginTop: "4px" }}>
            <M.InputGroup>
              <M.SectionLabel>지출 증빙 사내 품의서 첨부</M.SectionLabel>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf, .png, .jpg, .jpeg"
              />

              {!selectedFile ? (
                <UploadDropZone
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} className="upload-icon" />
                  <span className="drop-title">
                    품의서 드래그 또는 마우스 클릭
                  </span>
                </UploadDropZone>
              ) : (
                <FileActiveBarZone>
                  <File size={14} className="file-icon" />
                  <span className="file-name">{selectedFile.name}</span>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X size={12} />
                  </button>
                </FileActiveBarZone>
              )}
            </M.InputGroup>
          </M.Grid>

          {/* 4. 메모 기술란 */}
          <M.FormSection style={{ marginTop: "14px" }}>
            <M.SectionLabel>구매 비고 및 계약 특이사항</M.SectionLabel>
            <M.TextArea
              rows={3}
              name="logMemo"
              placeholder="구독 갱신 조건이나 만료 기한 사양이 있을 경우 명시하세요."
              value={formData.logMemo}
              onChange={handleInputChange}
            />
          </M.FormSection>
        </M.ModalBody>
        <M.ModalFooter style={{ padding: "14px 24px" }}>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit" style={{ backgroundColor: "#2563eb" }}>
            <Check size={16} /> 자산 증서 등록
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

/* ─── 🎨 대시보드 핏 업로드 컴포넌트 전용 스타일 ─── */
const UploadDropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  height: 64px;
  box-sizing: border-box;
  transition: all 0.15s ease-in-out;
  .upload-icon {
    color: #64748b;
    margin-bottom: 2px;
  }
  .drop-title {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
  }
  &:hover {
    background: #ecfdf5;
    border-color: #10b981;
    .upload-icon {
      color: #10b981;
    }
    .drop-title {
      color: #047857;
    }
  }
`;

const FileActiveBarZone = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  background: #f0fdf4;
  height: 64px;
  box-sizing: border-box;
  gap: 6px;
  .file-icon {
    color: #059669;
    flex-shrink: 0;
  }
  .file-name {
    font-size: 11.5px;
    font-weight: 700;
    color: #047857;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .clear-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      color: #dc2626;
    }
  }
`;
