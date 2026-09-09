import { useState, useMemo, useEffect } from "react";

export default function useConsumables() {
  const [list, setList] = useState([
    {
      id: "C001",
      name: "로지텍 MX Master 3S",
      category: "PC 주변기기",
      itemType: "마우스",
      currentStock: 12,
      imageUrl: "",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  // 🚀 상세 내역(지급, 입고) 수정 시 대상 데이터를 담아둘 상태
  const [targetHistoryItem, setTargetHistoryItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (selectedItem) {
      const updatedItem = list.find((item) => item.id === selectedItem.id);
      if (updatedItem) setSelectedItem(updatedItem);
    }
  }, [list]);

  const filteredList = useMemo(() => {
    if (!searchQuery) return list;
    const lowerQuery = searchQuery.toLowerCase();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery) ||
        (item.itemType && item.itemType.toLowerCase().includes(lowerQuery)),
    );
  }, [list, searchQuery]);

  // ─── [모달 제어] ───
  const openModal = (type, payload = null) => {
    setTargetHistoryItem(payload); // payload가 있으면 수정할 데이터 타겟팅
    setActiveModal(type);
  };
  const closeModal = () => {
    setActiveModal(null);
    setTargetHistoryItem(null);
  };
  const handleSelect = (item) => setSelectedItem(item);

  // ─── [소모품 마스터 CRUD] ───
  const addConsumable = async (formData) => {
    console.log("전송될 데이터:", Object.fromEntries(formData.entries()));
    /* 이전 코드와 동일 */ closeModal();
  };
  const updateConsumable = async (formData) => {
    /* 이전 코드와 동일 */ closeModal();
  };

  // 🚀 소모품 삭제
  const deleteConsumable = async (item) => {
    if (
      window.confirm(`[${item.name}] 소모품 자산을 완전히 삭제하시겠습니까?`)
    ) {
      // await fetch(`/api/consumables/${item.id}`, { method: 'DELETE' });
      setList((prev) => prev.filter((i) => i.id !== item.id));
      if (selectedItem?.id === item.id) setSelectedItem(null);
    }
  };

  // ─── [사용자 지급 내역 CRUD] ───
  const issueToUser = async (payload) => {
    /* 지급 등록 */ closeModal();
  };

  const updateIssue = async (payload) => {
    console.log("지급 내역 수정 완료:", payload);
    // await fetch(`/api/consumables/issue/${targetHistoryItem.id}`, { method: 'PUT' });
    closeModal();
  };

  const deleteIssue = async (payload) => {
    if (
      window.confirm("해당 지급 내역을 삭제하시겠습니까? (재고가 롤백됩니다)")
    ) {
      console.log("지급 내역 삭제:", payload.id);
      // await fetch(`/api/consumables/issue/${payload.id}`, { method: 'DELETE' });
    }
  };

  // ─── [입고 및 결재 내역 CRUD] ───
  const registerPurchase = async (multipartFormData) => {
    /* 입고 등록 */ closeModal();
  };

  const updatePurchase = async (multipartFormData) => {
    console.log("입고 내역 수정 완료");
    // await fetch(`/api/consumables/purchase/${targetHistoryItem.id}`, { method: 'PUT' });
    closeModal();
  };

  const deletePurchase = async (payload) => {
    if (
      window.confirm("해당 입고 내역을 삭제하시겠습니까? (재고가 롤백됩니다)")
    ) {
      console.log("입고 내역 삭제:", payload.id);
      // await fetch(`/api/consumables/purchase/${payload.id}`, { method: 'DELETE' });
    }
  };

  return {
    list: filteredList,
    selectedItem,
    activeModal,
    targetHistoryItem,
    searchQuery,
    setSearchQuery,
    handleSelect,
    openModal,
    closeModal,
    addConsumable,
    updateConsumable,
    deleteConsumable, // 추가
    issueToUser,
    updateIssue, // 추가
    deleteIssue, // 추가
    registerPurchase,
    updatePurchase, // 추가
    deletePurchase, // 추가
  };
}
