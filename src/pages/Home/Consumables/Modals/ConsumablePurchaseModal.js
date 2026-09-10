import React, { useState, useRef, useEffect } from "react";
import { BadgeDollarSign, Check, Upload, File, X, Edit3 } from "lucide-react";
import styled from "styled-components";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import {
  FileActiveBarZone,
  UploadDropZone,
} from "../../SoftWare/Modals/SoftwarePurchaseModal";
import moment from "moment/moment";

export default function ConsumablePurchaseModal({
  isOpen,
  onClose,
  targetItem,
  onSave,
  mode = "create",
  targetHistory,
}) {
  const getTodayString = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    restockCount: "",
    purchaseDate: getTodayString(),
    unitPrice: "",
    logMemo: "",
  });

  const [selectedFile, setSelectedFile] = useState(null); // 새로 첨부한 파일
  const [existingFile, setExistingFile] = useState(null); // 기존 첨부 파일명
  const [isDeleted, setIsDeleted] = useState(false); // 삭제 여부 플래그

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && targetHistory) {
        setFormData({
          purchaseId: targetHistory.purchaseId || targetHistory.id,
          restockCount: targetHistory.restockCount || "",
          purchaseDate: targetHistory.purchaseDate || getTodayString(),
          unitPrice: targetHistory.unitPrice || "",
          logMemo: targetHistory.logMemo || "",
        });
        setSelectedFile(null);
        setExistingFile(targetHistory.originalFileName || null);
        setIsDeleted(false);
      } else {
        setFormData({
          restockCount: "",
          purchaseDate: getTodayString(),
          unitPrice: "",
          logMemo: "",
        });
        setSelectedFile(null);
        setExistingFile(null);
        setIsDeleted(false);
      }
    }
  }, [isOpen, mode, targetHistory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setIsDeleted(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setIsDeleted(false);
    }
  };

  const handleRemoveFile = () => {
    if (selectedFile) {
      setSelectedFile(null);
    } else if (existingFile) {
      setExistingFile(null);
      setIsDeleted(true);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.restockCount) return;

    const multipartFormData = new FormData();
    if (mode === "edit" && formData.purchaseId) {
      multipartFormData.append("purchaseId", formData.purchaseId);
    }

    multipartFormData.append("consumableId", targetItem?.id);
    multipartFormData.append("purchaseDate", formData.purchaseDate);
    multipartFormData.append("restockCount", Number(formData.restockCount));
    multipartFormData.append("unitPrice", Number(formData.unitPrice) || 0);
    multipartFormData.append("logMemo", formData.logMemo);

    if (selectedFile) {
      multipartFormData.append("isChanged", "true");
      multipartFormData.append("originalFileName", selectedFile.name);
      multipartFormData.append("consumablePurchase", selectedFile);
    } else if (isDeleted) {
      multipartFormData.append("isDeleted", "true");
    }

    onSave(multipartFormData);
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <BadgeDollarSign
        size={18}
        style={{ color: mode === "edit" ? "#f59e0b" : "#10b981" }}
      />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>
          {mode === "edit"
            ? "입고 및 결재 내역 수정"
            : "소모품 입고 및 결재 등록"}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: mode === "edit" ? "#f59e0b" : "#10b981",
            fontFamily: "monospace",
            fontWeight: "700",
          }}
        >
          대상: {targetItem?.name}
        </p>
      </div>
    </div>
  );

  const hasDisplayFile = selectedFile || (existingFile && !isDeleted);

  return (
    <ModalLayout isOpen={isOpen} onClose={onClose} titleZone={titleZone}>
      <M.StyledForm onSubmit={handleFormSubmit}>
        <M.ModalBody style={{ padding: "24px" }}>
          <M.Grid>
            <M.InputGroup className="full-width">
              <M.SectionLabel>구매 및 입고 일자</M.SectionLabel>
              <M.Input
                type="date"
                name="purchaseDate"
                value={moment(formData.purchaseDate).format("YYYY-MM-DD")}
                onChange={handleInputChange}
                required
              />
            </M.InputGroup>
          </M.Grid>

          <M.Grid style={{ marginTop: "14px" }}>
            <M.InputGroup>
              <M.SectionLabel>
                입고 수량 <span className="required">*</span>
              </M.SectionLabel>
              <M.Input
                type="number"
                name="restockCount"
                placeholder="추가 수량"
                min="1"
                required
                value={formData.restockCount}
                onChange={handleInputChange}
              />
            </M.InputGroup>

            <M.InputGroup>
              <M.SectionLabel>단가 (원)</M.SectionLabel>
              <M.Input
                type="number"
                name="unitPrice"
                placeholder="1개당 금액"
                min="0"
                value={formData.unitPrice}
                onChange={handleInputChange}
              />
            </M.InputGroup>
          </M.Grid>

          <M.Grid style={{ gridTemplateColumns: "1fr", marginTop: "14px" }}>
            <M.InputGroup>
              <M.SectionLabel>
                지출 증빙 사내 품의서 / 영수증 첨부
              </M.SectionLabel>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
                accept=".pdf, .png, .jpg, .jpeg"
              />

              {!hasDisplayFile ? (
                <UploadDropZone
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} className="upload-icon" />
                  <span className="drop-title">
                    결재 서류 드래그 또는 마우스 클릭{" "}
                    {mode === "edit" && "(변경 시에만 첨부)"}
                  </span>
                </UploadDropZone>
              ) : (
                <FileActiveBarZone>
                  <File size={14} className="file-icon" />
                  <span className="file-name">
                    {selectedFile ? selectedFile.name : existingFile}
                  </span>
                  <button
                    type="button"
                    className="clear-btn"
                    onClick={handleRemoveFile}
                  >
                    <X size={12} />
                  </button>
                </FileActiveBarZone>
              )}
            </M.InputGroup>
          </M.Grid>

          <M.FormSection style={{ marginTop: "14px" }}>
            <M.SectionLabel>비고 및 특이사항</M.SectionLabel>
            <M.TextArea
              rows={3}
              name="logMemo"
              placeholder="예: DHK-BUY-202609 기안 승인 건"
              value={formData.logMemo}
              onChange={handleInputChange}
            />
          </M.FormSection>
        </M.ModalBody>
        <M.ModalFooter style={{ padding: "14px 24px" }}>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton
            type="submit"
            style={{ backgroundColor: mode === "edit" ? "#f59e0b" : "#10b981" }}
          >
            {mode === "edit" ? (
              <>
                <Edit3 size={16} /> 정보 수정 완료
              </>
            ) : (
              <>
                <Check size={16} /> 입고 수량 반영
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}
