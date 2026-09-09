import React, { useState, useRef, useEffect } from "react";
import {
  Package,
  Check,
  Edit3,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import styled from "styled-components";

import * as M from "../../HardWare/Modals/public/ModalStyle";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";

export default function ConsumableFormModal({
  isOpen,
  onClose,
  mode = "create",
  targetItem,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "PC 주변기기",
    itemType: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && targetItem) {
        setFormData({
          name: targetItem.name || "",
          category: targetItem.category || "PC 주변기기",
          itemType: targetItem.itemType || "",
        });
        setSelectedImage(null);
      } else {
        setFormData({ name: "", category: "PC 주변기기", itemType: "" });
        setSelectedImage(null);
      }
    }
  }, [isOpen, mode, targetItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0])
      setSelectedImage(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0])
      setSelectedImage(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("category", formData.category);
    payload.append("itemType", formData.itemType);
    if (selectedImage) payload.append("thumbnail", selectedImage);

    onSave(payload);
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <Package size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {mode === "edit" ? "소모품 자산 정보 수정" : "사내 신규 소모품 등록"}
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
          {/* 구역 1: 기본 정보 */}
          <M.FormSection>
            <M.Grid>
              <M.InputGroup className="full-width">
                <M.SectionLabel>
                  소모품 명 <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="text"
                  name="name"
                  required
                  placeholder="예: 로지텍 MX Master 3S, 27인치 모니터"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </M.InputGroup>

              <M.InputGroup>
                <M.SectionLabel>대분류 카테고리</M.SectionLabel>
                <M.Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="PC 주변기기">PC 주변기기</option>
                  <option value="서버실">서버실</option>
                  <option value="IT 용품">IT 용품</option>
                  <option value="기타"> 기타</option>
                </M.Select>
              </M.InputGroup>

              {/* 🚀 수정됨: 안전재고 삭제, 세부 품목 직접 작성란 추가 */}
              <M.InputGroup>
                <M.SectionLabel>
                  세부 품목 <span className="required">*</span>
                </M.SectionLabel>
                <M.Input
                  type="text"
                  name="itemType"
                  required
                  placeholder="예: 마우스, 키보드, 랜선"
                  value={formData.itemType}
                  onChange={handleInputChange}
                />
              </M.InputGroup>
            </M.Grid>
          </M.FormSection>

          {/* 구역 2: 대표 이미지 첨부 */}
          <M.FormSection style={{ marginBottom: 0 }}>
            <M.SectionLabel>소모품 대표 이미지 (썸네일)</M.SectionLabel>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept="image/*"
            />
            {!selectedImage ? (
              <UploadDropZone
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={16} className="upload-icon" />
                <span className="drop-title">
                  제품 사진 드래그 또는 마우스 클릭
                </span>
              </UploadDropZone>
            ) : (
              <FileActiveBarZone>
                <ImageIcon size={14} className="file-icon" />
                <span className="file-name">{selectedImage.name}</span>
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={12} />
                </button>
              </FileActiveBarZone>
            )}
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
                <Check size={16} /> 품목 추가
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

/* ─── 🎨 공통 업로드 스타일 ─── */
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
