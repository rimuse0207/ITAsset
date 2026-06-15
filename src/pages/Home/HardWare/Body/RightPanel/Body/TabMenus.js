import React from "react";
import { theme } from "../../../../Style/MainStyle";
import styled from "styled-components";
import { MessageSquare, Wrench } from "lucide-react";

const TabMenus = ({ selectedAsset, activeTab, setActiveTab }) => {
  return (
    <TabMenu>
      <TabButton
        active={activeTab === "history"}
        onClick={() => setActiveTab("history")}
      >
        <MessageSquare size={14} /> 사용자 이력 ({selectedAsset.historys.length}
        )
      </TabButton>
      <TabButton
        active={activeTab === "software-issue"}
        onClick={() => setActiveTab("software-issue")}
      >
        <MessageSquare size={14} /> 소프트웨어 대응 로그 (
        {selectedAsset.softwareIssues.length})
      </TabButton>

      <TabButton
        active={activeTab === "repair"}
        onClick={() => setActiveTab("repair")}
      >
        <Wrench size={14} /> 하드웨어 수리 이력 (
        {selectedAsset.repairHistories.length})
      </TabButton>
    </TabMenu>
  );
};

const TabMenu = styled.div`
  display: flex;
  border-bottom: 2px solid ${() => theme.colors.borderLight};
  margin-bottom: 20px;
  gap: 16px;
`;
const TabButton = styled.button`
  background: none;
  border: none;
  padding: 10px 4px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  position: relative;
  color: ${(props) =>
    props.active ? theme.colors.primary : theme.colors.textMuted};
  &::after {
    content: "";
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: ${(props) =>
      props.active ? theme.colors.primary : "transparent"};
  }
`;

export default TabMenus;
