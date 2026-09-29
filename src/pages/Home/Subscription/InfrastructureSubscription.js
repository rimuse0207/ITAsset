import React, { useState, useMemo } from "react";
import styled from "styled-components";
import moment from "moment";
import { theme } from "../Style/MainStyle";

import SubscriptionListPanel from "./Body/SubscriptionListPanel";
import SubscriptionItemPanel from "./Body/SubscriptionItemPanel";
import SubscriptionContentPanel from "./Body/SubscriptionContentPanel";
import SubscriptionFormModal from "./Modal/SubscriptionFormModal";
import SubscriptionRenewalModal from "./Modal/SubscriptionRenewalModal";
import MainSidebar from "../../SideBar/MainSideBar";

import useSubscription from "../../../hooks/Subscription/useSubscription";

// 🚀 D-Day 및 만료 상태 계산 유틸 함수 (60일 전 자동 경고)
export const getExpirationStatus = (expireDate, alertDays = 60) => {
  if (!expireDate) return { status: "UNKNOWN", diffDays: 0, label: "미지정" };
  const today = moment().startOf("day");
  const target = moment(expireDate).startOf("day");
  const diffDays = target.diff(today, "days");

  if (diffDays < 0) {
    return {
      status: "EXPIRED",
      diffDays,
      label: `만료됨 (D+${Math.abs(diffDays)})`,
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
    };
  } else if (diffDays <= alertDays) {
    return {
      status: "WARNING",
      diffDays,
      label: diffDays === 0 ? "오늘 만료 (D-Day)" : `연장 필요 (D-${diffDays})`,
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
    };
  } else {
    return {
      status: "NORMAL",
      diffDays,
      label: `정상 (D-${diffDays})`,
      color: "#059669",
      bg: "#f0fdf4",
      border: "#a7f3d0",
    };
  }
};

export default function InfrastructureSubscription() {
  const {
    vendorList,
    selectedVendor,
    selectedItem,
    setSelectedItem,
    activeModal,
    setActiveModal,
    handleVendorSelect,
    handleFormModalSave,
    toggleVendorServiceFetch,
    toggleItemServiceFetch,
    addRenewalFetch,
    deleteRenewalFetch,
  } = useSubscription();

  const renderActiveModal = () => {
    if (!activeModal) return null;

    const closeAndReset = () => setActiveModal(null);

    switch (activeModal) {
      case "VENDOR_REG":
      case "VENDOR_EDIT":
      case "ITEM_REG":
      case "ITEM_EDIT":
        return (
          <SubscriptionFormModal
            isOpen={true}
            mode={activeModal}
            targetVendor={selectedVendor}
            targetItem={selectedItem}
            onClose={closeAndReset}
            onSave={handleFormModalSave}
            onTerminate={(type, target) => {
              if (type === "VENDOR") toggleVendorServiceFetch(target, false);
              else toggleItemServiceFetch(target, false);
            }}
          />
        );

      case "RENEWAL_REG":
        return (
          <SubscriptionRenewalModal
            isOpen={true}
            targetVendor={selectedVendor}
            targetItem={selectedItem}
            onClose={closeAndReset}
            onSave={addRenewalFetch}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <MainSidebar currentMenu={"subscription"} />

      {/* 1. 좌측: 구독/계약 업체 목록 패널 */}
      <SubscriptionListPanel
        vendorList={vendorList}
        selectedVendor={selectedVendor}
        onSelectVendor={handleVendorSelect}
        onOpenRegister={() => setActiveModal("VENDOR_REG")}
        onOpenEdit={() => setActiveModal("VENDOR_EDIT")}
        onTerminateVendor={(vendor) => toggleVendorServiceFetch(vendor, false)}
        onRestoreVendor={(vendor) => toggleVendorServiceFetch(vendor, true)}
      />

      {/* 2. 중앙: 세부 만료 관리 항목 패널 */}
      <SubscriptionItemPanel
        selectedVendor={selectedVendor}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onOpenItemRegister={() => setActiveModal("ITEM_REG")}
        onOpenItemEdit={() => setActiveModal("ITEM_EDIT")}
        onTerminateItem={(item) => toggleItemServiceFetch(item, false)}
        onRestoreItem={(item) => toggleItemServiceFetch(item, true)}
      />

      {/* 3. 우측: 상세 명세 및 기간 연장 결재 이력 패널 */}
      <SubscriptionContentPanel
        selectedVendor={selectedVendor}
        selectedItem={selectedItem}
        onOpenRenewalModal={() => setActiveModal("RENEWAL_REG")}
        onOpenItemEdit={() => setActiveModal("ITEM_EDIT")}
        onDeleteRenewal={deleteRenewalFetch}
      />

      {renderActiveModal()}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: ${() => theme.colors.bg};
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;
