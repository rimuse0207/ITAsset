import React, { useRef, useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Edit3,
  Monitor,
  UploadCloud,
  FileIcon,
  X,
} from "lucide-react";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import useSoftwareForm from "../../../../hooks/InfrastructureAsset/useSoftwareForm";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import styled from "styled-components";

export default function SoftwareFileModal({
  isOpen,
  onClose,
  credMode = "create",
  targetSW,
  targetVersion,
  targetFile,
  onSave,
}) {
  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const initialFormState = {
    fileName: credMode === "edit" ? targetFile?.fileName || "" : "",
    osType: credMode === "edit" ? targetFile?.osType || "Windows" : "Windows",
    fileSize: credMode === "edit" ? targetFile?.fileSize || "" : "",
    fileObject: null,
    isExistingFile: credMode === "edit",
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
    targetSW: credMode === "edit" ? { versions: [targetFile] } : null,
    initialFormState,
    onSave,
    onClose,
  });

  useEffect(() => {
    if (isOpen && credMode === "edit" && targetFile) {
      setFormData({
        fileName: targetFile.fileName || "",
        osType: targetFile.osType || "Windows",
        fileSize: targetFile.fileSize || "",
        fileObject: null,
        isExistingFile: true,
      });
    }
  }, [isOpen, credMode, targetFile?.fileName, targetFile?.osType]);

  const handleSaveFile = async (e, data) => {
    e.preventDefault();
    const submitFormData = new FormData();

    submitFormData.append("osType", data.osType);
    submitFormData.append("fileName", data.fileName);
    submitFormData.append("fileSize", data.fileSize);
    submitFormData.append("swCode", targetSW?.swCode || "");
    submitFormData.append("versionId", targetVersion?.id || "");

    if (credMode === "edit" && targetFile?.id) {
      submitFormData.append("fileId", targetFile.id);
    }

    if (data.fileObject) {
      // Case A: 사용자가 새 파일을 드롭하거나 첨부하여 변경 정보가 존재할 때
      submitFormData.append("softwareFiles", data.fileObject);
      submitFormData.append("isFileChanged", "true"); // 백엔드 분기용 힌트 플래그
    }

    if (!data.fileObject && credMode === "edit") {
      alert("파일이 변경 된 항목이 없습니다.");

      return;
    }
    onSave(submitFormData);
    onClose();
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleFileProcess = (file) => {
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      fileName: file.name,
      fileSize: formatBytes(file.size),
      fileObject: file,
      isExistingFile: false,
    }));
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Layers
        size={18}
        style={{ color: credMode === "edit" ? "#2563eb" : "#2563eb" }}
      />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {credMode === "edit"
            ? "배포 바이너리 사양 수정"
            : "플랫폼별 배포 설치 파일 업로드"}
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
          Scope: {targetSW?.swName} [{targetVersion?.versionStr}]
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="520px"
      titleZone={titleZone}
    >
      <M.StyledForm
        onSubmit={(e) => {
          handleSaveFile(e, formData);
        }}
      >
        <M.ModalBody style={{ padding: "28px" }}>
          <M.FormSection style={{ marginBottom: 0 }}>
            <M.Grid>
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  <Monitor size={13} /> 대상 타겟 OS (Platform)
                </M.SectionLabel>
                <M.ChipGroup>
                  {["Windows", "macOS", "Linux", "공용"].map((os) => (
                    <M.FilterChip
                      key={os}
                      type="button"
                      selected={formData?.osType === os}
                      onClick={() =>
                        handleDirectChange
                          ? handleDirectChange("osType", os)
                          : setFormData((prev) => ({ ...prev, osType: os }))
                      }
                    >
                      {os}
                    </M.FilterChip>
                  ))}
                </M.ChipGroup>
              </M.InputGroup>

              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  바이너리 패키지 파일 첨부 <span className="required">*</span>
                </M.SectionLabel>
                <HiddenFileInput
                  ref={fileInputRef}
                  type="file"
                  accept=".msi,.exe,.pkg,.dmg,.zip,.tar.gz"
                  onChange={(e) => handleFileProcess(e.target.files[0])}
                />

                <UploadDropZone
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  isActive={isDragActive}
                  hasFile={!!formData?.fileName}
                >
                  {!formData?.fileName ? (
                    <div className="empty-state-zone" onClick={onButtonClick}>
                      <UploadCloud size={32} className="upload-icon" />
                      <div className="upload-text">
                        설치 바이너리 파일을 마우스로 끌어오거나 클릭하세요
                      </div>
                      <div className="upload-sub">
                        확장자: .msi, .exe, .pkg, .dmg, .zip, .tar.gz 지원
                      </div>
                    </div>
                  ) : (
                    <div className="file-active-zone">
                      <FileIcon size={24} className="active-file-icon" />
                      <div className="file-detail-textZone">
                        <div className="selected-file-name">
                          {formData.fileName}
                        </div>
                        <div className="selected-file-size">
                          {/* 🚀 기존 파일 유지 상태와 신규 등록 상태 문구 차별화 명세화 */}
                          {formData.isExistingFile
                            ? "기존 보관소 파일 유지 중"
                            : `신규 파일 용량: ${formData.fileSize}`}
                        </div>
                      </div>
                      <FileResetButton
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            fileName: "",
                            fileSize: "",
                            fileObject: null,
                            isExistingFile: false, // 완전 초기화
                          }))
                        }
                      >
                        <X size={14} />
                      </FileResetButton>
                    </div>
                  )}
                </UploadDropZone>
              </M.InputGroup>
            </M.Grid>
          </M.FormSection>
        </M.ModalBody>

        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          {/* 🚀 [유효성 해제]: 기존 보관소 파일이 세팅되어 있어도 저장 단추가 활성화되도록 보정 */}
          <M.SubmitButton type="submit" disabled={!formData?.fileName}>
            {credMode === "edit" ? (
              <>
                <Edit3 size={14} /> 파일 데이터 업데이트
              </>
            ) : (
              <>
                <Plus size={14} /> 서버 보관소 업로드 인계
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

const HiddenFileInput = styled.input`
  display: none;
`;
const FileResetButton = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;
const UploadDropZone = styled.div`
  width: 100%;
  padding: 24px;
  border: 2px dashed ${(props) => (props.isActive ? "#2563eb" : "#e2e8f0")};
  border-radius: 12px;
  background: ${(props) => (props.isActive ? "#eff6ff" : "#f8fafc")};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  &:hover {
    border-color: #2563eb;
    background: ${(props) => (props.hasFile ? "#f8fafc" : "#eff6ff")};
  }
  .empty-state-zone {
    text-align: center;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 100%;
    .upload-icon {
      color: #94a3b8;
      transition: color 0.15s;
    }
    &:hover .upload-icon {
      color: #2563eb;
    }
    .upload-text {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
    }
    .upload-sub {
      font-size: 11px;
      color: #94a3b8;
    }
  }
  .file-active-zone {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 12px;
    background: #fff;
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    position: relative;
    .active-file-icon {
      color: #2563eb;
    }
    .file-detail-textZone {
      flex: 1;
      min-width: 0;
    }
    .selected-file-name {
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .selected-file-size {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
      margin-top: 2px;
    }
  }
`;
