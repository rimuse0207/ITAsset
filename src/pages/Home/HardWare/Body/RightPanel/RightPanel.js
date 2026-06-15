import React from "react";
import styled, { keyframes } from "styled-components";
import { theme } from "../../../Style/MainStyle";

import Header from "./Header/Header";
import UserInfo from "./Body/UserInfo";
import TabMenus from "./Body/TabMenus";
import HWRepair from "./Body/Content/HW/HWRepair";
import SWRepair from "./Body/Content/SW/SWRepair";
import AssetHistory from "./Body/Content/History/AssetHistory";

const RightPanel = ({
  selectedAsset,
  setSelectedAsset,
  activeTab,
  setActiveTab,
}) => {
  return (
    <DetailPanel>
      <Header
        selectedAsset={selectedAsset}
        setSelectedAsset={(data) => setSelectedAsset(data)}
      ></Header>

      <PanelBody>
        <UserInfo selectedAsset={selectedAsset}></UserInfo>
        <TabMenus
          selectedAsset={selectedAsset}
          activeTab={activeTab}
          setActiveTab={(data) => setActiveTab(data)}
        ></TabMenus>
        {activeTab === "history" && (
          <AssetHistory selectedAsset={selectedAsset}></AssetHistory>
        )}
        {activeTab === "software-issue" && (
          <SWRepair selectedAsset={selectedAsset}></SWRepair>
        )}

        {activeTab === "repair" && (
          <HWRepair selectedAsset={selectedAsset}></HWRepair>
        )}
      </PanelBody>
    </DetailPanel>
  );
};

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const menuScale = keyframes`
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
`;

const DetailPanel = styled.div`
  width: 540px;
  background: ${() => theme.colors.white};
  border-left: 1px solid ${() => theme.colors.border};
  box-shadow: ${() => theme.shadows.panel};
  display: flex;
  flex-direction: column;
  animation: ${slideIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  height: 100vh;
  overflow: auto;
`;

const PanelBody = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex: 1;
`;

export default RightPanel;
