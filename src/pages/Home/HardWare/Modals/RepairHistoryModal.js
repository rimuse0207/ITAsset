import React, { useState, useRef } from "react";
import { Wrench, Check, Upload, File, X } from "lucide-react";
import ModalLayout from "./public/ModalLayout";
import useModalForm from "../../../../hooks/InfrastructureAsset/Modal/useModalForm";
import * as M from "./public/ModalStyle";
import styled from "styled-components";

export default function RepairHistoryModal({
  isOpen,
  onClose,
  targetAsset,
  onSave,
}) {
  // 🚀 1. 파일 상태 관리를 위한 로컬 상태 및 Ref 정의
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const initialFormState = {
    type: "정기 점검",
    technicianType: "internal",
    cost: "",
    title: "",
    desc: "",
    date: new Date().toISOString().split("T")[0],
  };

  const { formData, handleInputChange, handleDirectChange, handleSubmit } =
    useModalForm({
      isOpen,
      mode: "create",
      targetAsset,
      initialFormState,
      onSave,
      onClose,
    });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 파일 제거 핸들러
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.desc) return;

    const multipartFormData = new FormData();

    multipartFormData.append("assetId", targetAsset.id);
    multipartFormData.append("type", formData.type);
    multipartFormData.append("date", formData.date);
    multipartFormData.append("cost", Number(formData.cost) || 0);
    multipartFormData.append("title", formData.title);
    multipartFormData.append("desc", formData.desc);
    multipartFormData.append(
      "technician",
      formData.technicianType === "internal"
        ? "사내 자가 정비"
        : "제조사 공식 서비스센터",
    );

    if (selectedFile) {
      multipartFormData.append("repairProposalFile", selectedFile);
    }

    onSave(multipartFormData);
    removeFile();
    onClose();
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Wrench size={18} style={{ color: "#ef4444" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>
          하드웨어 정비 및 수리 이력 추가
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
      {/* 🚀 커스텀 서브밋 함수 바인딩 */}
      <M.StyledForm onSubmit={handleFormSubmit}>
        <M.ModalBody>
          {/* 1. 수리 유형 */}
          <M.FormSection>
            <M.SectionLabel>수리 및 정비 유형</M.SectionLabel>
            <M.ChipGroup>
              {[
                "정기 점검",
                "하드웨어 고장",
                "액정/외관 파손",
                "부품 업그레이드",
              ].map((type) => (
                <M.FilterChip
                  key={type}
                  type="button"
                  selected={formData.type === type}
                  onClick={() => handleDirectChange("type", type)}
                >
                  {type}
                </M.FilterChip>
              ))}
            </M.ChipGroup>
          </M.FormSection>

          {/* 2. 날짜 및 주체 */}
          <M.Grid>
            <M.InputGroup>
              <M.SectionLabel>수리 완료 일자</M.SectionLabel>
              <M.Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </M.InputGroup>
            <M.InputGroup>
              <M.SectionLabel>정비 처리 주체</M.SectionLabel>
              <M.Select
                name="technicianType"
                value={formData.technicianType}
                onChange={handleInputChange}
              >
                <option value="internal">사내 자가 정비 (부품교체 등)</option>
                <option value="center">
                  제조사 공식 서비스센터 (외판수리 등)
                </option>
              </M.Select>
            </M.InputGroup>
          </M.Grid>

          <M.Grid style={{ gridTemplateColumns: "1fr" }}>
            <M.FormSection style={{ marginBottom: 0 }}>
              <M.SectionLabel>사내 지출 결재 품의서 첨부</M.SectionLabel>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf, .png, .jpg, .jpeg, .docx"
              />

              {!selectedFile ? (
                // 파일이 없을 때 노출되는 드롭존 박스
                <UploadDropZone
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={20} className="upload-icon" />
                  <span className="drop-title">
                    여기로 파일을 드래그하거나 클릭하세요
                  </span>
                  <span className="drop-sub">PDF, PNG, JPG (최대 10MB)</span>
                </UploadDropZone>
              ) : (
                // 파일이 업로드 되었을 때 스냅샷 노출 바
                <FileActiveBarZone>
                  <File size={16} className="file-icon" />
                  <span className="file-name">{selectedFile.name}</span>
                  <span className="file-size">
                    ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={removeFile}
                  >
                    <X size={14} />
                  </button>
                </FileActiveBarZone>
              )}
            </M.FormSection>
          </M.Grid>
          <M.InputGroup>
            <M.SectionLabel>정비 소요 비용 (원)</M.SectionLabel>
            <M.Input
              type="number"
              name="cost"
              placeholder="0"
              value={formData.cost}
              onChange={handleInputChange}
            />
          </M.InputGroup>

          {/* 4. 제목 */}
          <M.FormSection>
            <M.SectionLabel>
              정비 조치 제목 <span className="required">*</span>
            </M.SectionLabel>
            <M.Input
              type="text"
              name="title"
              placeholder="예: 상판 디스플레이 및 하우징 통교체 정비"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </M.FormSection>

          {/* 5. 상세 내용 */}
          <M.FormSection>
            <M.SectionLabel>
              상세 정비 내역 <span className="required">*</span>
            </M.SectionLabel>
            <M.TextArea
              rows={4}
              name="desc"
              placeholder="상세 영수증 번호나 조치 소견 내용을 기입하세요."
              value={formData.desc}
              onChange={handleInputChange}
              required
            />
          </M.FormSection>
        </M.ModalBody>

        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit">
            <Check size={16} /> 이력 및 파일 저장
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

/* ─── 🎨 드롭존 및 파일 라이브 프리뷰 스타일 ─── */
const UploadDropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  text-align: center;
  height: 76px;
  box-sizing: border-box;

  .upload-icon {
    color: #64748b;
    margin-bottom: 4px;
  }
  .drop-title {
    font-size: 11.5px;
    font-weight: 700;
    color: #475569;
  }
  .drop-sub {
    font-size: 10px;
    color: #94a3b8;
    margin-top: 1px;
  }

  &:hover {
    background: #eff6ff;
    border-color: #3b82f6;
    .upload-icon {
      color: #3b82f6;
    }
  }
`;

const FileActiveBarZone = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  background: #f0f7ff;
  height: 76px;
  box-sizing: border-box;
  gap: 8px;

  .file-icon {
    color: #2563eb;
    flex-shrink: 0;
  }
  .file-name {
    font-size: 12px;
    font-weight: 700;
    color: #1e3a8a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .file-size {
    font-size: 11px;
    color: #60a5fa;
    font-family: monospace;
  }

  .clear-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: 50%;
    &:hover {
      background: #fee2e2;
      color: #ef4444;
    }
  }
`;
