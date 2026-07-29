import { Search } from "lucide-react";
import React from "react";
import styled from "styled-components";
import SoftwareHeader from "../../../SoftWare/Header/SoftwareHeader";

const priorityColors = { 긴급: "#ef4444", 보통: "#3b82f6", 낮음: "#94a3b8" };
const statusColors = {
  대기중: "#f59e0b",
  진행중: "#2563eb",
  완료: "#10b981",
};

const HelpDeskLists = ({
  tickets,
  currentTab,
  searchQuery,
  selectedTicket,
  setIsCreateModalOpen,
  setCurrentTab,
  setSearchQuery,
  setSelectedTicket,
}) => {
  const filteredTickets = tickets.filter((t) => {
    // 1. 탭 상태 필터링
    if (currentTab !== "전체" && t.status !== currentTab) return false;

    // 2. 검색어 필터링
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const cleanQ = q.startsWith("#") ? q.replace("#", "") : q;
    return (
      t.title.toLowerCase().includes(cleanQ) ||
      t.hashTags.some((tag) => tag.toLowerCase().includes(cleanQ))
    );
  });
  return (
    <LeftBoardPanel>
      <SoftwareHeader
        title="IT 헬프데스크 리스트"
        subTitle="IT 헬프데스크 조치 및 대응 리스트"
        onModalOpen={() => setIsCreateModalOpen(true)}
      />
      <SearchBarContainer>
        <Search size={14} className="search-icon" />
        <SearchInput
          placeholder="이슈 명, 혹은 #해시태그 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchBarContainer>

      {/* 🚀 신규: 상태 카테고리 탭 UI */}
      <FilterTabContainer>
        {["전체", "대기중", "진행중", "완료"].map((tab) => (
          <FilterTab
            key={tab}
            $active={currentTab === tab}
            onClick={() => setCurrentTab(tab)}
          >
            {tab}
          </FilterTab>
        ))}
      </FilterTabContainer>

      <BoardListZone>
        {filteredTickets.map((t) => {
          const isSelected = selectedTicket?.id === t.id;
          return (
            <BoardCard
              key={t.id}
              isSelected={isSelected}
              onClick={() => setSelectedTicket(t)}
            >
              <CardHeader>
                <span className="issue-id">{t.id}</span>
                <StatusBadge bg={statusColors[t.status]}>
                  {t.status}
                </StatusBadge>
              </CardHeader>
              <CardTitle>{t.title}</CardTitle>
              <TagWrapper>
                {t.hashTags.map((tag) => (
                  <span key={tag} className="tag">
                    #{tag}
                  </span>
                ))}
              </TagWrapper>

              {/* 🚀 신규: 등록일 및 해결일 렌더링 존 */}
              <DateInfoZone>
                <span className="date-item">등록: {t.createdAt}</span>
                {t.status === "완료" && (
                  <span className="date-item resolve">
                    {/* 백엔드에서 resolvedAt을 준다면 t.resolvedAt을 사용하고, 없다면 대체 텍스트 표출 */}
                    해결: {t.resolvedAt || "처리 완료"}
                  </span>
                )}
              </DateInfoZone>

              <CardFooter>
                <span className="engineer-info">
                  담당:{" "}
                  {t.currentEngineerId
                    ? `${t.currentEngineerDepartmentName} ${t.currentEngineerName} ${t.currentEngineerPosition}`
                    : "미배정"}
                </span>
                <PriorityText color={priorityColors[t.priority]}>
                  ● {t.priority}
                </PriorityText>
              </CardFooter>
            </BoardCard>
          );
        })}
      </BoardListZone>
    </LeftBoardPanel>
  );
};

const LeftBoardPanel = styled.div`
  width: 340px;
  border-right: 1px solid #e2e8f0;
  background: #fff;
  display: flex;
  flex-direction: column;
`;
const SearchBarContainer = styled.div`
  margin: 0 20px 12px 20px;
  position: relative;
  display: flex;
  align-items: center;
  .search-icon {
    position: absolute;
    left: 10px;
    color: #94a3b8;
  }
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 7px 12px 7px 32px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 12px;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #2563eb;
    background: #fff;
  }
`;
const BoardListZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 10px;
`;
const BoardCard = styled.div`
  padding: 14px;
  border: 1px solid ${(props) => (props.isSelected ? "#2563eb" : "#e2e8f0")};
  border-radius: 8px;
  cursor: pointer;
  background: ${(props) => (props.isSelected ? "#eff6ff" : "#fff")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.15s;
  &:hover {
    border-color: #2563eb;
    transform: translateY(-1px);
  }
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .issue-id {
    font-family: monospace;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
  }
`;
const StatusBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: ${(props) => props.bg};
  padding: 1px 6px;
  border-radius: 4px;
`;
const CardTitle = styled.h4`
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  margin: 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
const TagWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  .tag {
    font-size: 10px;
    font-weight: 600;
    color: #2563eb;
    background: #f0f7ff;
    padding: 1px 5px;
    border-radius: 4px;
  }
`;

const PriorityText = styled.span`
  color: ${(props) => props.color};
  font-weight: 700;
`;

const FilterTabContainer = styled.div`
  display: flex;
  padding: 0 20px;
  margin-bottom: 12px;
  gap: 6px;
`;

const FilterTab = styled.button`
  flex: 1;
  padding: 6px 0;
  font-size: 11.5px;
  font-weight: 700;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$active ? "#2563eb" : "#e2e8f0")};
  background: ${(props) => (props.$active ? "#eff6ff" : "#f8fafc")};
  color: ${(props) => (props.$active ? "#2563eb" : "#64748b")};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${(props) => (props.$active ? "#eff6ff" : "#f1f5f9")};
  }
`;

const DateInfoZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 10.5px;
  color: #94a3b8;
  margin-top: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed #e2e8f0;

  .date-item {
    font-family: monospace;
  }
  .resolve {
    color: #059669;
    font-weight: 700;
  }
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #64748b;
  margin-top: 8px;
  font-weight: 500;

  .engineer-info {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 180px;
  }
`;

export default HelpDeskLists;
