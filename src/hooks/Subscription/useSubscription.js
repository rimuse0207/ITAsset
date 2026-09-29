import { useState, useEffect, useCallback } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export default function useSubscription() {
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // VENDOR_REG | VENDOR_EDIT | ITEM_REG | ITEM_EDIT | RENEWAL_REG

  // 🚀 1. 전체 구독/만료 데이터 조회 (계층형 트리 구조 수신 및 포커스 유지)
  const selectBaseSubscriptionData = useCallback(async () => {
    try {
      const response = await Request_Get_Axios(
        "/Subscription/getSubscriptionList",
      );
      if (response.status && Array.isArray(response.data)) {
        const list = response.data;
        setVendorList(list);

        // 기존에 선택되어 있던 업체와 항목의 포커스를 유지하면서 데이터만 최신화
        setSelectedVendor((prevVendor) => {
          const matchedVendor =
            list.find((v) => v.vendorId === prevVendor?.vendorId) ||
            list.find((v) => v.lastService !== false) ||
            list[0] ||
            null;

          setSelectedItem((prevItem) => {
            if (!matchedVendor || !matchedVendor.items) return null;
            return (
              matchedVendor.items.find((i) => i.itemId === prevItem?.itemId) ||
              matchedVendor.items.find((i) => i.lastService !== false) ||
              matchedVendor.items[0] ||
              null
            );
          });

          return matchedVendor;
        });
      }
    } catch (error) {
      console.error("구독 데이터 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    selectBaseSubscriptionData();
  }, [selectBaseSubscriptionData]);

  // 좌측 업체 카드 선택 시 핸들러
  const handleVendorSelect = (vendor) => {
    setSelectedVendor(vendor);
    const firstActiveItem =
      vendor.items?.find((i) => i.lastService !== false) ||
      vendor.items?.[0] ||
      null;
    setSelectedItem(firstActiveItem);
  };

  // 🚀 2. 업체(Vendor) 등록 및 수정
  const saveVendorFetch = async (payload) => {
    const endpoint =
      payload.mode === "VENDOR_REG"
        ? "/Subscription/addVendor"
        : "/Subscription/updateVendor";
    const res = await Request_Post_Axios(endpoint, payload);
    if (res.status) {
      await selectBaseSubscriptionData();
      setActiveModal(null);
    }
    return res;
  };

  // 🚀 3. 세부 관리 항목(Item) 등록 및 수정
  const saveItemFetch = async (payload) => {
    const endpoint =
      payload.mode === "ITEM_REG"
        ? "/Subscription/addItem"
        : "/Subscription/updateItem";
    const res = await Request_Post_Axios(endpoint, payload);
    if (res.status) {
      await selectBaseSubscriptionData();
      setActiveModal(null);
    }
    return res;
  };

  // 🚀 4. 모달 통합 저장 분기 핸들러 (SubscriptionFormModal의 onSave에 연결)
  const handleFormModalSave = async (payload) => {
    if (payload.mode === "VENDOR_REG" || payload.mode === "VENDOR_EDIT") {
      await saveVendorFetch(payload);
    } else {
      await saveItemFetch(payload);
    }
  };

  // 🚀 5. 업체 서비스 종료 및 재개(복구) 토글 (lastService 제어)
  const toggleVendorServiceFetch = async (vendor, nextStatus) => {
    if (!vendor) return;
    const actionLabel = nextStatus ? "서비스 재개(복구)" : "서비스 종료";
    if (
      !window.confirm(
        `[${vendor.vendorName}] 업체를 '${actionLabel}' 처리하시겠습니까?`,
      )
    )
      return;

    const res = await Request_Post_Axios("/Subscription/toggleVendorService", {
      vendorId: vendor.vendorId,
      lastService: nextStatus,
    });

    if (res.status) {
      await selectBaseSubscriptionData();
      setActiveModal(null);
    }
  };

  // 🚀 6. 세부 항목 서비스 종료 및 재개(복구) 토글 (lastService 제어)
  const toggleItemServiceFetch = async (item, nextStatus) => {
    if (!item) return;
    const actionLabel = nextStatus ? "운영 항목으로 복구" : "서비스 종료";
    if (
      !window.confirm(
        `[${item.itemName}] 항목을 '${actionLabel}' 처리하시겠습니까?`,
      )
    )
      return;

    const res = await Request_Post_Axios("/Subscription/toggleItemService", {
      itemId: item.itemId,
      lastService: nextStatus,
    });

    if (res.status) {
      await selectBaseSubscriptionData();
      setActiveModal(null);
    }
  };

  // 🚀 7. 기간 연장 결재 이력 등록 (Multipart FormData 전송 + 만료일 자동 갱신)
  const addRenewalFetch = async (multipartFormData) => {
    const res = await Request_Post_Axios(
      "/Subscription/addRenewal",
      multipartFormData,
    );
    if (res.status) {
      await selectBaseSubscriptionData();
      setActiveModal(null);
    }
    return res;
  };

  // 🚀 8. 기간 연장 결재 이력 삭제 (lastService = false 처리)
  const deleteRenewalFetch = async (renewalObj) => {
    if (!renewalObj) return;
    if (
      !window.confirm(
        `[${renewalObj.renewalDate}] 등록된 연장 결재 이력을 삭제하시겠습니까?`,
      )
    )
      return;

    const res = await Request_Post_Axios("/Subscription/deleteRenewal", {
      renewalId: renewalObj.renewalId,
      itemId: renewalObj.itemId,
    });

    if (res.status) {
      await selectBaseSubscriptionData();
    }
  };

  return {
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
    selectBaseSubscriptionData,
  };
}
