// 🚀 Body/SubscriptionListPanel.js
import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";
import {
  Globe,
  Edit3,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Search,
  Archive,
  Trash2,
  RotateCcw,
} from "lucide-react";

import { getExpirationStatus } from "../InfrastructureSubscription";
import SoftwareHeader from "../../SoftWare/Header/SoftwareHeader";

export default function SubscriptionListPanel({
  vendorList,
  selectedVendor,
  onSelectVendor,
  onOpenRegister,
  onOpenEdit,
  onTerminateVendor,
  onRestoreVendor, // 🚀 종료된 업체 서비스 재개(복구) 핸들러
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterMode, setFilterMode] = useState("ACTIVE"); // ACTIVE(운영중) | WARNING(임박) | TERMINATED(종료됨)

  // 탭별 건수 계산
  const activeCount = vendorList.filter((v) => v.lastService !== false).length;
  const terminatedCount = vendorList.filter(
    (v) => v.lastService === false,
  ).length;
  const warningCount = vendorList.filter((v) => {
    if (v.lastService === false) return false;
    return v.items?.some((item) => {
      if (item.lastService === false) return false;
      const st = getExpirationStatus(item.expireDate, item.alertDays).status;
      return st === "WARNING" || st === "EXPIRED";
    });
  }).length;

  const filteredVendors = vendorList.filter((v) => {
    const isTerminated = v.lastService === false;
    const matchesText =
      v.vendorName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      v.category.toLowerCase().includes(searchKeyword.toLowerCase());

    if (!matchesText) return false;

    // 1. 종료됨 탭 선택 시
    if (filterMode === "TERMINATED") return isTerminated;

    // 운영중/임박 탭에서는 종료된 업체 제외
    if (isTerminated) return false;

    // 2. 연장 임박 탭 선택 시
    if (filterMode === "WARNING") {
      return v.items?.some((item) => {
        if (item.lastService === false) return false;
        const st = getExpirationStatus(item.expireDate, item.alertDays).status;
        return st === "WARNING" || st === "EXPIRED";
      });
    }

    // 3. 운영중(기본) 탭
    return true;
  });

  return (
    <LeftPanel>
      <SoftwareHeader
        title={"구독/계약 업체"}
        subTitle={"도메인, 인증서, 유지보수 관리"}
        onModalOpen={onOpenRegister}
      />

      {/* 🚀 3단 상태 필터 탭 (운영중 / 연장 임박 / 종료됨) */}
      <FilterSegment>
        <SegmentBtn
          type="button"
          active={filterMode === "ACTIVE"}
          onClick={() => setFilterMode("ACTIVE")}
        >
          운영중 ({activeCount})
        </SegmentBtn>
        <SegmentBtn
          type="button"
          active={filterMode === "WARNING"}
          onClick={() => setFilterMode("WARNING")}
        >
          🚨 임박 ({warningCount})
        </SegmentBtn>
        <SegmentBtn
          type="button"
          active={filterMode === "TERMINATED"}
          isTerminatedTab={true}
          onClick={() => setFilterMode("TERMINATED")}
        >
          종료됨 ({terminatedCount})
        </SegmentBtn>
      </FilterSegment>

      <SearchBarWrapper>
        <Search size={15} className="search-icon" />
        <SearchInput
          placeholder="업체명, 카테고리 검색..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </SearchBarWrapper>

      <ScrollZone>
        {filteredVendors.length === 0 ? (
          <EmptyVendorBox>
            {filterMode === "TERMINATED"
              ? "서비스 종료 처리된 업체 내역이 없습니다."
              : "조건에 해당하는 구독/계약 업체가 없습니다."}
          </EmptyVendorBox>
        ) : (
          filteredVendors.map((vendor) => {
            const isSelected = selectedVendor?.vendorId === vendor.vendorId;
            const isTerminated = vendor.lastService === false;

            const activeItems =
              vendor.items?.filter((i) => i.lastService !== false) || [];

            const urgentCount = activeItems.filter((item) => {
              const st = getExpirationStatus(
                item.expireDate,
                item.alertDays,
              ).status;
              return st === "WARNING" || st === "EXPIRED";
            }).length;

            return (
              <VendorCard
                key={vendor.vendorId}
                isSelected={isSelected}
                isTerminated={isTerminated}
                hasUrgent={!isTerminated && urgentCount > 0}
                onClick={() => onSelectVendor(vendor)}
              >
                <CardTop>
                  <div className="identity">
                    <Globe
                      size={16}
                      className={isTerminated ? "icon terminated" : "icon"}
                    />
                    <span
                      className={isTerminated ? "name terminated" : "name"}
                      title={vendor.vendorName}
                    >
                      {vendor.vendorName}
                    </span>
                  </div>

                  <ActionGroup>
                    <ChevronRight size={16} className="arrow" />
                    <HoverButtonBox className="hover-actions">
                      <InlineActionBtn
                        type="button"
                        title="업체 정보 수정"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectVendor(vendor);
                          onOpenEdit();
                        }}
                      >
                        <Edit3 size={13} />
                      </InlineActionBtn>

                      {isTerminated ? (
                        <InlineActionBtn
                          type="button"
                          className="restore"
                          title="서비스 재개 (운영중으로 복구)"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRestoreVendor && onRestoreVendor(vendor);
                          }}
                        >
                          <RotateCcw size={13} />
                        </InlineActionBtn>
                      ) : (
                        <InlineActionBtn
                          type="button"
                          className="danger"
                          title="업체 서비스 종료"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTerminateVendor && onTerminateVendor(vendor);
                          }}
                        >
                          <Trash2 size={13} />
                        </InlineActionBtn>
                      )}
                    </HoverButtonBox>
                  </ActionGroup>
                </CardTop>

                <CardMeta>
                  {vendor.category} · 운영 항목 {activeItems.length}건
                </CardMeta>

                {/* 🚀 상태 배너 분기 (종료됨 vs 연장필요 vs 정상) */}
                {isTerminated ? (
                  <StatusBanner statusType="TERMINATED">
                    <Archive size={13} />
                    <span>서비스 계약 종료됨 (비활성)</span>
                  </StatusBanner>
                ) : urgentCount > 0 ? (
                  <StatusBanner statusType="URGENT">
                    <AlertTriangle size={13} />
                    <span>기간 연장 필요 항목 {urgentCount}건 (60일 이내)</span>
                  </StatusBanner>
                ) : (
                  <StatusBanner statusType="NORMAL">
                    <CheckCircle2 size={13} />
                    <span>모든 계약 정상 유지중</span>
                  </StatusBanner>
                )}
              </VendorCard>
            );
          })
        )}
      </ScrollZone>
    </LeftPanel>
  );
}

const LeftPanel = styled.div`
  width: 320px;
  border-right: 1px solid ${() => theme.colors.border};
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;
const FilterSegment = styled.div`
  display: flex;
  gap: 4px;
  margin: 0 24px 12px 24px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
`;
const SegmentBtn = styled.button`
  flex: 1;
  border: none;
  padding: 6px 2px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  background: ${(props) => (props.active ? "#fff" : "transparent")};
  color: ${(props) => {
    if (!props.active) return "#64748b";
    return props.isTerminatedTab ? "#475569" : "#0f172a";
  }};
  box-shadow: ${(props) =>
    props.active ? "0 1px 3px rgba(0,0,0,0.08)" : "none"};
  transition: all 0.15s;
`;
const SearchBarWrapper = styled.div`
  margin: 0 24px 16px 24px;
  position: relative;
  display: flex;
  align-items: center;
  .search-icon {
    position: absolute;
    left: 12px;
    color: #94a3b8;
  }
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
const ScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 6px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const EmptyVendorBox = styled.div`
  padding: 36px 16px;
  text-align: center;
  font-size: 12px;
  color: ${() => theme.colors.textMuted};
  border: 1px dashed ${() => theme.colors.border};
  border-radius: 10px;
`;
const ActionGroup = styled.div`
  position: relative;
  min-width: 56px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
`;
const HoverButtonBox = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  gap: 4px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.15s ease-in-out;
`;
const InlineActionBtn = styled.button`
  width: 26px;
  height: 26px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  color: ${() => theme.colors.textSub};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(15, 23, 42, 0.06);
  &:hover {
    color: ${() => theme.colors.primary};
    border-color: ${() => theme.colors.primary};
    background: ${() => theme.colors.primaryLight};
  }
  &.danger:hover {
    color: #dc2626;
    border-color: #fca5a5;
    background: #fef2f2;
  }
  &.restore:hover {
    color: #059669;
    border-color: #6ee7b7;
    background: #ecfdf5;
  }
`;
const VendorCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  cursor: pointer;
  opacity: ${(props) => (props.isTerminated ? 0.78 : 1)};
  border: 1px solid
    ${(props) =>
      props.isSelected
        ? theme.colors.primary
        : props.isTerminated
          ? "#cbd5e1"
          : props.hasUrgent
            ? "#fde68a"
            : theme.colors.borderLight};
  background: ${(props) =>
    props.isSelected
      ? theme.colors.primaryLight
      : props.isTerminated
        ? "#f8fafc"
        : "#fff"};
  box-shadow: ${() => theme.shadows.card};
  transition: all 0.2s;
  &:hover {
    transform: translateY(-2px);
    opacity: 1;
    border-color: ${() => theme.colors.primary};
    .hover-actions {
      opacity: 1;
      transform: scale(1);
    }
    .arrow {
      opacity: 0;
    }
  }
  .arrow {
    color: ${() => theme.colors.textMuted};
    transition: opacity 0.1s;
  }
`;
const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  .identity {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }
  .icon {
    color: ${() => theme.colors.primary};
    flex-shrink: 0;
    &.terminated {
      color: #94a3b8;
    }
  }
  .name {
    font-size: 14px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &.terminated {
      color: #64748b;
      text-decoration: line-through;
    }
  }
`;
const CardMeta = styled.p`
  font-size: 11px;
  color: ${() => theme.colors.textMuted};
  margin: 4px 0 0 24px;
`;
const StatusBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  margin-left: 24px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  background: ${(props) =>
    props.statusType === "TERMINATED"
      ? "#f1f5f9"
      : props.statusType === "URGENT"
        ? "#fffbeb"
        : "#f0fdf4"};
  border: 1px solid
    ${(props) =>
      props.statusType === "TERMINATED"
        ? "#e2e8f0"
        : props.statusType === "URGENT"
          ? "#fde68a"
          : "#bbf7d0"};
  color: ${(props) =>
    props.statusType === "TERMINATED"
      ? "#64748b"
      : props.statusType === "URGENT"
        ? "#b45309"
        : "#15803d"};
`;
