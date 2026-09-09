import React from "react";
import styled from "styled-components";
import { theme } from "../Style/MainStyle";
import MainSidebar from "../../SideBar/MainSideBar";

import ConsumableListPanel from "./Body/ConsumableListPanel";
import ConsumableContentPanel from "./Body/ConsumableContentPanel";

import ConsumableFormModal from "./Modals/ConsumableFormModal";
import ConsumableUserModal from "./Modals/ConsumableUserModal";
import ConsumablePurchaseModal from "./Modals/ConsumablePurchaseModal";
import useConsumables from "../../../hooks/Consumables/useConsumables";

export default function ConsumablesManagement() {
  const {
    list,
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
    deleteConsumable,
    issueToUser,
    updateIssue,
    deleteIssue,
    registerPurchase,
    updatePurchase,
    deletePurchase,
  } = useConsumables();

  const handleAction = (type, payload) => {
    switch (type) {
      // 등록 모달 열기
      case "ADD_CONSUMABLE":
      case "ISSUE_TO_USER":
      case "REGISTER_PURCHASE":
        openModal(type);
        break;

      case "EDIT_CONSUMABLE":
      case "EDIT_ISSUE":
      case "EDIT_PURCHASE":
        openModal(type, payload);
        break;

      // 다이렉트 삭제 로직 실행
      case "DELETE_ISSUE":
        deleteIssue(payload);
        break;
      case "DELETE_PURCHASE":
        deletePurchase(payload);
        break;
      default:
        console.warn("알 수 없는 액션", type);
    }
  };

  const renderActiveModal = () => {
    if (!activeModal) return null;

    switch (activeModal) {
      case "ADD_CONSUMABLE":
        return (
          <ConsumableFormModal
            isOpen={true}
            onClose={closeModal}
            mode="create"
            onSave={addConsumable}
          />
        );
      case "EDIT_CONSUMABLE":
        return (
          <ConsumableFormModal
            isOpen={true}
            onClose={closeModal}
            mode="edit"
            targetItem={selectedItem}
            onSave={updateConsumable}
          />
        );

      case "ISSUE_TO_USER":
        return (
          <ConsumableUserModal
            isOpen={true}
            onClose={closeModal}
            mode="create"
            targetItem={selectedItem}
            onSave={issueToUser}
          />
        );
      case "EDIT_ISSUE":
        return (
          <ConsumableUserModal
            isOpen={true}
            onClose={closeModal}
            mode="edit"
            targetItem={selectedItem}
            targetHistory={targetHistoryItem}
            onSave={updateIssue}
          />
        );

      case "REGISTER_PURCHASE":
        return (
          <ConsumablePurchaseModal
            isOpen={true}
            onClose={closeModal}
            mode="create"
            targetItem={selectedItem}
            onSave={registerPurchase}
          />
        );
      case "EDIT_PURCHASE":
        return (
          <ConsumablePurchaseModal
            isOpen={true}
            onClose={closeModal}
            mode="edit"
            targetItem={selectedItem}
            targetHistory={targetHistoryItem}
            onSave={updatePurchase}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <MainSidebar currentMenu={"consumable"} />

      <ConsumableListPanel
        list={list}
        selectedItem={selectedItem}
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onSelect={handleSelect}
        onOpenRegister={() => handleAction("ADD_CONSUMABLE")}
        onOpenEdit={() => handleAction("EDIT_CONSUMABLE")}
        onDelete={deleteConsumable}
      />

      <ConsumableContentPanel
        selectedItem={selectedItem}
        onAction={handleAction}
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
