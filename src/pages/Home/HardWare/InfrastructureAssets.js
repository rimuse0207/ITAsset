import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../Style/MainStyle";
import AssetHeader from "./Header/AssetHeader";
import FilterBar from "./FilterBar/FilterBar";
import AssetTable from "./Body/Table/AssetTable";
import MouseContext from "./Body/MouseClick/MouseContext";
import RightPanel from "./Body/RightPanel/RightPanel";

import useAssetManagement from "../../../hooks/InfrastructureAsset/useAssetManagement";
import useAssetAPI from "../../../hooks/InfrastructureAsset/useAssetAPI";
import MainSidebar from "../../SideBar/MainSideBar";
import AssetFormModal from "./Modals/AssetFormModal";
import AssetFilterModal from "./Modals/AssetFilterModal";
import RepairHistoryModal from "./Modals/RepairHistoryModal";
import UserAssignmentModal from "./Modals/UserAssignmentModal";
import AssetStatusModal from "./Modals/AssetStatusModal";

export default function InfrastructureAssets() {
  // const initialData = [
  //   {
  //     id: "AST-2026-001",
  //     deviceType: "PC", // 🚀 RDB 매핑을 위한 기종 분류 플래그 주입
  //     name: 'MacBook Pro 16"',
  //     category: "데스크탑/노트북",
  //     serial: "C02F1234MD6M",
  //     status: "사용중",
  //     user: "홍길동 (개발본부)",
  //     date: "2025-03-12",
  //     specCpu: "M3 Max",
  //     specRam: "32GB",
  //     specStorage: "1TB SSD",
  //     memo: "개발본부 메인 장비",
  //     softwares: [],
  //     repairHistories: [],
  //     softwareIssues: [],
  //   },
  // ];

  const {
    assets,
    selectedAsset,
    setSelectedAsset,
    selectAsset,
    activeTab,
    setActiveTab,
    contextMenu,
    menuRef,
    handleContextMenu,
    handleMenuAction,
    activeModal,
    openModal,
    closeModal,
    GettingAssetData,
  } = useAssetManagement();
  const {
    assetAddFetch,
    assetUpdateFetch,
    assetChangeUserFetch,
    saveAssetRepairHistoryFetch,
    assetStatusUpdateFetch,
  } = useAssetAPI();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | 사용중 | 재고 | 고장 | 수리중 | 폐기
  const [sortBy, setSortBy] = useState("LATEST"); // LATEST | CODE
  const [advancedFilters, setAdvancedFilters] = useState(null); // 모달 상세 필터 전용 버퍼

  const processedAssets = assets
    .filter((asset) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        asset.id.toLowerCase().includes(query) ||
        asset.name.toLowerCase().includes(query) ||
        (asset.user && asset.user.toLowerCase().includes(query)) ||
        (asset.fullName && asset.fullName.toLowerCase().includes(query)) ||
        (asset.memo && asset.memo.toLowerCase().includes(query)) ||
        (asset.departmentName &&
          asset.departmentName.toLowerCase().includes(query)) ||
        (asset.serial && asset.serial.toLowerCase().includes(query));

      // 2. 인라인 상태 칩 제어
      const matchesStatus =
        statusFilter === "ALL" ? true : asset.status === statusFilter;

      // 3. [Advanced] 상세 모달 필터 조건식 검증 (데이터가 존재할 때만 체이닝 연산)
      if (advancedFilters) {
        const {
          categories,
          statuses,
          startDate,
          endDate,
          specCpu,
          minRam,
          monitorSize,
          telecom,
        } = advancedFilters;

        if (categories?.length > 0 && !categories.includes(asset.deviceType))
          return false;
        if (statuses?.length > 0 && !statuses.includes(asset.status))
          return false;
        if (startDate && new Date(asset.date) < new Date(startDate))
          return false;
        if (endDate && new Date(asset.date) > new Date(endDate)) return false;
        if (
          specCpu &&
          !asset.specCpu?.toLowerCase().includes(specCpu.toLowerCase())
        )
          return false;
        if (
          minRam &&
          !asset.specRam?.toLowerCase().includes(minRam.toLowerCase())
        )
          return false;
        if (
          monitorSize &&
          !asset.monitorSize?.toLowerCase().includes(monitorSize.toLowerCase())
        )
          return false;
        if (telecom && telecom !== "ALL" && asset.telecom !== telecom)
          return false;
      }

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 4. 정렬 로직 처리
      if (sortBy === "LATEST") return new Date(b.date) - new Date(a.date);
      if (sortBy === "CODE") return a.id.localeCompare(b.id);
      return 0;
    });

  return (
    <Container>
      <MainSidebar currentMenu={"asset"} />
      <MainContent isPanelOpen={!!selectedAsset}>
        <AssetHeader openModal={(data) => openModal(data)} />

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          openModal={() => openModal("FILTER")}
          hasAdvanced={!!advancedFilters}
          onResetAdvanced={() => setAdvancedFilters(null)}
        />

        <AssetTable
          assets={processedAssets}
          rawMasterAssets={assets}
          selectedAsset={selectedAsset}
          setSelectedAsset={selectAsset}
          handleContextMenu={handleContextMenu}
          setActiveTab={setActiveTab}
        />
      </MainContent>

      {contextMenu.visible && (
        <MouseContext
          menuRef={menuRef}
          contextMenu={contextMenu}
          handleMenuAction={handleMenuAction}
        />
      )}

      {selectedAsset && (
        <RightPanel
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      )}

      {(activeModal === "REGISTER" || activeModal === "EDIT") && (
        <AssetFormModal
          isOpen={true}
          onClose={closeModal}
          mode={activeModal === "REGISTER" ? "create" : "edit"}
          targetAsset={selectedAsset}
          onSave={async (data, deviceType) => {
            activeModal === "REGISTER"
              ? await assetAddFetch(data, deviceType)
              : await assetUpdateFetch(data, deviceType);
            await GettingAssetData();
          }}
        />
      )}

      <AssetFilterModal
        isOpen={activeModal === "FILTER"}
        onClose={closeModal}
        onApply={(filters) => {
          setAdvancedFilters(filters);
          closeModal();
        }}
        currentFilters={advancedFilters}
      />

      <RepairHistoryModal
        isOpen={activeModal === "REPAIR"}
        onClose={closeModal}
        targetAsset={selectedAsset}
        onSave={async (log) => {
          await saveAssetRepairHistoryFetch(log);
        }}
      />

      <UserAssignmentModal
        isOpen={activeModal === "REALLOCATION"}
        onClose={closeModal}
        targetAsset={selectedAsset}
        onSave={async (data) => {
          await assetChangeUserFetch(data, selectedAsset.deviceType);
          await GettingAssetData();
        }}
      />

      <AssetStatusModal
        isOpen={activeModal === "STATUS"}
        onClose={closeModal}
        targetAsset={selectedAsset}
        onSave={async (statusFormData) => {
          await assetStatusUpdateFetch(statusFormData, selectedAsset);
          await GettingAssetData(); // 데이터 새로고침
          closeModal();
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: ${() => theme.colors.bg};
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: relative;
`;
const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: ${(props) => (props.isPanelOpen ? "calc(100% - 540px)" : "100%")};
`;
