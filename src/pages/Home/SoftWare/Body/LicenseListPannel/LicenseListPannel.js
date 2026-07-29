import React from "react";
import { theme } from "../../../Style/MainStyle";
import styled from "styled-components";
import { ChevronRight, Package, Edit3, Globe } from "lucide-react";
import SoftwareHeader from "../../Header/SoftwareHeader";

const LicenseListPannel = ({
  softwareList,
  handleSWSelect,
  selectedSW,
  onOpenRegister,
  onOpenEdit,
}) => {
  return (
    <LeftPanel>
      <SoftwareHeader
        title={"S/W 인벤토리"}
        subTitle={"보유 소프트웨어 자산 내역"}
        onModalOpen={onOpenRegister}
      />
      <SearchBarWrapper>
        <SearchIcon size={16} className="search-icon" />
        <SearchInput placeholder="S/W 명, 제조사 검색..." />
      </SearchBarWrapper>

      <SoftwareScrollZone>
        {softwareList.map((sw) => {
          const isSelected = selectedSW?.swCode === sw.swCode;

          const isLicenseRequired = sw.isLicenseRequired !== false;
          const isOverused =
            isLicenseRequired && sw.usedLicenses > sw.totalLicenses;

          return (
            <SoftwareCard
              key={sw.swCode}
              isSelected={isSelected}
              onClick={() => handleSWSelect(sw)}
            >
              <CardTop>
                <div className="sw-identity">
                  <Package size={16} className="sw-icon" />
                  <span className="sw-name">{sw.swName}</span>
                </div>

                <ActionGroupWrapper>
                  <ChevronRight size={16} className="arrow-icon" />
                  <InlineEditButton
                    title="제품 마스터 수정"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSWSelect(sw);
                      onOpenEdit();
                    }}
                  >
                    <Edit3 size={13} />
                  </InlineEditButton>
                </ActionGroupWrapper>
              </CardTop>

              <CardMeta>
                {sw.swVendor} · {sw.swCategory}
              </CardMeta>

              {isLicenseRequired ? (
                <LicenseProgressZone>
                  <div className="progress-labels">
                    <span>라이선스 사용 현황</span>
                    <span className={isOverused ? "over" : ""}>
                      {sw.usedLicenses} / {sw.totalLicenses} Copy
                    </span>
                  </div>
                  <ProgressBar>
                    <ProgressFill
                      percent={
                        sw.totalLicenses > 0
                          ? (sw.usedLicenses / sw.totalLicenses) * 100
                          : 0
                      }
                      isOver={isOverused}
                    />
                  </ProgressBar>
                </LicenseProgressZone>
              ) : (
                <FreeSoftwareBadgeBarZone>
                  <Globe size={12} className="free-icon" />
                  <span className="free-text">
                    무료 / 오픈소스 (라이선스 무제한)
                  </span>
                </FreeSoftwareBadgeBarZone>
              )}
            </SoftwareCard>
          );
        })}
      </SoftwareScrollZone>
    </LeftPanel>
  );
};

/* ─── 🎨 관제 레이아웃 디테일 스타일 시트 ─── */
const LeftPanel = styled.div`
  width: 320px;
  border-right: 1px solid ${() => theme.colors.border};
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const SearchBarWrapper = styled.div`
  margin: 0 24px 16px 24px;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled((props) => <div {...props} />)`
  position: absolute;
  left: 12px;
  color: ${() => theme.colors.textMuted};
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid ${() => theme.colors.borderLight};
  background: ${() => theme.colors.bg};
  border-radius: 8px;
  font-size: 13px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
    background: #fff;
  }
`;

const SoftwareScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ActionGroupWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
`;

const InlineEditButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

const SoftwareCard = styled.div`
  padding: 16px;
  border: 1px solid
    ${(props) =>
      props.isSelected ? theme.colors.primary : theme.colors.borderLight};
  border-radius: 12px;
  cursor: pointer;
  background: ${(props) =>
    props.isSelected ? theme.colors.primaryLight : theme.colors.white};
  box-shadow: ${() => theme.shadows.card};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;

  &:hover {
    transform: translateY(-2px);
    border-color: ${() => theme.colors.primary};

    ${InlineEditButton} {
      opacity: 1;
      transform: scale(1);
    }
    .arrow-icon {
      opacity: 0;
    }
  }

  .arrow-icon {
    color: ${() => theme.colors.textMuted};
    transition: opacity 0.1s;
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .sw-identity {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sw-icon {
    color: ${() => theme.colors.primary};
  }
  .sw-name {
    font-size: 14px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
  }
`;

const CardMeta = styled.p`
  font-size: 11px;
  color: ${() => theme.colors.textMuted};
  font-weight: 500;
  margin-top: 4px;
  padding-left: 24px;
  margin-bottom: 0;
`;

const LicenseProgressZone = styled.div`
  margin-top: 14px;
  padding-left: 24px;
  .progress-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    font-weight: 600;
    color: ${() => theme.colors.textSub};
    margin-bottom: 6px;
    .over {
      color: ${() => theme.colors.error};
    }
  }
`;

const ProgressBar = styled.div`
  height: 6px;
  background: ${() => theme.colors.borderLight};
  border-radius: 99px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(props) => Math.min(props.percent, 100)}%;
  background-color: ${(props) =>
    props.isOver ? theme.colors.error : theme.colors.success};
  border-radius: 99px;
`;

/* 🚀 무료 / 오픈소스 전용 콤팩트 틸 배너 가로 정렬 바 */
const FreeSoftwareBadgeBarZone = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  margin-left: 24px;
  padding: 6px 10px;
  background-color: #f0fdf4; /* 신선하고 편안한 소프트 민트 */
  border: 1px solid #ccfbf1;
  border-radius: 6px;
  box-sizing: border-box;

  .free-icon {
    color: #0d9488;
    flex-shrink: 0;
  }

  .free-text {
    font-size: 11px;
    font-weight: 700;
    color: #0f766e;
    letter-spacing: -0.01em;
  }
`;

export default LicenseListPannel;
