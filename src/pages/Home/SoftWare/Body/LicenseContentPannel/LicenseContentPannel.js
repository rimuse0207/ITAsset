import React from "react";
import { theme } from "../../../Style/MainStyle";
import SoftwareHeader from "../../Header/SoftwareHeader";
import styled from "styled-components";

import LicenseInstallFiles from "./Contents/LicenseFiles";
import LicenseUsedUser from "./Contents/LicenseUsedUser";
import LicensePuchaseHistory from "./Contents/LicensePurchaseHistory";
import LicenseKey from "./Contents/LicenseKey";

/**
 * @param {function} onAction - (type: string, subType: 'FILE'|'KEY'|'USER'|'PURCHASE', actionData?: any) => void
 */
const LicenseContentPannel = ({
  selectedSW,
  selectedVersion,
  isKeyUnlocked,
  handleVerifySecurity,
  showRawKey,
  setShowRawKey,
  onAction,
}) => {
  if (!selectedSW || !selectedVersion) return <EmptyZone></EmptyZone>;

  const isLicenseRequired = selectedSW.isLicenseRequired !== false;

  return (
    <RightPanel>
      <SoftwareHeader
        title={`${selectedSW.swName} [${selectedVersion.versionStr}]`}
        subTitle={"소프트웨어 설치 파일 및 등록된 사용자 조회"}
        onModalOpen={() =>
          onAction && onAction("EDIT_VERSION_MSTR", "VERSION", selectedVersion)
        }
        isButton={false}
      />

      <DetailScrollZone>
        {/* 구역 1: 인프라 배포 바이너리 */}
        <LicenseInstallFiles
          selectedVersion={selectedVersion}
          onAction={onAction}
        ></LicenseInstallFiles>
        {/* 구역 4: 정품 라이선스 자산 시리얼 */}
        <LicenseKey
          onAction={onAction}
          isKeyUnlocked={isKeyUnlocked}
          handleVerifySecurity={handleVerifySecurity}
          showRawKey={showRawKey}
          selectedVersion={selectedVersion}
          setShowRawKey={setShowRawKey}
        ></LicenseKey>
        {/* 구역 2: 실사용 임직원 테이블 매핑 */}
        <LicenseUsedUser
          selectedVersion={selectedVersion}
          onAction={onAction}
        ></LicenseUsedUser>
        {/* 구역 3: 라이선스 이력관리 */}
        <LicensePuchaseHistory
          isLicenseRequired={isLicenseRequired}
          selectedVersion={selectedVersion}
          onAction={onAction}
        ></LicensePuchaseHistory>
      </DetailScrollZone>
    </RightPanel>
  );
};

const RightPanel = styled.div`
  flex: 1;
  background: ${() => theme.colors.white};
  display: flex;
  flex-direction: column;
`;
const DetailScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

export const MiniActionButton = styled.button`
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${() => theme.colors.textSub};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  &:hover {
    border-color: ${() => theme.colors.primary};
    color: ${() => theme.colors.primary};
    background: #fff;
  }
  &.danger:hover {
    border-color: ${() => theme.colors.error};
    color: ${() => theme.colors.error};
    background: ${() => theme.colors.errorBg};
  }
`;

export const UserTableContainer = styled.div`
  border: 1px solid ${() => theme.colors.borderLight};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${() => theme.shadows.card};
  background: #fff;
`;
export const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
`;
const EmptyZone = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  color: ${() => theme.colors.textMuted};
  background: ${() => theme.colors.bg};
`;
export const SectionHeaderZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;
export const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;
export const SectionAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
  transition: all 0.1s ease;
  &:hover:not(:disabled) {
    border-color: ${() => theme.colors.primary};
    color: ${() => theme.colors.primary};
    background: ${() => theme.colors.primaryLight};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TableActionButton = styled(MiniActionButton)`
  width: 24px;
  height: 24px;
`;

export const PurchaseHistoryContainer = styled(UserTableContainer)`
  margin-bottom: 4px;
`;

export default LicenseContentPannel;
