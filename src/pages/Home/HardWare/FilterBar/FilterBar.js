import React from "react";
import { Filter, Search, RotateCcw } from "lucide-react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  openModal,
  hasAdvanced,
  onResetAdvanced,
}) => {
  return (
    <FilterBarMain>
      <SearchWrapper>
        <SearchIcon size={18} />
        <SearchInput
          type="text"
          placeholder="자산 코드, 시리얼, 사용자 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchWrapper>

      <RightControlBoxGrid>
        {/* 🚀 신속 콤보 제어 컨트롤러 조합 */}
        <SelectCombo
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">전체 운영상태</option>
          <option value="사용중">사용중</option>
          <option value="재고">재고</option>
          <option value="고장">고장</option>
          <option value="수리중">수리중</option>
        </SelectCombo>

        <SelectCombo value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="LATEST">최근 입고 순</option>
          <option value="CODE">자산 코드 순</option>
        </SelectCombo>

        {/* 상세필터 칩 상태 하이라이트 트리거 */}
        <OutlineButton active={hasAdvanced} onClick={openModal}>
          <Filter size={16} />
          <span>상세조건 필터</span>
        </OutlineButton>

        {hasAdvanced && (
          <ResetAdvancedBadge
            onClick={onResetAdvanced}
            title="고급 필터 조건 초기화"
          >
            <RotateCcw size={12} /> 전체 초기화
          </ResetAdvancedBadge>
        )}
      </RightControlBoxGrid>
    </FilterBarMain>
  );
};

const FilterBarMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 320px;
`;
const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 12px;
  color: ${() => theme.colors.textMuted};
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 11px 14px 11px 42px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  font-size: 13.5px;
  background-color: ${() => theme.colors.white};
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;
const RightControlBoxGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SelectCombo = styled.select`
  padding: 10px 12px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  background-color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;

const OutlineButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid
    ${(props) => (props.active ? "#2563eb" : theme.colors.border)};
  background-color: ${(props) =>
    props.active ? "#eff6ff" : theme.colors.white};
  color: ${(props) => (props.active ? "#2563eb" : theme.colors.textSub)};
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`;

const ResetAdvancedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  &:hover {
    background: #fee2e2;
    color: #ef4444;
    border-color: #fca5a5;
  }
`;

export default FilterBar;
