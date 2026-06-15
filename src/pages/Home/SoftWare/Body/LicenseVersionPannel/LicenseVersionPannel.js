import React from "react";
import { theme } from "../../../Style/MainStyle";
import styled from "styled-components";
import { Edit3 } from "lucide-react"; // 🚀 Edit3 아이콘 추가

import SoftwareHeader from "../../Header/SoftwareHeader";
import moment from "moment";

const LicenseVersionPannel = ({
  selectedSW,
  selectedVersion,
  setSelectedVersion,
  setIsKeyUnlocked,
  setShowRawKey,
  onOpenVersionRegister,
  onOpenVersionEdit,
}) => {
  return (
    <MiddlePanel>
      <SoftwareHeader
        title={"소프트웨어 버전"}
        subTitle={`${selectedSW.swName} 의 릴리즈 내역`}
        onModalOpen={onOpenVersionRegister}
      />
      <VersionListZone>
        {selectedSW.versions?.map((ver, idx) => {
          const isVerSelected = selectedVersion?.versionStr === ver.versionStr;
          return (
            <VersionRow
              key={idx}
              isSelected={isVerSelected}
              onClick={() => {
                setSelectedVersion(ver);
                setIsKeyUnlocked(false);
                setShowRawKey(false);
              }}
            >
              <div>
                <div className="ver-string">{ver.versionStr}</div>
                <div className="ver-date">
                  릴리즈 일자: {moment(ver.releaseDate).format("YYYY.MM.DD")}
                </div>
              </div>

              <BadgeActionWrapper>
                <div className="ver-badge">배포판</div>
                <InlineEditButton
                  title="버전 사양 수정"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVersion(ver);
                    onOpenVersionEdit(ver);
                  }}
                >
                  <Edit3 size={12} />
                </InlineEditButton>
              </BadgeActionWrapper>
            </VersionRow>
          );
        })}
      </VersionListZone>
    </MiddlePanel>
  );
};

const MiddlePanel = styled.div`
  width: 280px;
  border-right: 1px solid ${() => theme.colors.border};
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const VersionListZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BadgeActionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 50px;
  height: 24px;
`;

const InlineEditButton = styled.button`
  position: absolute;
  right: 0;
  padding: 4px 10px;
  background: ${() => theme.colors.white};
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  color: ${() => theme.colors.textSub};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.85);
  transition: all 0.15s ease-in-out;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);

  &:hover {
    color: ${() => theme.colors.primary};
    border-color: ${() => theme.colors.primary};
    background: ${() => theme.colors.primaryLight};
  }
`;

const VersionRow = styled.div`
  padding: 14px 16px;
  border: 1px solid
    ${(props) => (props.isSelected ? theme.colors.primary : "transparent")};
  background: ${(props) =>
    props.isSelected ? theme.colors.primaryLight : theme.colors.bg};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s;

  .ver-string {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) =>
      props.isActive || props.isSelected
        ? theme.colors.primary
        : theme.colors.textMain};
  }

  .ver-date {
    font-size: 11px;
    color: ${() => theme.colors.textMuted};
    margin-top: 2px;
  }

  .ver-badge {
    font-size: 10px;
    font-weight: 700;
    color: ${() => theme.colors.textMuted};
    border: 1px solid ${() => theme.colors.border};
    padding: 2px 6px;
    border-radius: 4px;
    background: #fff;
    transition: opacity 0.1s ease-in-out;
  }

  &:hover {
    transform: translateY(-1px);
    background: ${(props) =>
      props.isSelected ? theme.colors.primaryLight : theme.colors.borderLight};

    .ver-badge {
      opacity: 0;
    }
    ${InlineEditButton} {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export default LicenseVersionPannel;
