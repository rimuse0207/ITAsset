import React from "react";
import styled from "styled-components";

import { Search, AlertCircle, Package, Edit3, Trash2 } from "lucide-react";
import SoftwareHeader from "../../SoftWare/Header/SoftwareHeader";
import { theme } from "../../Style/MainStyle";

export default function ConsumableListPanel({
  list,
  selectedItem,
  onSelect,
  searchQuery,
  onSearchChange,
  onOpenRegister,
  onOpenEdit,
  onDelete,
}) {
  return (
    <ListPanel>
      <SoftwareHeader
        title={"소모품 관리"}
        subTitle={"실물 소모품 자산 관리"}
        onModalOpen={onOpenRegister}
      />

      <SearchBarWrapper>
        <Search size={16} className="search-icon" />
        <SearchInput
          placeholder="품명, 카테고리 검색..."
          value={searchQuery}
          onChange={onSearchChange}
        />
      </SearchBarWrapper>

      <ScrollZone>
        {list.length === 0 && <EmptySearch>검색 결과가 없습니다.</EmptySearch>}

        {list.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          const isLowStock = item.currentStock <= (item.minStock || 0);

          return (
            <ItemCard
              key={item.id}
              isSelected={isSelected}
              onClick={() => onSelect(item)}
            >
              <ThumbnailZone>
                {item.imageUrl ? (
                  <img
                    src={`${process.env.REACT_APP_DB_HOST}/itasset/consumable/${item.imageUrl}`}
                    alt={item.name}
                  />
                ) : (
                  <Package size={28} color={theme.colors.textMuted} />
                )}
              </ThumbnailZone>

              <InfoZone>
                <div className="title-row">
                  <span className="name">{item.name}</span>

                  <ActionGroupWrapper className="action-group">
                    <InlineEditButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(item);
                        onOpenEdit(item);
                      }}
                    >
                      <Edit3 size={12} />
                    </InlineEditButton>
                    <InlineDeleteButton
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item);
                      }}
                    >
                      <Trash2 size={12} />
                    </InlineDeleteButton>
                  </ActionGroupWrapper>
                </div>
                <div className="meta-row">
                  <span className="category">{item.category}</span>
                  {item.itemType && (
                    <span className="item-type"> · {item.itemType}</span>
                  )}
                </div>

                <StockStatus isLow={isLowStock}>
                  <div className="stock-text">
                    현재 재고: <strong>{item.currentStock}</strong> 개
                  </div>
                  {isLowStock && (
                    <div className="alert-badge">
                      <AlertCircle size={12} /> 재고 부족
                    </div>
                  )}
                </StockStatus>
              </InfoZone>
            </ItemCard>
          );
        })}
      </ScrollZone>
    </ListPanel>
  );
}

const ListPanel = styled.div`
  width: 340px;
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
  .search-icon {
    position: absolute;
    left: 12px;
    color: ${() => theme.colors.textMuted};
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
  }
`;
const ScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const EmptySearch = styled.div`
  text-align: center;
  padding: 40px 0;
  font-size: 13px;
  color: ${() => theme.colors.textMuted};
`;
const ThumbnailZone = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: ${() => theme.colors.bg};
  border: 1px solid ${() => theme.colors.borderLight};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
const StockStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .stock-text {
    font-size: 12px;
    color: ${(props) =>
      props.isLow ? theme.colors.error : theme.colors.textSub};
    strong {
      font-size: 14px;
      color: ${(props) =>
        props.isLow ? theme.colors.error : theme.colors.primary};
    }
  }
  .alert-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    font-weight: 700;
    color: ${() => theme.colors.error};
    background: ${() => theme.colors.errorBg};
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

const ActionGroupWrapper = styled.div`
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;
`;

const InlineButton = styled.button`
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
`;
const InlineEditButton = styled(InlineButton)`
  color: ${() => theme.colors.textSub};
  &:hover {
    color: ${() => theme.colors.primary};
    border-color: ${() => theme.colors.primary};
  }
`;
const InlineDeleteButton = styled(InlineButton)`
  color: ${() => theme.colors.textSub};
  &:hover {
    color: ${() => theme.colors.error};
    border-color: ${() => theme.colors.error};
    background: ${() => theme.colors.errorBg};
  }
`;

const InfoZone = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .name {
      font-size: 14px;
      font-weight: 700;
      color: ${() => theme.colors.textMain};
    }
  }
  .meta-row {
    font-size: 11px;
    color: ${() => theme.colors.textMuted};
    margin-top: 4px;
    margin-bottom: 8px;
    .item-type {
      color: ${() => theme.colors.textSub};
      font-weight: 500;
    }
  }
`;

const ItemCard = styled.div`
  display: flex;
  gap: 14px;
  padding: 14px;
  border: 1px solid
    ${(props) =>
      props.isSelected ? theme.colors.primary : theme.colors.borderLight};
  border-radius: 12px;
  background: ${(props) =>
    props.isSelected ? theme.colors.primaryLight : theme.colors.white};
  box-shadow: ${() => theme.shadows.card};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    border-color: ${() => theme.colors.primary};
    .action-group {
      opacity: 1;
    }
  }
`;
