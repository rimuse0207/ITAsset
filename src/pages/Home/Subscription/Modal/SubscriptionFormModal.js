import React, { useState, useEffect } from "react";
import {
  Globe,
  Calendar,
  Check,
  Edit3,
  Layers,
  Bell,
  User,
  Link as LinkIcon,
  FileText,
  Trash2,
} from "lucide-react";
import styled from "styled-components";
import moment from "moment";
import ModalLayout from "../../HardWare/Modals/public/ModalLayout";
import * as M from "../../HardWare/Modals/public/ModalStyle";

export default function SubscriptionFormModal({
  isOpen,
  mode = "VENDOR_REG", // VENDOR_REG | VENDOR_EDIT | ITEM_REG | ITEM_EDIT
  targetVendor,
  targetItem,
  onClose,
  onSave,
  onTerminate,
}) {
  const isVendorMode = mode === "VENDOR_REG" || mode === "VENDOR_EDIT";
  const isEditMode = mode === "VENDOR_EDIT" || mode === "ITEM_EDIT";

  const todayStr = moment().format("YYYY-MM-DD");
  const nextYearStr = moment().add(1, "years").format("YYYY-MM-DD");

  // 1. 업체(Vendor) 폼 상태
  const [vendorForm, setVendorForm] = useState({
    vendorName: "",
    category: "도메인 / DNS",
    siteUrl: "",
    memo: "",
  });

  // 2. 세부 관리 항목(Item) 폼 상태
  const [itemForm, setItemForm] = useState({
    itemName: "",
    cycleType: "1년",
    startDate: todayStr,
    expireDate: nextYearStr,
    alertDays: 60,
    accountInfo: "",
    memo: "",
  });

  // 모달 오픈 시 모드에 따라 초기 데이터 바인딩
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "VENDOR_REG") {
      setVendorForm({
        vendorName: "",
        category: "도메인 / DNS",
        siteUrl: "",
        memo: "",
      });
    } else if (mode === "VENDOR_EDIT" && targetVendor) {
      setVendorForm({
        vendorName: targetVendor.vendorName || "",
        category: targetVendor.category || "도메인 / DNS",
        siteUrl: targetVendor.siteUrl || "",
        memo: targetVendor.memo || "",
      });
    } else if (mode === "ITEM_REG") {
      setItemForm({
        itemName: "",
        cycleType: "1년",
        startDate: todayStr,
        expireDate: nextYearStr,
        alertDays: 60,
        accountInfo: "",
        memo: "",
      });
    } else if (mode === "ITEM_EDIT" && targetItem) {
      setItemForm({
        itemName: targetItem.itemName || "",
        cycleType: targetItem.cycleType || "1년",
        startDate: targetItem.startDate || todayStr,
        expireDate: targetItem.expireDate || nextYearStr,
        alertDays: targetItem.alertDays ?? 60,
        accountInfo: targetItem.accountInfo || "",
        memo: targetItem.memo || "",
      });
    }
  }, [isOpen, mode, targetVendor, targetItem, todayStr, nextYearStr]);

  // 주기에 따른 만료일 자동 계산 헬퍼 함수
  const calculateExpireDate = (baseDate, cycle) => {
    if (!baseDate) return "";
    const m = moment(baseDate);
    switch (cycle) {
      case "1개월":
        return m.add(1, "months").format("YYYY-MM-DD");
      case "6개월":
        return m.add(6, "months").format("YYYY-MM-DD");
      case "1년":
        return m.add(1, "years").format("YYYY-MM-DD");
      case "2년":
        return m.add(2, "years").format("YYYY-MM-DD");
      case "3년":
        return m.add(3, "years").format("YYYY-MM-DD");
      default:
        return m.format("YYYY-MM-DD");
    }
  };

  // 업체 입력 핸들러
  const handleVendorChange = (e) => {
    const { name, value } = e.target;
    setVendorForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 세부 항목 입력 핸들러 (만료 예정일 직접 수정 시 '직접입력'으로 자동 전환)
  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "startDate" && prev.cycleType !== "직접입력") {
        updated.expireDate = calculateExpireDate(value, prev.cycleType);
      }

      if (name === "expireDate") {
        updated.cycleType = "직접입력";
      }

      return updated;
    });
  };

  // 갱신 주기 칩 선택 핸들러
  const handleCycleSelect = (cycle) => {
    setItemForm((prev) => ({
      ...prev,
      cycleType: cycle,
      expireDate:
        cycle === "직접입력"
          ? prev.expireDate
          : calculateExpireDate(prev.startDate, cycle),
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isVendorMode) {
      if (!vendorForm.vendorName.trim()) {
        return alert("업체 또는 서비스명을 입력해주세요.");
      }
      onSave({
        mode,
        vendorId: isEditMode ? targetVendor?.vendorId : undefined,
        ...vendorForm,
      });
    } else {
      if (!itemForm.itemName.trim()) {
        return alert("세부 관리 항목명을 입력해주세요.");
      }
      onSave({
        mode,
        vendorId: targetVendor?.vendorId,
        itemId: isEditMode ? targetItem?.itemId : undefined,
        ...itemForm,
        alertDays: Number(itemForm.alertDays) || 60,
      });
    }
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      {isVendorMode ? (
        <Globe
          size={18}
          style={{ color: isEditMode ? "#f59e0b" : "#2563eb" }}
        />
      ) : (
        <Calendar
          size={18}
          style={{ color: isEditMode ? "#f59e0b" : "#2563eb" }}
        />
      )}
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          {mode === "VENDOR_REG" && "신규 구독/계약 업체 등록"}
          {mode === "VENDOR_EDIT" &&
            `업체 정보 수정 (${targetVendor?.vendorName})`}
          {mode === "ITEM_REG" && "세부 만료 관리 항목 추가"}
          {mode === "ITEM_EDIT" && "세부 만료 관리 항목 수정"}
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#64748b",
            margin: "2px 0 0 0",
            fontWeight: "600",
          }}
        >
          {isVendorMode
            ? "도메인(DNS), SSL 인증서, 클라우드 및 유지보수 계약처 마스터"
            : `대상 업체: ${targetVendor?.vendorName || "-"}`}
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="540px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={handleSubmit}>
        <M.ModalBody style={{ padding: "24px 28px" }}>
          {isVendorMode ? (
            /* ─────────────── [1] 업체(Vendor) 등록/수정 폼 ─────────────── */
            <>
              <M.FormSection>
                <M.SectionLabel>
                  <Layers size={14} /> 계약/서비스 카테고리 분류{" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <M.ChipGroup>
                  {[
                    "도메인 / DNS",
                    "보안 / SSL인증서",
                    "클라우드 / 서버",
                    "S/W 구독",
                    "유지보수 계약",
                  ].map((cat) => (
                    <M.FilterChip
                      key={cat}
                      type="button"
                      selected={vendorForm.category === cat}
                      onClick={() =>
                        setVendorForm((prev) => ({ ...prev, category: cat }))
                      }
                    >
                      {vendorForm.category === cat && <Check size={12} />} {cat}
                    </M.FilterChip>
                  ))}
                </M.ChipGroup>
              </M.FormSection>

              <M.FormSection>
                <M.SectionLabel>
                  <Globe size={14} /> 업체 또는 서비스명{" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <M.InputWrapper>
                  <Globe size={16} className="input-icon" />
                  <M.Input
                    type="text"
                    name="vendorName"
                    placeholder="예: 가비아 (Gabia), AWS, 한국전자인증 등"
                    value={vendorForm.vendorName}
                    onChange={handleVendorChange}
                    required
                  />
                </M.InputWrapper>
              </M.FormSection>

              <M.FormSection>
                <M.SectionLabel>
                  <LinkIcon size={14} /> 관리 콘솔 웹사이트 URL
                </M.SectionLabel>
                <M.InputWrapper>
                  <LinkIcon size={16} className="input-icon" />
                  <M.Input
                    type="url"
                    name="siteUrl"
                    placeholder="예: https://www.gabia.com"
                    value={vendorForm.siteUrl}
                    onChange={handleVendorChange}
                  />
                </M.InputWrapper>
              </M.FormSection>

              <M.FormSection style={{ marginBottom: 0 }}>
                <M.SectionLabel>
                  <FileText size={14} /> 업체 관련 비고 (담당자 연락처 등)
                </M.SectionLabel>
                <M.TextArea
                  rows={3}
                  name="memo"
                  placeholder="예: 법인카드 자동결제 미지원으로 매년 수기 품의 필요 / 기술지원팀 1544-XXXX"
                  value={vendorForm.memo}
                  onChange={handleVendorChange}
                />
              </M.FormSection>
            </>
          ) : (
            /* ─────────────── [2] 세부 항목(Item) 등록/수정 폼 ─────────────── */
            <>
              <M.FormSection>
                <M.SectionLabel>
                  <Layers size={14} /> 관리 대상 항목명 (도메인명/계약명){" "}
                  <span className="required">*</span>
                </M.SectionLabel>
                <M.InputWrapper>
                  <Layers size={16} className="input-icon" />
                  <M.Input
                    type="text"
                    name="itemName"
                    placeholder="예: 사내 대표 도메인 (dhks.co.kr) DNS 연장"
                    value={itemForm.itemName}
                    onChange={handleItemChange}
                    required
                  />
                </M.InputWrapper>
              </M.FormSection>

              <M.FormSection>
                <M.SectionLabel>갱신 주기 선택</M.SectionLabel>
                <M.ChipGroup>
                  {["1년", "2년", "3년", "6개월", "1개월", "직접입력"].map(
                    (cycle) => (
                      <M.FilterChip
                        key={cycle}
                        type="button"
                        selected={itemForm.cycleType === cycle}
                        onClick={() => handleCycleSelect(cycle)}
                      >
                        {itemForm.cycleType === cycle && <Check size={12} />}{" "}
                        {cycle}
                      </M.FilterChip>
                    ),
                  )}
                </M.ChipGroup>
              </M.FormSection>

              <M.Grid>
                <M.InputGroup>
                  <M.SectionLabel>
                    <Calendar size={13} /> 시작일 (최근 갱신일){" "}
                    <span className="required">*</span>
                  </M.SectionLabel>
                  <M.Input
                    type="date"
                    name="startDate"
                    value={itemForm.startDate}
                    onChange={handleItemChange}
                    style={{ paddingLeft: "12px" }}
                    required
                  />
                </M.InputGroup>

                <M.InputGroup>
                  <M.SectionLabel>
                    <Calendar size={13} /> 만료 예정일{" "}
                    {itemForm.cycleType === "직접입력"
                      ? "(직접입력)"
                      : "(자동계산)"}{" "}
                    <span className="required">*</span>
                  </M.SectionLabel>
                  <M.Input
                    type="date"
                    name="expireDate"
                    value={itemForm.expireDate}
                    onChange={handleItemChange}
                    style={{
                      paddingLeft: "12px",
                      borderColor:
                        itemForm.cycleType === "직접입력"
                          ? "#f59e0b"
                          : "#2563eb",
                      backgroundColor:
                        itemForm.cycleType === "직접입력"
                          ? "#fffbeb"
                          : "#eff6ff",
                      fontWeight: 700,
                    }}
                    required
                  />
                </M.InputGroup>
              </M.Grid>

              <M.Grid style={{ marginTop: "12px" }}>
                <M.InputGroup>
                  <M.SectionLabel>
                    <Bell size={13} /> 사전 연장 알림 기준 (일 전){" "}
                    <span className="required">*</span>
                  </M.SectionLabel>
                  <AlertDaysWrapper>
                    <M.Input
                      type="number"
                      name="alertDays"
                      min="1"
                      max="365"
                      value={itemForm.alertDays}
                      onChange={handleItemChange}
                      style={{ paddingLeft: "12px", paddingRight: "55px" }}
                      required
                    />
                    <span className="unit-badge">일 전 알림</span>
                  </AlertDaysWrapper>
                </M.InputGroup>

                <M.InputGroup>
                  <M.SectionLabel>
                    <User size={13} /> 접속 계정 ID / 식별번호
                  </M.SectionLabel>
                  <M.Input
                    type="text"
                    name="accountInfo"
                    placeholder="예: dhks_admin"
                    value={itemForm.accountInfo}
                    onChange={handleItemChange}
                    style={{ paddingLeft: "12px" }}
                  />
                </M.InputGroup>
              </M.Grid>

              <M.FormSection style={{ marginTop: "12px", marginBottom: 0 }}>
                <M.SectionLabel>
                  <FileText size={14} /> 항목 상세 비고
                </M.SectionLabel>
                <M.TextArea
                  rows={3}
                  name="memo"
                  placeholder="예: 만료 60일 전에 총무팀 협조전 발송 후 법인카드로 가비아 홈페이지에서 직접 결제"
                  value={itemForm.memo}
                  onChange={handleItemChange}
                />
              </M.FormSection>
            </>
          )}
        </M.ModalBody>

        {/* 🚀 M.ModalFooter의 width: 100% 인라인 스타일 제거 및 직계 자식 구조로 복원 */}
        <M.ModalFooter>
          {isEditMode && (
            <TerminateButton
              type="button"
              onClick={() => {
                if (isVendorMode && onTerminate) {
                  onTerminate("VENDOR", targetVendor);
                } else if (!isVendorMode && onTerminate) {
                  onTerminate("ITEM", targetItem);
                }
              }}
            >
              <Trash2 size={14} />{" "}
              {isVendorMode ? "업체 서비스 종료" : "항목 서비스 종료"}
            </TerminateButton>
          )}

          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton
            type="submit"
            style={{ background: isEditMode ? "#f59e0b" : "#2563eb" }}
          >
            {isEditMode ? (
              <>
                <Edit3 size={15} /> 수정 내용 저장
              </>
            ) : (
              <>
                <Check size={16} /> 신규 등록 완료
              </>
            )}
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

const AlertDaysWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  .unit-badge {
    position: absolute;
    right: 12px;
    font-size: 11.5px;
    font-weight: 700;
    color: #d97706;
    background: #fffbeb;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #fde68a;
    pointer-events: none;
  }
`;

const TerminateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: #fee2e2;
    border-color: #f87171;
  }
`;
