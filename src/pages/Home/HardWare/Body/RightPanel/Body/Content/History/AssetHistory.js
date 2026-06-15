import React from "react";
import { theme } from "../../../../../../Style/MainStyle";
import styled from "styled-components";
import {
  MoveRight,
  User,
  Calendar,
  MessageSquare,
  ArrowDown,
} from "lucide-react";
import moment from "moment";

const AssetHistory = ({ selectedAsset }) => {
  const reasonColors = {
    "신규 지급": { bg: "#eff6ff", text: "#2563eb", dot: "#2563eb" },
    "노후화로 인한 회수": { bg: "#fffbeb", text: "#b45309", dot: "#f59e0b" },
    "퇴사로 인한 회수": { bg: "#fef2f2", text: "#dc2626", dot: "#ef4444" },
    기본: { bg: "#f1f5f9", text: "#475569", dot: "#94a3b8" },
  };

  if (!selectedAsset?.historys || selectedAsset.historys.length === 0) {
    return (
      <EmptyHistoryZone>
        <User size={20} className="empty-icon" />
        <div>소유권 발령 및 반납 이력이 존재하지 않습니다.</div>
      </EmptyHistoryZone>
    );
  }

  return (
    <TimelineContainer>
      {selectedAsset.historys.map((history, idx) => {
        // 백엔드 스네이크/카멜케이스 크로스 디펜스 대응 매핑 변수화
        const reason = history.changeReason || history.reason || "정보 변경";
        const currentTheme = reasonColors[reason] || reasonColors["기본"];

        const isReturn = reason.includes("회수"); // 반납(회수) 건인지 판별 플래그

        const prevUserStr = history.prevUserName
          ? `${history.prevUserDept || ""} ${history.prevUserName} ${history.prevUserTitle || ""}`.trim()
          : null;

        const nextUserStr =
          history.nextUserName && history.nextUserName !== "-"
            ? `${history.nextUserDept || ""} ${history.nextUserName} ${history.nextUserTitle || ""}`.trim()
            : null;

        const memoContent =
          history.logMemo || history.assignmentMemo || history.memo;

        return (
          <TimelineItem key={idx}>
            <TimelineLine />

            <TimelineNode color={currentTheme.dot} />

            <TimelineContent>
              {/* 상단 타임 헤더 구역 */}
              <div className="time-header">
                <span className="time-date">
                  <Calendar
                    size={13}
                    style={{ marginRight: "4px", color: "#64748b" }}
                  />
                  {moment(history.giveDate || history.updateDate).format(
                    "YYYY년 MM월 DD일",
                  )}
                </span>

                <ReasonBadge cTheme={currentTheme}>{reason}</ReasonBadge>
              </div>

              <AssignmentFlowRowZone>
                {/* 1. 인계 주체 (이전 소유자) */}
                <UserBox>
                  <span className="user-label">이전 소유자</span>
                  <span className="user-value">
                    {prevUserStr || "IT팀 보관중 (재고)"}
                  </span>
                </UserBox>

                {/* 중간 브릿지 화살표 흐름 유도 */}
                <MoveRight size={16} className="flow-arrow" />

                {/* 2. 인수 주체 (신규 소유자) */}
                <UserBox className="next" isReturn={isReturn}>
                  <span className="user-label">
                    {isReturn ? "회수 처리" : "신규 소유자"}
                  </span>
                  <span className="user-value">
                    {isReturn ? "IT팀 보관중" : nextUserStr || "미지정 사원"}
                  </span>
                </UserBox>
              </AssignmentFlowRowZone>

              {/* 🚀 관리자 상세 서사 비고 코멘트 전용 고도화 블록 */}
              {memoContent && (
                <HistoryMemoBlock>
                  <div className="memo-header-side">
                    <MessageSquare size={12} className="memo-icon" />
                    <span>발령 상세 메모</span>
                  </div>
                  <div className="memo-text">{memoContent}</div>
                </HistoryMemoBlock>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 4px;
`;

const TimelineItem = styled.div`
  display: flex;
  position: relative;
  padding-bottom: 28px;
  &:last-child {
    padding-bottom: 0;
  }
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 6px;
  top: 14px;
  bottom: -6px;
  width: 2px;
  background: ${() => theme.colors.borderLight};
  ${TimelineItem}:last-child & {
    display: none;
  }
`;

const TimelineNode = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(props) => props.color};
  border: 3px solid ${() => theme.colors.white};
  box-shadow: 0 0 0 1px ${(props) => props.color};
  z-index: 2;
  margin-top: 4px;
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);

  ${TimelineItem}:hover & {
    transform: scale(1.2);
  }
`;

const TimelineContent = styled.div`
  margin-left: 16px;
  flex: 1;
  overflow: hidden;

  .time-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .time-date {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    color: ${() => theme.colors.textMuted};
    font-family: monospace;
  }
`;

const ReasonBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  background-color: ${(props) => props.cTheme.bg};
  color: ${(props) => props.cTheme.text};
  padding: 2.5px 8px;
  border-radius: 6px;
  border: 1px solid ${(props) => props.cTheme.text}18;
`;

const AssignmentFlowRowZone = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;

  .flow-arrow {
    color: #cbd5e1;
    flex-shrink: 0;
  }
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  flex: 1;
  min-width: 0;

  .user-label {
    font-size: 10px;
    font-weight: 700;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.02em;
  }

  .user-value {
    font-size: 12.5px;
    font-weight: 700;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.next {
    border-color: ${(props) => (props.isReturn ? "#fca5a5" : "#bfdbfe")};
    background: ${(props) => (props.isReturn ? "#fef2f2" : "#f0f7ff")};

    .user-label {
      color: ${(props) => (props.isReturn ? "#ef4444" : "#2563eb")};
    }
    .user-value {
      color: ${(props) => (props.isReturn ? "#991b1b" : "#1e40af")};
    }
  }
`;

const HistoryMemoBlock = styled.div`
  margin-top: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-left: 3px solid #cbd5e1;
  border-radius: 4px 8px 8px 4px;

  .memo-header-side {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 4px;

    .memo-icon {
      color: #94a3b8;
    }
  }

  .memo-text {
    font-size: 12.5px;
    color: #475569;
    line-height: 1.5;
    font-weight: 500;
    white-space: pre-wrap;
  }
`;

const EmptyHistoryZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 500;
  gap: 8px;
  .empty-icon {
    color: #cbd5e1;
  }
`;

export default AssetHistory;
