import {
  ArrowRightLeft,
  CheckCircle2,
  History,
  Link2,
  Mail,
  User,
} from "lucide-react";
import React, { useState } from "react";
import styled from "styled-components";
import { SharedEditor } from "../../Editor";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Request_Post_Axios } from "../../../../../API";
import { useSelector } from "react-redux";

const companyEngineers = [
  {
    code: "ENG-001",
    name: "김성준 팀장",
    email: "sjkim@dhk.co.kr",
    dept: "IT팀",
  },
  {
    code: "ENG-002",
    name: "최성진 프로",
    email: "sjchoi@dhk.co.kr",
    dept: "IT팀",
  },
  {
    code: "ENG-003",
    name: "소상훈 프로",
    email: "shso@dhk.co.kr",
    dept: "IT팀",
  },
  {
    code: "ENG-004",
    name: "유성재 프로",
    email: "sjyoo@dhk.co.kr",
    dept: "IT팀",
  },
];

const HelpDeskMainContent = ({
  tickets,
  selectedTicket,
  setTickets,
  setSelectedTicket,
  setIsEmailModalOpen,
}) => {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [targetEngineerCode, setTargetEngineerCode] = useState("");
  const Login_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  const handleMarkAsSolution = async (timelineId) => {
    if (
      !window.confirm(
        "이 조치 내역을 '최종 해결 방안'으로 채택하시겠습니까?\n이슈 티켓 상태도 '조치 완료'로 자동 변경됩니다.",
      )
    )
      return;

    try {
      /*
      const request = await Request_Post_Axios(`/HelpDesk/markAsSolution`, {
        ticketId: selectedTicket.id,
        timelineId: timelineId
      });
      if (!request.status) throw new Error("API 연동 실패");
      */

      // 로컬 상태 업데이트 (Optimistic UI)
      const updatedSolutions = selectedTicket.solutions.map((sol) =>
        sol.timelineId === timelineId ? { ...sol, actionType: "해결" } : sol,
      );

      const updatedTicket = {
        ...selectedTicket,
        solutions: updatedSolutions,
        status: "완료", // 티켓 상태 자동 종결
      };

      setTickets(
        tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
      );
      setSelectedTicket(updatedTicket);
    } catch (error) {
      console.error(error);
      alert("해결 방안 지정에 실패했습니다.");
    }
  };

  const handleTransferTicket = async (e) => {
    const selectedCode = e.target.value;
    if (!selectedCode) return;

    const nextEngineer = companyEngineers.find(
      (eng) => eng.code === selectedCode,
    );
    if (!nextEngineer) return;

    if (
      window.confirm(
        `[이슈 소유권 이관]\n이 장애 건을 [${nextEngineer.name} 담당자]에게 인계하시겠습니까?\n확인 즉시 해당 담당자에게 요약 내용이 메일로 유선 전송됩니다.`,
      )
    ) {
      try {
        const request = await Request_Post_Axios("/HelpDesk/transferTicket", {
          ticketId: selectedTicket.id,
          currentEngineerId: selectedTicket.currentEngineerId,
          currentEngineerName: selectedTicket.currentEngineerName,
          currentEngineerPosition: selectedTicket.currentEngineerPosition,
          currentEngineerDepartmentName:
            selectedTicket.currentEngineerDepartmentName,
          selectedTicket,
          nextEngineerEmail: nextEngineer.email,
        });

        if (request.status) {
          const updatedTicket = {
            ...selectedTicket,
            currentEngineer: {
              code: nextEngineer.code,
              name: request.data.fullName,
              email: request.data.writerId,
            },
            solutions: [...selectedTicket.solutions, request.data],
          };

          setTickets(
            tickets.map((t) =>
              t.id === selectedTicket.id ? updatedTicket : t,
            ),
          );
          setSelectedTicket(updatedTicket);
          setTargetEngineerCode(""); // 초기화
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setTargetEngineerCode("");
    }
  };

  const handleAddTimelineLog = async (e) => {
    e.preventDefault();

    const newLog = {
      ...selectedTicket,
      content: content,
      date: moment().format("YYYY-MM-DD HH:mm"),
    };

    const request = await Request_Post_Axios(`/HelpDesk/replyTickets`, {
      newLog,
    });

    console.log(request);
    if (request.status) {
      const updatedTicket = {
        ...selectedTicket,
        solutions: [...selectedTicket.solutions, request.data],
        status:
          selectedTicket.status === "대기중" ? "진행중" : selectedTicket.status,
      };

      setTickets(
        tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
      );
      setSelectedTicket(updatedTicket);
      setContent("");
    }
  };

  const handleCompleteTicket = () => {
    if (
      window.confirm("이 인프라 장애 건을 '조치 완료' 상태로 종결하시겠습니까?")
    ) {
      const updatedTicket = { ...selectedTicket, status: "완료" };
      setTickets(
        tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
      );
      setSelectedTicket(updatedTicket);
    }
  };

  return (
    <RightIssueDetails>
      {selectedTicket ? (
        <>
          <IssueMainHeaderZone>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="issue-scope-meta">
                <span>{selectedTicket.category}</span> ·{" "}
                <span className="date-text">
                  등록일: {selectedTicket.createdAt}
                </span>
              </div>
              <h2 className="issue-main-title">{selectedTicket.title}</h2>

              <CurrentOwnerBadgeBar>
                <div className="owner-meta">
                  <User size={12} />
                  <span>
                    현재 소유 엔지니어:{" "}
                    <strong>
                      {selectedTicket.currentEngineerId
                        ? `${selectedTicket.currentEngineerDepartmentName} ${selectedTicket.currentEngineerName} ${selectedTicket.currentEngineerPosition}`
                        : "미배정"}
                    </strong>{" "}
                  </span>
                </div>
              </CurrentOwnerBadgeBar>
            </div>

            <HeaderActionGroup>
              <ActionBtn onClick={() => setIsEmailModalOpen(true)}>
                <Mail size={13} /> 메일 공유
              </ActionBtn>

              {selectedTicket.status !== "완료" &&
                selectedTicket.currentEngineerId === Login_Info?.id && (
                  <TransferSelectWrapper>
                    <ArrowRightLeft size={13} className="select-icon" />
                    <select
                      value={targetEngineerCode}
                      onChange={handleTransferTicket}
                    >
                      <option value="">담당자 이관 처리...</option>
                      {companyEngineers
                        .filter(
                          (eng) =>
                            eng.email !== selectedTicket.currentEngineerId,
                        )
                        .map((eng) => (
                          <option key={eng.code} value={eng.code}>
                            {eng.name} ({eng.dept})
                          </option>
                        ))}
                    </select>
                  </TransferSelectWrapper>
                )}

              {/* <AssetJumpButton onClick={() => navigate("/hardware")}>
                <Link2 size={13} /> 자산 인벤토리 연결
              </AssetJumpButton> */}
              {selectedTicket.status !== "완료" && (
                <CompleteActionBtn onClick={handleCompleteTicket}>
                  <CheckCircle2 size={13} /> 조치 완료 종결
                </CompleteActionBtn>
              )}
            </HeaderActionGroup>
          </IssueMainHeaderZone>

          <IssueScrollBodyZone>
            <OriginReportCard>
              <div className="report-header">
                <User size={14} className="icon" />
                <span>최초 헬프데스크 장애 내용</span>
              </div>

              <div className="report-body">
                <div
                  dangerouslySetInnerHTML={{
                    __html: selectedTicket.description,
                  }}
                />
              </div>
            </OriginReportCard>

            <PureTimelineContainer>
              {selectedTicket.solutions.length > 0 ? (
                selectedTicket.solutions.map((sol, index) => (
                  <TimelineItemRow key={sol.timelineId}>
                    <TimelineLeftTrack>
                      {/* 이관 로그일 경우 전용 아이콘 처리 분기 */}
                      <TimelineDotBadge
                        isSuccess={sol.actionType === "해결"}
                        isTransfer={sol.actionType === "이관"}
                      >
                        {sol.actionType === "이관" ? (
                          <ArrowRightLeft size={10} />
                        ) : (
                          index + 1
                        )}
                      </TimelineDotBadge>
                      <TimelineVerticalLine />
                    </TimelineLeftTrack>
                    <TimelineRightContent>
                      <TimelineMetaBar>
                        <div className="meta-left">
                          <span className="engineer-name">
                            {sol.engineer === "SYSTEM"
                              ? "⚙️ IT 감사 커널"
                              : `👨‍💻 ${sol.writerId ? `${sol.writerDepartmentName} ${sol.writerName} ${sol.writerPosition}` : "미지정"}`}
                          </span>
                          <span className="action-date">{sol.date}</span>
                        </div>

                        {sol.actionType !== "해결" &&
                          sol.actionType !== "이관" && (
                            <SolutionActionBtn
                              onClick={() =>
                                handleMarkAsSolution(sol.timelineId)
                              }
                            >
                              <CheckCircle2 size={12} /> 해결 방안 채택
                            </SolutionActionBtn>
                          )}
                      </TimelineMetaBar>
                      <TimelineRichText
                        isSuccess={sol.actionType === "해결"}
                        isTransfer={sol.actionType === "이관"}
                        dangerouslySetInnerHTML={{ __html: sol.content }}
                      />
                    </TimelineRightContent>
                  </TimelineItemRow>
                ))
              ) : (
                <></>
              )}
              <TimelineDivider>
                <History size={13} /> 실시간 대응 타임라인 작성
              </TimelineDivider>

              <SharedEditor
                value={content}
                onChange={setContent}
                height="400px"
              />
            </PureTimelineContainer>

            <SubmitLogBtnZone>
              <button className="submit-btn" onClick={handleAddTimelineLog}>
                조치 내역 로그 기록
              </button>
            </SubmitLogBtnZone>
          </IssueScrollBodyZone>
        </>
      ) : (
        <EmptyBufferZone>조회할 이슈 티켓을 선택해 주세요.</EmptyBufferZone>
      )}
    </RightIssueDetails>
  );
};

const AssetJumpButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`;

const CurrentOwnerBadgeBar = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;

  .owner-meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11.5px;
    color: #475569;
    svg {
      color: #2563eb;
    }
    strong {
      color: #0f172a;
      font-weight: 700;
    }
  }
`;

const TransferSelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;

  .select-icon {
    position: absolute;
    left: 10px;
    color: #475569;
    pointer-events: none;
  }

  select {
    padding: 6px 12px 6px 28px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    cursor: pointer;
    outline: none;
    transition: all 0.15s;
    appearance: none;
    padding-right: 24px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 12px;

    &:hover {
      border-color: #2563eb;
      color: #2563eb;
    }
  }
`;

const RightIssueDetails = styled.div`
  flex: 1;
  background: #fff;
  display: flex;
  flex-direction: column;
`;
const IssueMainHeaderZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 32px;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
  .issue-scope-meta {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 600;
    .date-text {
      font-weight: 500;
      color: #94a3b8;
    }
  }
  .issue-main-title {
    font-size: 17px;
    font-weight: 800;
    color: #0f172a;
    margin: 4px 0 0 0;
  }
`;
const HeaderActionGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CompleteActionBtn = styled(AssetJumpButton)`
  background: #10b981;
  border-color: #059669;
  color: #fff;
  &:hover {
    background: #059669;
    color: #fff;
    border-color: #047857;
  }
`;
const IssueScrollBodyZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-x: hidden;
`;
const OriginReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;

  background: #f8fafc;
  .report-header {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: #edf2f7;
    border-bottom: 1px solid #e2e8f0;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    .icon {
      color: #2563eb;
    }
  }
  .report-body {
    padding: 16px;

    /* 🚀 에디터에서 생성된 HTML 태그들이 예쁘게 보이도록 스타일 대응 */
    .html-content {
      font-size: 13.5px;
      color: #2d3748;
      line-height: 1.6;

      p {
        margin: 0 0 8px 0;
      }
      p:last-child {
        margin-bottom: 0;
      }
      ul,
      ol {
        margin: 8px 0;
        padding-left: 20px;
      }
      strong {
        color: #0f172a;
        font-weight: 700;
      }
      img {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
        margin: 8px 0;
      }
    }
  }
`;

const TimelineDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  color: #94a3b8;
  margin: 8px 0;
  &:before,
  &:after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e2e8f0;
  }
`;
const PureTimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 8px;
  box-sizing: border-box;
`;
const TimelineItemRow = styled.div`
  display: grid;
  grid-template-columns: 24px 1fr;
  gap: 16px;
  width: 100%;
`;
const TimelineLeftTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const TimelineDotBadge = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${(props) =>
    props.isSuccess ? "#10b981" : props.isTransfer ? "#eff6ff" : "#f1f5f9"};
  border: 2px solid
    ${(props) =>
      props.isSuccess ? "#059669" : props.isTransfer ? "#2563eb" : "#cbd5e1"};
  font-size: 11px;
  font-weight: 800;
  color: ${(props) =>
    props.isSuccess ? "#fff" : props.isTransfer ? "#2563eb" : "#64748b"};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  margin-top: 2px;
  font-family: monospace;
`;
const TimelineVerticalLine = styled.div`
  width: 2px;
  flex: 1;
  background: #e2e8f0;
  position: absolute;
  top: 22px;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
`;
const TimelineRightContent = styled.div`
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const TimelineMetaBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 양끝 정렬 추가 */
  margin-bottom: 6px;

  .meta-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .engineer-name {
    font-size: 12.5px;
    font-weight: 700;
    color: #1e293b;
  }
  .action-date {
    font-size: 11px;
    color: #94a3b8;
    font-family: monospace;
  }
`;

const SolutionActionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #16a34a;
    color: #fff;
    border-color: #15803d;
  }
`;
const TimelineRichText = styled.div`
  font-size: 13.5px;
  color: #334155;
  line-height: 1.6;
  background: ${(props) =>
    props.isSuccess ? "#f0fdf4" : props.isTransfer ? "#f0f7ff" : "#fff"};
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid
    ${(props) =>
      props.isSuccess ? "#bbf7d0" : props.isTransfer ? "#bfdbfe" : "#e2e8f0"};
  p {
    margin: 0 0 8px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }
  code {
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12.5px;
    color: #0f172a;
  }
  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 12px;
    border-radius: 6px;
    font-family: monospace;
    font-size: 12.5px;
    overflow-x: auto;
    margin: 8px 0;
  }
  em {
    color: #64748b;
    font-style: italic;
  }
`;
const SubmitLogBtnZone = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  .submit-btn {
    padding: 10px 18px;
    background: #2563eb;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #1d4ed8;
    }
  }
`;

const EmptyBufferZone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 600;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: #f8fafc;
  }
`;

export default HelpDeskMainContent;
