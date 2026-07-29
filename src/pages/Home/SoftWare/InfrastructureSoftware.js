import React from "react";
import styled from "styled-components";
import { theme } from "../Style/MainStyle";
import MainSidebar from "../../SideBar/MainSideBar";

import LicenseListPannel from "./Body/LicenseListPannel/LicenseListPannel";
import LicenseVersionPannel from "./Body/LicenseVersionPannel/LicenseVersionPannel";
import LicenseContentPannel from "./Body/LicenseContentPannel/LicenseContentPannel";

import SoftwareFormModal from "./Modals/SoftwareFormModal";
import SoftwareVersionModal from "./Modals/SoftwareVersionModal";
import SoftwareFileModal from "./Modals/SoftwareFileModal";
import SoftwareUserModal from "./Modals/SoftewareUserModal";
import SoftwareKeyModal from "./Modals/SoftwareKeyModal";
import SoftwarePurchaseModal from "./Modals/SoftwarePurchaseModal";

import useInfrastructureSoftware from "../../../hooks/InfraSoftware/useInfrastructureSoftware";
import SoftwareKeyDecryptModal from "./Modals/SoftwareKeyDecryptModal";

export default function InfrastructureSoftware() {
  const {
    activeModal,
    setActiveModal,
    modalTargetData,
    softwareList,
    selectedSW,
    selectedVersion,
    setSelectedVersion,
    isKeyUnlocked,
    setIsKeyUnlocked,
    showRawKey,
    setShowRawKey,
    handleSWSelect,
    handleVerifySecurity,
    handleContentAction,
    addSoftwareFetch,
    updateSoftwareFetch,
    addSoftwareVersionFetch,
    selectBaseSoftwareData,
    setModalTargetData,
    addSoftwareFileFetch,
    updateSoftwareFileFetch,
    addSoftwarePurchaseFetch,
    addSoftwareUserUsedFetch,
    handleDecryptSuccess,
    addLicenseKeyFetch,
    updateLicenseKeyFetch,
  } = useInfrastructureSoftware();

  const renderActiveModal = () => {
    if (!activeModal) return null;

    const closeAndReset = () => {
      setActiveModal(null);
      setModalTargetData(null);
    };

    const handleMasterSave = async (data) => {
      if (activeModal === "SW_REG") {
        await addSoftwareFetch(data);
      } else {
        await updateSoftwareFetch(data);
      }
      await selectBaseSoftwareData();
    };

    switch (activeModal) {
      case "SW_REG":
      case "SW_EDIT":
        return (
          <SoftwareFormModal
            isOpen={true}
            onClose={closeAndReset}
            mode={activeModal}
            targetSW={selectedSW}
            onSave={handleMasterSave}
          />
        );

      case "VER_REG":
      case "VER_EDIT":
        return (
          <SoftwareVersionModal
            isOpen={true}
            onClose={closeAndReset}
            versionMode={activeModal}
            targetSW={selectedSW}
            targetVersion={selectedVersion}
            onSave={async (data) => {
              if (activeModal === "VER_REG") {
                await addSoftwareVersionFetch(selectedSW, data);
              }
              await selectBaseSoftwareData();
            }}
          />
        );

      case "CRED_REG":
      case "CRED_EDIT":
        return (
          <SoftwareFileModal
            isOpen={true}
            onClose={closeAndReset}
            credMode={activeModal === "CRED_REG" ? "create" : "edit"}
            targetSW={selectedSW}
            targetVersion={selectedVersion}
            targetFile={modalTargetData}
            onSave={async (payload) => {
              if (activeModal === "CRED_REG") {
                // 신규 추가시
                await addSoftwareFileFetch(payload);
                await selectBaseSoftwareData();
              } else {
                // 기존 변경 시,
                await updateSoftwareFileFetch(payload);
                await selectBaseSoftwareData();
              }
            }}
          />
        );

      case "KEY_REG":
      case "KEY_EDIT":
        return (
          <SoftwareKeyModal
            isOpen={true}
            onClose={closeAndReset}
            credMode={activeModal === "KEY_REG" ? "create" : "edit"}
            targetSW={selectedSW}
            targetVersion={selectedVersion}
            targetKey={modalTargetData}
            onSave={async (payload) => {
              if (activeModal === "KEY_REG") {
                await addLicenseKeyFetch(
                  payload,
                  selectedSW,
                  selectedVersion,
                  modalTargetData,
                );
              } else {
                await updateLicenseKeyFetch(
                  payload,
                  selectedSW,
                  selectedVersion,
                  modalTargetData,
                );
              }

              await selectBaseSoftwareData();
            }}
          />
        );

      case "USER_REG":
      case "USER_EDIT":
        return (
          <SoftwareUserModal
            isOpen={true}
            onClose={closeAndReset}
            credMode={activeModal === "USER_REG" ? "create" : "edit"}
            targetSW={selectedSW}
            targetVersion={selectedVersion}
            targetUser={modalTargetData}
            onSave={async (payload) => {
              await addSoftwareUserUsedFetch(
                payload,
                selectedSW,
                selectedVersion,
              );
              await selectBaseSoftwareData();
            }}
          />
        );

      case "PURCHASE_REG":
      case "PURCHASE_EDIT":
        return (
          <SoftwarePurchaseModal
            isOpen={true}
            onClose={closeAndReset}
            selectedSW={selectedSW}
            selectedVersion={selectedVersion}
            onSave={async (multipartFormData) => {
              await addSoftwarePurchaseFetch(multipartFormData);
              await selectBaseSoftwareData();
            }}
          />
        );

      case "VIEW_VERIFY":
        return (
          <SoftwareKeyDecryptModal
            isOpen={true}
            onClose={closeAndReset}
            selectedSW={selectedSW}
            selectedVersion={selectedVersion}
            targetKey={modalTargetData}
            onDecryptSuccess={async (auditPayload) => {
              await handleDecryptSuccess(
                auditPayload,
                selectedSW,
                selectedVersion,
                modalTargetData,
              );
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Container>
      <MainSidebar currentMenu={"software"} />

      <LicenseListPannel
        softwareList={softwareList}
        handleSWSelect={handleSWSelect}
        selectedSW={selectedSW}
        onOpenRegister={() => setActiveModal("SW_REG")}
        onOpenEdit={() => setActiveModal("SW_EDIT")}
      />

      <LicenseVersionPannel
        selectedSW={selectedSW}
        selectedVersion={selectedVersion}
        setSelectedVersion={setSelectedVersion}
        setIsKeyUnlocked={setIsKeyUnlocked}
        setShowRawKey={setShowRawKey}
        onOpenVersionRegister={() => setActiveModal("VER_REG")}
        onOpenVersionEdit={() => setActiveModal("VER_EDIT")}
      />

      <LicenseContentPannel
        selectedSW={selectedSW}
        selectedVersion={selectedVersion}
        isKeyUnlocked={isKeyUnlocked}
        handleVerifySecurity={handleVerifySecurity}
        showRawKey={showRawKey}
        setShowRawKey={setShowRawKey}
        onAction={handleContentAction}
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
