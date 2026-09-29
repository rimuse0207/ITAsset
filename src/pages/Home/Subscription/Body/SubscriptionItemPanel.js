// 🚀 Body/SubscriptionItemPanel.js (중앙 패널)
import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";
import { Edit3, Calendar, Trash2, RotateCcw } from "lucide-react";

import { getExpirationStatus } from "../InfrastructureSubscription";
import SoftwareHeader from "../../SoftWare/Header/SoftwareHeader";

export default function SubscriptionItemPanel({
  selectedVendor,
  selectedItem,
  setSelectedItem,
  onOpenItemRegister,
  onOpenItemEdit,
  onTerminateItem,
  onRestoreItem, // 🚀 종료된 세부 항목 복구 핸들러
}) {
  const [itemFilter, setItemFilter] = useState("ACTIVE"); // ACTIVE | TERMINATED

  if (!selectedVendor) return <MiddlePanel />;

  const allItems = selectedVendor.items || [];
  const activeItems = allItems.filter((i) => i.lastService !== false);
  const terminatedItems = allItems.filter((i) => i.lastService === false);

  const displayItems = itemFilter === "ACTIVE" ? activeItems : terminatedItems;

  return (
    <MiddlePanel>
      <SoftwareHeader
        title={"세부 만료 대상"}
        subTitle={`${selectedVendor.vendorName} 관리 항목`}
        onModalOpen={onOpenItemRegister}
      />

      {/* 🚀 세부 항목 운영중 / 종료됨 필터 탭 */}
      <ItemTabBar>
        <ItemTabBtn
          type="button"
          active={itemFilter === "ACTIVE"}
          onClick={() => setItemFilter("ACTIVE")}
        >
          운영 항목 ({activeItems.length})
        </ItemTabBtn>
        <ItemTabBtn
          type="button"
          active={itemFilter === "TERMINATED"}
          onClick={() => setItemFilter("TERMINATED")}
        >
          종료된 항목 ({terminatedItems.length})
        </ItemTabBtn>
      </ItemTabBar>

      <ItemListZone>
        {displayItems.length === 0 ? (
          <EmptyItemBox>
            {itemFilter === "TERMINATED"
              ? "종료 처리된 세부 항목이 없습니다."
              : "운영 중인 세부 만료 항목이 없습니다. 상단 + 버튼을 눌러 추가해 주세요."}
          </EmptyItemBox>
        ) : (
          displayItems.map((item) => {
            const isSelected = selectedItem?.itemId === item.itemId;
            const isTerminated = item.lastService === false;
            const expInfo = getExpirationStatus(
              item.expireDate,
              item.alertDays,
            );

            return (
              <ItemRow
                key={item.itemId}
                isSelected={isSelected}
                isTerminated={isTerminated}
                onClick={() => setSelectedItem(item)}
              >
                <InfoCol>
                  <div
                    className={
                      isTerminated ? "item-name terminated" : "item-name"
                    }
                    title={item.itemName}
                  >
                    {item.itemName}
                  </div>
                  <div className="expire-date">
                    <Calendar size={11} className="cal-icon" />
                    <span>만료일:</span>
                    <b>{item.expireDate}</b>
                    <span className="cycle-tag">({item.cycleType})</span>
                  </div>
                </InfoCol>

                <BadgeActionWrapper>
                  {isTerminated ? (
                    <TerminatedBadge className="dday-badge">
                      종료됨
                    </TerminatedBadge>
                  ) : (
                    <DdayBadge className="dday-badge" cInfo={expInfo}>
                      {expInfo.label}
                    </DdayBadge>
                  )}

                  <HoverActionBox className="hover-actions">
                    <InlineActionButton
                      type="button"
                      title="항목 수정"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                        onOpenItemEdit();
                      }}
                    >
                      <Edit3 size={12} />
                    </InlineActionButton>

                    {isTerminated ? (
                      <InlineActionButton
                        type="button"
                        className="restore"
                        title="항목 서비스 재개 (복구)"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestoreItem && onRestoreItem(item);
                        }}
                      >
                        <RotateCcw size={12} />
                      </InlineActionButton>
                    ) : (
                      <InlineActionButton
                        type="button"
                        className="danger"
                        title="항목 서비스 종료"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTerminateItem && onTerminateItem(item);
                        }}
                      >
                        <Trash2 size={12} />
                      </InlineActionButton>
                    )}
                  </HoverActionBox>
                </BadgeActionWrapper>
              </ItemRow>
            );
          })
        )}
      </ItemListZone>
    </MiddlePanel>
  );
}

const MiddlePanel = styled.div`
  width: 340px;
  border-right: 1px solid ${() => theme.colors.border};
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
`;
const ItemTabBar = styled.div`
  display: flex;
  gap: 4px;
  margin: 0 20px 10px 20px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 8px;
`;
const ItemTabBtn = styled.button`
  flex: 1;
  border: none;
  padding: 5px 0;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  background: ${(props) => (props.active ? "#fff" : "transparent")};
  color: ${(props) => (props.active ? "#0f172a" : "#64748b")};
  box-shadow: ${(props) =>
    props.active ? "0 1px 3px rgba(0,0,0,0.08)" : "none"};
`;
const ItemListZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 6px 20px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const EmptyItemBox = styled.div`
  padding: 32px 16px;
  text-align: center;
  font-size: 12px;
  color: ${() => theme.colors.textMuted};
  border: 1px dashed ${() => theme.colors.border};
  border-radius: 10px;
  line-height: 1.5;
`;
const InfoCol = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
  .item-name {
    font-size: 13px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
    line-height: 1.35;
    word-break: keep-all;
    overflow-wrap: break-word;
    &.terminated {
      color: #64748b;
      text-decoration: line-through;
    }
  }
  .expire-date {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: ${() => theme.colors.textMuted};
    white-space: nowrap;
    .cal-icon {
      flex-shrink: 0;
    }
    b {
      color: #334155;
      font-family: monospace;
      font-size: 11.5px;
    }
    .cycle-tag {
      color: #64748b;
    }
  }
`;
const BadgeActionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  min-height: 26px;
`;
const DdayBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 10.5px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${(props) => props.cInfo.bg};
  color: ${(props) => props.cInfo.color};
  border: 1px solid ${(props) => props.cInfo.border};
  transition: opacity 0.12s ease-in-out;
`;
const TerminatedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-size: 10.5px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #cbd5e1;
  transition: opacity 0.12s ease-in-out;
`;
const HoverActionBox = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.15s ease-in-out;
`;
const InlineActionButton = styled.button`
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
  box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06);
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
const ItemRow = styled.div`
  padding: 14px 16px;
  opacity: ${(props) => (props.isTerminated ? 0.75 : 1)};
  border: 1px solid
    ${(props) => (props.isSelected ? theme.colors.primary : "transparent")};
  background: ${(props) =>
    props.isSelected ? theme.colors.primaryLight : theme.colors.bg};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  box-sizing: border-box;
  transition: all 0.15s;
  &:hover {
    opacity: 1;
    background: ${(props) =>
      props.isSelected ? theme.colors.primaryLight : theme.colors.borderLight};
    .dday-badge {
      opacity: 0;
    }
    .hover-actions {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
