import { useState, useMemo, useEffect } from "react";
import { Request_Post_Axios } from "../../API";
import useConsumableAPI from "./useConsumableAPI";

export default function useConsumables() {
  const {
    getConsumableCategories,
    addConsumableCategory,
    updateConsumableCategory,
    deleteConsumableCategory,
    getConsumableUserUsedList,
    addConsumableUserUsed,
    updateConsumableUserUsed,
    deleteConsumableUserUsed,
    getStockPurchase,
    addStockPurchase,
    updateStockPurchase,
    deleteStockPurchase,
  } = useConsumableAPI();
  const [list, setList] = useState([
    {
      id: "C001",
      name: "로지텍 MX Master 3S",
      category: "PC 주변기기",
      itemType: "마우스",
      currentStock: 0,
      imageUrl: "",
    },
  ]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [targetHistoryItem, setTargetHistoryItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [userUsedList, setUserUsedList] = useState([]);
  const [purchaseList, setPurchaseList] = useState([]);

  useEffect(() => {
    getConsumableLists();
  }, []);

  const getConsumableLists = async () => {
    const req = await getConsumableCategories();
    if (req) {
      setList(req);
    }
  };

  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    getUserUsedLists();
    getPurchaseLists();
  }, [selectedItem]);

  const getUserUsedLists = async () => {
    const req = await getConsumableUserUsedList(selectedItem.id);
    if (req) {
      setUserUsedList(req || []);
    }
  };

  const getPurchaseLists = async () => {
    const req = await getStockPurchase(selectedItem.id);
    if (req) {
      setPurchaseList(req || []);
    }
  };

  useEffect(() => {
    if (selectedItem) {
      const updatedItem = list.find((item) => item.id === selectedItem.id);
      if (updatedItem) setSelectedItem(updatedItem);
    }
  }, [list]);

  const changeCurrentStockCount = (selectedId, nowCount) => {
    setList(
      list.map((item) => {
        return item.id === selectedId
          ? { ...item, currentStock: Number(nowCount) }
          : item;
      }),
    );
  };

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
    const req = await addConsumableCategory(formData);

    if (req) {
      const InsertData = Object.fromEntries(formData.entries());
      const newList = {
        id: req.consumableId,
        name: InsertData.name,
        category: InsertData.category,
        itemType: InsertData.itemType,
        currentStock: 12,
        imageUrl: req.consumableImageURL,
      };
      setList(list.concat(newList));
    }
    closeModal();
  };
  const updateConsumable = async (formData) => {
    const req = await updateConsumableCategory(formData);
    if (req) {
      const UpdateData = Object.fromEntries(formData.entries());
      setList(
        list.map((item) =>
          item.id === UpdateData.id
            ? {
                ...item,
                name: UpdateData.name,
                category: UpdateData.category,
                itemType: UpdateData.itemType,
                imageUrl: req.isFileChanged
                  ? req.filename
                  : req.isDeleted
                    ? null
                    : item.imageUrl,
              }
            : item,
        ),
      );
      closeModal();
    }
  };

  // 소모품 삭제
  const deleteConsumable = async (item) => {
    if (
      window.confirm(`[${item.name}] 소모품 자산을 완전히 삭제하시겠습니까?`)
    ) {
      await deleteConsumableCategory(item.id);
      setList((prev) => prev.filter((i) => i.id !== item.id));
      if (selectedItem?.id === item.id) setSelectedItem(null);
    }
  };

  // ─── [사용자 지급 내역 CRUD] ───
  const issueToUser = async (payload) => {
    const req = await addConsumableUserUsed(payload, selectedItem);

    if (req) {
      await getUserUsedLists();
      // 이후 잔여 재고 변경
      changeCurrentStockCount(selectedItem.id, Number(req.nowCurrentCount));
    }
    closeModal();
  };

  const updateIssue = async (payload) => {
    console.log("지급 내역 수정 완료:", payload);
    const req = await updateConsumableUserUsed(payload);
    if (req) {
      await getUserUsedLists();
    }

    closeModal();
  };

  const deleteIssue = async (payload) => {
    if (
      window.confirm("해당 지급 내역을 삭제하시겠습니까? (재고가 롤백됩니다)")
    ) {
      const req = await deleteConsumableUserUsed(
        payload.id,
        payload.consumableId,
      );

      await getUserUsedLists();

      if (req) {
        changeCurrentStockCount(
          payload.consumableId,
          Number(req.nowCurrentCount),
        );
      }
    }
  };

  // ─── [입고 및 결재 내역 CRUD] ───
  const registerPurchase = async (multipartFormData) => {
    const req = await addStockPurchase(multipartFormData);
    if (req) {
      await getPurchaseLists();
      const UpdateData = Object.fromEntries(multipartFormData.entries());
      changeCurrentStockCount(
        UpdateData.consumableId,
        Number(req.nowCurrentCount),
      );
    }
    closeModal();
  };

  const updatePurchase = async (multipartFormData) => {
    console.log("입고 내역 수정 완료");
    const req = await updateStockPurchase(multipartFormData);
    if (req) {
      await getPurchaseLists();
      const UpdateData = Object.fromEntries(multipartFormData.entries());
      changeCurrentStockCount(
        UpdateData.consumableId,
        Number(req.nowCurrentCount),
      );
    }

    closeModal();
  };

  const deletePurchase = async (payload) => {
    if (
      window.confirm("해당 입고 내역을 삭제하시겠습니까? (재고가 롤백됩니다)")
    ) {
      const req = await deleteStockPurchase(payload.purchaseId);
      if (req) {
        await getPurchaseLists();
        changeCurrentStockCount(
          payload.consumableId,
          Number(req.nowCurrentCount),
        );
      }
    }
  };

  return {
    list: filteredList,
    selectedItem,
    activeModal,
    targetHistoryItem,
    searchQuery,
    userUsedList,
    purchaseList,
    setSearchQuery,
    handleSelect,
    openModal,
    closeModal,
    addConsumable,
    updateConsumable,
    deleteConsumable,
    issueToUser,
    updateIssue,
    deleteIssue,
    registerPurchase,
    updatePurchase,
    deletePurchase,
  };
}
