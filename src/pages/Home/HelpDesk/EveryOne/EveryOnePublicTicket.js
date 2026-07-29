import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  CheckCircle2,
  Calendar,
  Clock,
  Monitor,
  AlertCircle,
  CheckSquare,
} from "lucide-react";
import { useSearchParams } from "react-router-dom"; // 파라미터 대신 쿼리스트링 사용
import { Request_Get_Axios } from "../../../../API";

export default function EveryOnePublicTicket() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      alert("잘못된 접근입니다.");
      return;
    }

    const fetchTicket = async () => {
      try {
        // 토큰만 서버로 전송 (티켓 아이디를 클라이언트가 직접 넘기지 않음)
        const response = await Request_Get_Axios(
          `/HelpDesk/getPublicTicketDetail?token=${token}`,
        );
        console.log(response);
        setTicketData(response.data);
        setIsLoading(false);
      } catch (error) {
        alert("보안 정책에 의해 차단되었거나 만료된 링크입니다.");
      }
    };

    fetchTicket();
  }, [token]);

  // useEffect(() => {
  //   // 🌐 실제 구현 시: 비로그인 토큰 검증 및 티켓 단건 조회 API 호출
  //   // const fetchTicket = async () => {
  //   //   const res = await axios.get(`/api/public/ticket/${ticketId}`);
  //   //   setTicketData(res.data);
  //   // };
  //   // fetchTicket();

  //   // 임시 목업 데이터 (테스트용)
  //   setTimeout(() => {
  //     setTicketData({
  //       id: "TK-2026-042",
  //       title: "M1 맥북 환경 Docker 컨테이너 볼륨 가상 경로 권한 거부 건",
  //       category: "소프트웨어 자산",
  //       linkedAsset: "Docker Desktop (SW-003)",
  //       status: "완료",
  //       createdAt: "2026-04-12 09:30",
  //       description:
  //         "<p>신규 장비 지급 후 사내 보안 감시 룰이 도커 가상 볼륨 마운트 폴더 권한을 강제 회수하여 컨테이너 빌드 차단되던 현상.</p><p>빌드 시 지속적으로 Access Denied가 발생합니다.</p>",
  //       solutions: [
  //         {
  //           id: 1,
  //           type: "시도",
  //           engineer: "최관리자",
  //           date: "2026-04-12 14:00",
  //           content: "로컬 에이전트 DRM 권한 일시 정지 후 재부팅 테스트 진행.",
  //         },
  //         {
  //           id: 2,
  //           actionType: "해결",
  //           engineer: "최관리자",
  //           date: "2026-04-12 16:30",
  //           content:
  //             "<strong>최종 해결:</strong> 사내 DRM 관리자 콘솔 자산 예외 처리 커널 스크립트 반영 완료. <br/>엔진 정상 가동 확인 및 모니터링 종료합니다.",
  //         },
  //       ],
  //     });
  //     setIsLoading(false);
  //   }, 500);
  // }, []);

  if (isLoading) {
    return <LoadingScreen>티켓 정보를 불러오는 중입니다...</LoadingScreen>;
  }

  if (!ticketData) {
    return (
      <ErrorScreen>존재하지 않거나 접근 권한이 없는 링크입니다.</ErrorScreen>
    );
  }

  // 🚀 핵심 로직: 솔루션 배열에서 '해결'로 마킹된 최종 코멘트만 추출
  const finalSolution = ticketData.solutions.find(
    (sol) => sol.actionType === "해결",
  );

  return (
    <PublicContainer>
      <ReportWrapper>
        {/* 상단 브랜딩 / 헤더 구역 */}
        <ReportHeader>
          <div className="brand-logo">DHK Solution Helpdesk</div>
          <StatusBadge
            className={ticketData.status === "완료" ? "resolved" : "pending"}
          >
            {ticketData.status === "완료" ? (
              <CheckCircle2 size={14} />
            ) : (
              <AlertCircle size={14} />
            )}
            {ticketData.status === "완료" ? "조치 완료" : "처리 진행 중"}
          </StatusBadge>
        </ReportHeader>

        {/* 타이틀 및 메타 정보 구역 */}
        <TitleSection>
          <div className="ticket-id">{ticketData.id}</div>
          <h1 className="ticket-title">{ticketData.title}</h1>

          <MetaGrid>
            <MetaItem>
              <Calendar size={15} className="icon" />
              <div className="meta-text">
                <span className="label">등록일시</span>
                <span className="value">{ticketData.createdAt}</span>
              </div>
            </MetaItem>
            <MetaItem>
              <Clock size={15} className="icon" />
              <div className="meta-text">
                <span className="label">해결일시</span>
                <span className="value resolve-date">
                  {finalSolution ? finalSolution.date : "미해결"}
                </span>
              </div>
            </MetaItem>
            <MetaItem>
              <Monitor size={15} className="icon" />
              <div className="meta-text">
                <span className="label">관련 자산</span>
                <span className="value">{ticketData.linkedAsset}</span>
              </div>
            </MetaItem>
          </MetaGrid>
        </TitleSection>

        <Divider />

        {/* 1. 최초 접수 내용 구역 */}
        <ContentSection>
          <SectionTitle>
            <AlertCircle size={16} /> 접수된 장애 상세 내용
          </SectionTitle>
          <RichTextContainer
            dangerouslySetInnerHTML={{ __html: ticketData.description }}
          />
        </ContentSection>

        {/* 2. 최종 해결 결과 구역 (해결 데이터가 있을 때만 노출) */}
        {finalSolution && (
          <SolutionSection>
            <SectionTitle className="success-title">
              <CheckSquare size={16} /> 최종 조치 결과 및 코멘트
            </SectionTitle>
            <SolutionBox>
              <div className="solution-meta">
                <span>
                  담당 엔지니어: <strong>{finalSolution.engineer}</strong>
                </span>
                <span>처리일시: {finalSolution.date}</span>
              </div>
              <RichTextContainer
                className="solution-html"
                dangerouslySetInnerHTML={{ __html: finalSolution.content }}
              />
            </SolutionBox>
          </SolutionSection>
        )}

        <ReportFooter>
          본 문서는 DHK Solution IT 서비스 데스크에서 자동 발송된 공식 조치
          리포트입니다.
          <br />
          추가 문의 사항이 있으신 경우 사내 인프라팀으로 연락 바랍니다.
        </ReportFooter>
      </ReportWrapper>
    </PublicContainer>
  );
}

/* ─── 🎨 스타일 컴포넌트 (비로그인 전용 깔끔한 리포트 뷰) ─── */

const PublicContainer = styled.div`
  min-height: 100vh;
  background-color: #f1f5f9;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
  font-family: "Pretendard", sans-serif;
`;

const ReportWrapper = styled.div`
  width: 100%;
  max-width: 760px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 32px;
  background: #0f172a;
  color: #fff;

  .brand-logo {
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;

  &.resolved {
    background: #059669;
    color: #fff;
  }
  &.pending {
    background: #f59e0b;
    color: #fff;
  }
`;

const TitleSection = styled.div`
  padding: 32px;

  .ticket-id {
    font-size: 13px;
    font-weight: 700;
    color: #64748b;
    margin-bottom: 8px;
    font-family: monospace;
  }

  .ticket-title {
    font-size: 22px;
    font-weight: 800;
    color: #1e293b;
    margin: 0 0 24px 0;
    line-height: 1.4;
  }
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .icon {
    color: #94a3b8;
  }

  .meta-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }

  .value {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
  }

  .resolve-date {
    color: #059669;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 0 32px;
`;

const ContentSection = styled.div`
  padding: 32px;
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #334155;
  margin: 0 0 16px 0;

  &.success-title {
    color: #059669;
  }
`;

const SolutionSection = styled.div`
  padding: 0 32px 32px 32px;
`;

const SolutionBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 20px;

  .solution-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #166534;
    margin-bottom: 12px;
    padding-bottom: 12px;
    border-bottom: 1px dashed #bbf7d0;
  }

  .solution-html {
    color: #14532d;
  }
`;

const RichTextContainer = styled.div`
  font-size: 14px;
  line-height: 1.7;
  color: #334155;

  p {
    margin: 0 0 10px 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
  strong {
    font-weight: 700;
    color: #0f172a;
  }
  ul,
  ol {
    margin: 10px 0;
    padding-left: 24px;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 10px 0;
  }
`;

const ReportFooter = styled.div`
  background: #f8fafc;
  padding: 20px 32px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  border-top: 1px solid #e2e8f0;
  line-height: 1.6;
`;

const LoadingScreen = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #64748b;
  background: #f1f5f9;
`;

const ErrorScreen = styled(LoadingScreen)`
  color: #ef4444;
  font-weight: 600;
`;
