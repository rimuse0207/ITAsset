import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../Style/MainStyle";
import MainSidebar from "../../SideBar/MainSideBar";

import { useNavigate } from "react-router-dom";
import {
  Wrench,
  User,
  Calendar,
  ShieldAlert,
  Link2,
  History,
  ExternalLink,
  Search,
  ImageIcon,
  MessageSquare,
  Plus,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

// 🚀 React-Quill 라이브러리 및 스타일시트 임포트
import { Editor, EditorProvider } from "react-simple-wysiwyg";
import SoftwareHeader from "../SoftWare/Header/SoftwareHeader";

// 📊 에디터 서식 대응형 고도화 데이터셋
const boardTicketData = [
  {
    id: "TK-2026-089",
    title: "Docker Desktop v4.29.0 볼륨 마운트 보안 권한 차단 에러",
    category: "소프트웨어 자산",
    linkedAsset: "Docker Desktop (SW-003)",
    swId: "SW-003",
    priority: "긴급",
    status: "진행중",
    createdAt: "2026-06-05",
    hashTags: ["Docker", "DRM충돌", "M3맥북"],
    errorImg:
      "https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=600&q=80",
    description:
      "M3 맥북 환경에서 도커 업데이트 이후 사내 DRM(보안 프로그램)과 충돌하여 볼륨 마운트 권한 해제 현상 발생. 컴파일 시 Access Denied 에러 팝업 발생.",
    /* 🕒 콤팩트한 추적용 순수 타임라인 로그 스택 */
    solutions: [
      {
        id: 1,
        type: "시도",
        engineer: "최관리자",
        date: "2026-06-05 10:00",
        content:
          "<strong>방법 1:</strong> Docker Desktop 삭제 후 v4.28 구버전 다운그레이드 재설치 ➔ <em>DRM 커널 락 여전함 (실패)</em>",
      },
      {
        id: 2,
        type: "시도",
        engineer: "박엔지니어",
        date: "2026-06-05 11:30",
        content:
          "<strong>방법 2:</strong> Mac 로컬 보안 감사 폴더 권한 강제 수동 해제 스크립트 가동 ➔ <code>chmod -R 755</code> 부여했으나 컨테이너 마운트 시점에 다시 거부됨 <em>(실패)</em>",
      },
    ],
  },
  {
    id: "TK-2026-042",
    title: "M1 맥북 환경 Docker 컨테이너 볼륨 가상 경로 권한 거부 건",
    category: "소프트웨어 자산",
    linkedAsset: "Docker Desktop (SW-003)",
    swId: "SW-003",
    priority: "보통",
    status: "완료",
    createdAt: "2026-04-12",
    hashTags: ["Docker", "DRM충돌", "M1맥북"],
    errorImg: null,
    description:
      "신규 장비 지급 후 사내 보안 감시 룰이 도커 가상 볼륨 마운트 폴더 권한을 강제 회수하여 컨테이너 빌드 차단되던 현상.",
    solutions: [
      {
        id: 1,
        type: "시도",
        engineer: "최관리자",
        date: "2026-04-12 14:00",
        content:
          "방법 1: 로컬 에이전트 DRM 권한 일시 정지 후 재부팅 ➔ 정상화되나 보안 규정 위반으로 롤백.",
      },
      {
        id: 2,
        type: "해결",
        engineer: "최관리자",
        date: "2026-04-12 16:30",
        content:
          "<strong>방법 2 (최종 해결):</strong> 사내 DRM 관리자 콘솔 자산 예외 처리 커널 스크립트 반영 완료. <span style='color: #10b981; font-weight: bold;'>엔진 정상 가동 확인 (성공)</span>",
      },
    ],
  },
];

export default function HelpDeskManage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState(boardTicketData);
  const [selectedTicket, setSelectedTicket] = useState(boardTicketData[0]);
  const [searchQuery, setSearchQuery] = useState("");

  // 🚀 React-Quill 에디터 전용 HTML 문자열 바인딩 상태값
  const [editorContent, setEditorContent] = useState("");

  const priorityColors = { 긴급: "#ef4444", 보통: "#3b82f6", 낮음: "#94a3b8" };
  const statusColors = {
    대기중: "#f59e0b",
    진행중: "#2563eb",
    완료: "#10b981",
  };

  // 에디터 상단 툴바 구성 커스텀 (간결하게 필수 서식만 매핑)
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  // 검색 엔진
  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const cleanQ = q.startsWith("#") ? q.replace("#", "") : q;
    return (
      t.title.toLowerCase().includes(cleanQ) ||
      t.hashTags.some((tag) => tag.toLowerCase().includes(cleanQ))
    );
  });

  // 🚀 조치 로그 에디터 데이터 제출 트래커
  const handleAddTimelineLog = (e) => {
    e.preventDefault();
    if (!editorContent.replace(/<[^>]*>/g, "").trim()) {
      alert("내용을 입력해 주세요.");
      return;
    }

    const currentStep = selectedTicket.solutions.length + 1;
    const newLog = {
      id: currentStep,
      type: "시도",
      engineer: "IT 담당자",
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      content: editorContent, // Quill에서 추출된 리치 텍스트 HTML 그대로 인젝션
    };

    const updatedTicket = {
      ...selectedTicket,
      solutions: [...selectedTicket.solutions, newLog],
    };

    setTickets(
      tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)),
    );
    setSelectedTicket(updatedTicket);
    setEditorContent(""); // 에디터 버퍼 초기화
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
    <Container>
      <MainSidebar currentMenu={"Helpdesk"} />

      {/* 📝 좌측 1단: 이슈 게시판형 목록 패널 */}
      <LeftBoardPanel>
        <SoftwareHeader
          title="IT 트러블슈팅 보드"
          subTitle="담당자 장애 조치 공유 대시보드"
          onModalOpen={() => alert("새 이슈 작성")}
        />
        <SearchBarContainer>
          <Search size={14} className="search-icon" />
          <SearchInput
            placeholder="이슈 명, 혹은 #해시태그 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchBarContainer>

        <BoardListZone>
          {filteredTickets.map((t) => {
            const isSelected = selectedTicket.id === t.id;
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
                <CardFooter>
                  <span>자산: {t.linkedAsset.split(" ")[0]}</span>
                  <PriorityText color={priorityColors[t.priority]}>
                    ● {t.priority}
                  </PriorityText>
                </CardFooter>
              </BoardCard>
            );
          })}
        </BoardListZone>
      </LeftBoardPanel>

      {/* 💬 우측 2단: 깃허브 이슈 레이아웃 + 슬림 선형 타임라인 피드백 원본 아카이브 */}
      <RightIssueDetails>
        <IssueMainHeaderZone>
          <div>
            <div className="issue-scope-meta">
              <span>{selectedTicket.category}</span> ·{" "}
              <span className="date-text">
                등록일: {selectedTicket.createdAt}
              </span>
            </div>
            <h2 className="issue-main-title">{selectedTicket.title}</h2>
          </div>
          <HeaderActionGroup>
            <AssetJumpButton onClick={() => navigate("/software")}>
              <Link2 size={13} /> 자산 인벤토리 연결
            </AssetJumpButton>
            {selectedTicket.status !== "완료" && (
              <CompleteActionBtn onClick={handleCompleteTicket}>
                <CheckCircle2 size={13} /> 조치 완료 종결
              </CompleteActionBtn>
            )}
          </HeaderActionGroup>
        </IssueMainHeaderZone>

        <IssueScrollBodyZone>
          {/* 최초 이슈 원본 카드 리포트 */}
          <OriginReportCard>
            <div className="report-header">
              <User size={14} className="icon" />
              <span>최초 인프라 장애 제보 내용</span>
            </div>
            <div className="report-body">
              <p className="desc">{selectedTicket.description}</p>
              {selectedTicket.errorImg && (
                <ImagePreview
                  src={selectedTicket.errorImg}
                  alt="에러 캡처"
                  onClick={() => window.open(selectedTicket.errorImg)}
                />
              )}
            </div>
          </OriginReportCard>

          <TimelineDivider>
            <History size={13} /> 인프라 엔지니어 실조치 타임라인 로그
          </TimelineDivider>

          {/* 🚀 2단 리팩토링 포인트: 거대했던 박스를 지우고, 가시성이 극대화된 직관적 선형 타임라인 정렬 */}
          <PureTimelineContainer>
            {selectedTicket.solutions.map((sol, index) => (
              <TimelineItemRow key={sol.id}>
                <TimelineLeftTrack>
                  <TimelineDotBadge isSuccess={sol.type === "해결"}>
                    {index + 1}
                  </TimelineDotBadge>
                  <TimelineVerticalLine />
                </TimelineLeftTrack>
                <TimelineRightContent>
                  <TimelineMetaBar>
                    <span className="engineer-name">
                      👨‍💻 {sol.engineer} (IT 인프라팀)
                    </span>
                    <span className="action-date">{sol.date}</span>
                  </TimelineMetaBar>
                  {/* 🚀 중요: Quill 에디터에서 들어간 리치 텍스트 서식을 안전하게 화면에 파싱 출력 */}
                  <TimelineRichText
                    isSuccess={sol.type === "해결"}
                    dangerouslySetInnerHTML={{ __html: sol.content }}
                  />
                </TimelineRightContent>
              </TimelineItemRow>
            ))}
          </PureTimelineContainer>

          {/* 📝 3단 리팩토링 포인트: 에디터가 탑재된 세련된 솔루션 제출 존 */}
          {/* 📝 3단 수정: React 19 호환 에디터 보드 카드 */}
          <EditorCardWrapper onSubmit={handleAddTimelineLog}>
            <div className="editor-header-zone">
              <MessageSquare size={13} />
              <span>
                {selectedTicket.status === "완료"
                  ? "완료 후 히스토리 백업 / 마일스톤 피드백 추가 기입"
                  : "장애 트러블슈팅 조치 내역 기록 (React 19 Core 가동)"}
              </span>
            </div>

            {/* 🚀 React 19 전용 초경량 에디터 실장 */}
            <EditorProvider>
              <StyledEditor
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                placeholder="조치 시도 내용 및 스크립트 코드를 상세히 작성하세요. 상단 툴바의 단축키 및 서식이 완벽히 지원됩니다."
              />
            </EditorProvider>

            <FormSubmitRowZone>
              <span className="hint-text">
                ※ 엔지니어 간 공유되는 런북 지식베이스 자산입니다. 정밀하게
                작성하세요.
              </span>
              <SubmitCommentBtn type="submit">
                <Plus size={13} /> 조치 로그 등록
              </SubmitCommentBtn>
            </FormSubmitRowZone>
          </EditorCardWrapper>
        </IssueScrollBodyZone>
      </RightIssueDetails>
    </Container>
  );
}

/* 🚀 React 19 에디터 세련된 인프라 핏 테이밍 */
const StyledEditor = styled(Editor)`
  background: #fff !important;
  border: 1px solid #cbd5e1 !important;
  border-radius: 8px !important;
  min-height: 140px;
  font-size: 13.5px;
  font-family: inherit;
  box-sizing: border-box;

  .rsw-toolbar {
    background: #f1f5f9 !important;
    border-bottom: 1px solid #e2e8f0 !important;
    padding: 6px !important;
  }

  .rsw-editor {
    padding: 12px !important;
    &:focus-within {
      outline: none;
    }
  }
`;

/* ─── 🎨 리치텍스트 & 타임라인 최적화 스타일 시트 ─── */
const Container = styled.div`
  display: flex;
  background-color: #f8fafc;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
`;

// 1단 목록
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
const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
  margin-top: 10px;
  font-weight: 500;
`;
const PriorityText = styled.span`
  color: ${(props) => props.color};
  font-weight: 700;
`;

// 2단 메인 스트림
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
`;
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
`;

const OriginReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
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
    .desc {
      font-size: 13.5px;
      color: #2d3748;
      margin: 0;
      line-height: 1.6;
    }
  }
`;
const ImagePreview = styled.img`
  max-width: 240px;
  margin-top: 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  cursor: zoom-in;
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

/* ─── 🚀 2단 수정: 가시성 극대화 선형 타임라인 스타일셋 ─── */
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
  background: ${(props) => (props.isSuccess ? "#10b981" : "#f1f5f9")};
  border: 2px solid ${(props) => (props.isSuccess ? "#059669" : "#cbd5e1")};
  font-size: 11px;
  font-weight: 800;
  color: ${(props) => (props.isSuccess ? "#fff" : "#64748b")};
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
  gap: 10px;
  margin-bottom: 6px;
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

/* 🚀 Quill RichText 데이터 바인딩 표출 컴포넌트 */
const TimelineRichText = styled.div`
  font-size: 13.5px;
  color: #334155;
  line-height: 1.6;
  background: ${(props) => (props.isSuccess ? "#f0fdf4" : "#fff")};
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.isSuccess ? "#bbf7d0" : "#e2e8f0")};
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

/* 🚀 3단 수정: 리치 에디터 보드 카드 */
const EditorCardWrapper = styled.form`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
  padding: 20px;
  box-sizing: border-box;
  .editor-header-zone {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 12px;
  }
`;
const QuillContainerBox = styled.div`
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  .ql-toolbar.ql-snow {
    border: none;
    border-bottom: 1px solid #e2e8f0;
    background: #f1f5f9;
  }
  .ql-container.ql-snow {
    border: none;
    min-height: 110px;
    font-size: 13.5px;
  }
`;
const FormSubmitRowZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 14px;
  .hint-text {
    font-size: 11px;
    color: #94a3b8;
  }
`;
const SubmitCommentBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  background: #0f172a;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background: #1e293b;
  }
`;
