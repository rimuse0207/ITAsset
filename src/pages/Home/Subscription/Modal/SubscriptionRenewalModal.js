// 🚀 Modals/SubscriptionRenewalModal.js
import React, { useState, useRef, useEffect } from "react";
import { RefreshCw, Check, Upload, File, X } from "lucide-react";
import moment from "moment";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import * as M from "../../HardWare/Modals/public/ModalStyle";
import {
  FileActiveBarZone,
  UploadDropZone,
} from "../../SoftWare/Modals/SoftwarePurchaseModal";

export default function SubscriptionRenewalModal({
  isOpen,
  onClose,
  targetVendor,
  targetItem,
  onSave,
}) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const getNextYearDate = (baseDateStr) => {
    if (!baseDateStr) return moment().add(1, "years").format("YYYY-MM-DD");
    return moment(baseDateStr).add(1, "years").format("YYYY-MM-DD");
  };

  // 🚀 subscriptionRenewals 테이블 컬럼명과 100% 동일하게 구성
  const [formData, setFormData] = useState({
    renewalDate: moment().format("YYYY-MM-DD"),
    prevExpireDate: "",
    nextExpireDate: "",
    renewalCost: "",
    logMemo: "",
  });

  useEffect(() => {
    if (isOpen && targetItem) {
      setFormData({
        renewalDate: moment().format("YYYY-MM-DD"),
        prevExpireDate: targetItem.expireDate,
        nextExpireDate: getNextYearDate(targetItem.expireDate),
        renewalCost: "",
        logMemo: "",
      });
      setSelectedFile(null);
    }
  }, [isOpen, targetItem]);

  const handleQuickAddYear = (years) => {
    const calculated = moment(formData.prevExpireDate)
      .add(years, "years")
      .format("YYYY-MM-DD");
    setFormData((prev) => ({ ...prev, nextExpireDate: calculated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    // 🚀 DB 컬럼명(카멜케이스) 그대로 FormData 주입
    payload.append("itemId", targetItem.itemId);
    payload.append("vendorId", targetVendor.vendorId);
    payload.append("renewalDate", formData.renewalDate);
    payload.append("prevExpireDate", formData.prevExpireDate);
    payload.append("nextExpireDate", formData.nextExpireDate);
    payload.append("renewalCost", Number(formData.renewalCost) || 0);
    payload.append("logMemo", formData.logMemo);

    if (selectedFile) {
      payload.append("proposalFileName", selectedFile.name);
      payload.append("proposalFile", selectedFile); // Multer upload.single("proposalFile") 매핑용
    }

    onSave(payload);
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <RefreshCw size={18} style={{ color: "#2563eb" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          서비스 기간 연장 및 결재 증빙 등록
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#2563eb",
            margin: "2px 0 0 0",
            fontWeight: "700",
          }}
        >
          {targetVendor?.vendorName} · {targetItem?.itemName}
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
      <M.StyledForm onSubmit={handleSubmit}>
        <M.ModalBody style={{ padding: "24px" }}>
          <M.Grid>
            <M.InputGroup>
              <M.SectionLabel>기존 만료일 (prevExpireDate)</M.SectionLabel>
              <M.Input
                type="date"
                value={formData.prevExpireDate}
                readOnly
                style={{ background: "#f8fafc", color: "#64748b" }}
              />
            </M.InputGroup>

            <M.InputGroup>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <M.SectionLabel>연장 후 만료일 *</M.SectionLabel>
                <div
                  style={{ display: "flex", gap: "4px", marginBottom: "6px" }}
                >
                  <M.FilterChip
                    type="button"
                    onClick={() => handleQuickAddYear(1)}
                    style={{ padding: "2px 6px", fontSize: "11px" }}
                  >
                    +1년
                  </M.FilterChip>
                  <M.FilterChip
                    type="button"
                    onClick={() => handleQuickAddYear(2)}
                    style={{ padding: "2px 6px", fontSize: "11px" }}
                  >
                    +2년
                  </M.FilterChip>
                </div>
              </div>
              <M.Input
                type="date"
                name="nextExpireDate"
                value={formData.nextExpireDate}
                onChange={(e) =>
                  setFormData({ ...formData, nextExpireDate: e.target.value })
                }
                required
              />
            </M.InputGroup>
          </M.Grid>

          <M.Grid style={{ marginTop: "14px" }}>
            <M.InputGroup>
              <M.SectionLabel>연장 결재일 (renewalDate) *</M.SectionLabel>
              <M.Input
                type="date"
                name="renewalDate"
                value={formData.renewalDate}
                onChange={(e) =>
                  setFormData({ ...formData, renewalDate: e.target.value })
                }
                required
              />
            </M.InputGroup>

            <M.InputGroup>
              <M.SectionLabel>연장 결제 비용 (renewalCost)</M.SectionLabel>
              <M.Input
                type="number"
                placeholder="예: 22000"
                value={formData.renewalCost}
                onChange={(e) =>
                  setFormData({ ...formData, renewalCost: e.target.value })
                }
              />
            </M.InputGroup>
          </M.Grid>

          <M.FormSection style={{ marginTop: "16px" }}>
            <M.SectionLabel>지출 결재 품의서 / 영수증 첨부</M.SectionLabel>
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) =>
                e.target.files?.[0] && setSelectedFile(e.target.files[0])
              }
              style={{ display: "none" }}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            {!selectedFile ? (
              <UploadDropZone onClick={() => fileInputRef.current?.click()}>
                <Upload size={16} className="upload-icon" />
                <span className="drop-title">
                  결재 서류 클릭 또는 드래그 업로드
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
          </M.FormSection>

          <M.FormSection style={{ marginTop: "16px", marginBottom: 0 }}>
            <M.SectionLabel>기안 문서번호 및 비고 (logMemo)</M.SectionLabel>
            <M.TextArea
              rows={3}
              placeholder="예: 가비아 도메인 1년 연장 완료 (기안번호 DHK-202611-004)"
              value={formData.logMemo}
              onChange={(e) =>
                setFormData({ ...formData, logMemo: e.target.value })
              }
            />
          </M.FormSection>
        </M.ModalBody>

        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit">
            <Check size={16} /> 만료일 갱신 및 저장
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}
