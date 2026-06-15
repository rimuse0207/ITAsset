import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  Package,
  Layers,
  Download,
  Key,
  ShieldCheck,
  ShieldAlert,
  User,
  Search,
  Filter,
  Plus,
  ChevronRight,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

// 🎨 글로벌 디자인 시스템 테마 (전체 프로젝트 일관성 유지)
const theme = {
  colors: {
    bg: "#f8fafc",
    white: "#ffffff",
    textMain: "#0f172a",
    textSub: "#475569",
    textMuted: "#94a3b8",
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    primaryLight: "#eff6ff",
    border: "#e2e8f0",
    borderLight: "#f1f5f9",
    success: "#10b981",
    successBg: "#ecfdf4",
    error: "#ef4444",
    errorBg: "#fef2f2",
  },
  shadows: {
    soft: "0 4px 20px -2px rgba(148, 163, 184, 0.12), 0 2px 8px -1px rgba(148, 163, 184, 0.08)",
    card: "0 2px 12px rgba(15, 23, 42, 0.03)",
  },
};

export default function SoftwareManagement() {
  // 💾 고도화된 소프트웨어 인벤토리 Mock 데이터
  const [softwareList] = useState([
    {
      id: "SW-001",
      name: "Microsoft 365 Apps",
      vendor: "Microsoft",
      category: "오피스/생산성",
      totalLicenses: 150,
      usedLicenses: 124,
      versions: [
        {
          versionStr: "v16.0.17 (최신)",
          releaseDate: "2026-03-01",
          fileName: "m365_installer_x64.pkg",
          licenseKey: "AAAAA-BBBBB-CCCCC-DDDDD-EEEEE",
          users: [
            {
              name: "홍길동",
              dept: "개발본부",
              assetId: "AST-2026-001",
              assignedDate: "2025-03-12",
            },
            {
              name: "김철수",
              dept: "인사팀",
              assetId: "AST-2026-045",
              assignedDate: "2025-06-19",
            },
          ],
        },
        {
          versionStr: "v16.0.15",
          releaseDate: "2025-11-10",
          fileName: "m365_installer_legacy.pkg",
          licenseKey: "MS365-OLD-KEY-12345-VALID",
          users: [
            {
              name: "이영희",
              dept: "디자인팀",
              assetId: "AST-2025-112",
              assignedDate: "2025-11-15",
            },
          ],
        },
      ],
    },
    {
      id: "SW-002",
      name: "Adobe Creative Cloud",
      vendor: "Adobe",
      category: "그래픽/디자인",
      totalLicenses: 30,
      usedLicenses: 28,
      versions: [
        {
          versionStr: "v2026.2 (최신)",
          releaseDate: "2026-04-15",
          fileName: "AdobeCC_Desktop_Signed.dmg",
          licenseKey: "ADOBE-CC-ENTERPRISE-KEY-9999X",
          users: [
            {
              name: "박민수",
              dept: "마케팅팀",
              assetId: "AST-2026-088",
              assignedDate: "2026-04-20",
            },
          ],
        },
      ],
    },
    {
      id: "SW-003",
      name: "Docker Desktop",
      vendor: "Docker Inc.",
      category: "개발도구",
      totalLicenses: 50,
      usedLicenses: 52, // 라이선스 초과 상태 유도
      versions: [
        {
          versionStr: "v4.29.0",
          releaseDate: "2026-05-10",
          fileName: "docker-desktop-4.29.0.dmg",
          licenseKey: "DOCKER-BIZ-SUBSCRIPTION-TOKEN-SECRET",
          users: [
            {
              name: "최테크",
              dept: "인프라팀",
              assetId: "AST-2026-003",
              assignedDate: "2026-05-12",
            },
          ],
        },
      ],
    },
  ]);

  // 🧭 UI 상태 제어
  const [selectedSW, setSelectedSW] = useState(softwareList[0]); // 1단: 선택된 소프트웨어
  const [selectedVersion, setSelectedVersion] = useState(
    softwareList[0].versions[0],
  ); // 2단: 선택된 버전
  const [isKeyUnlocked, setIsKeyUnlocked] = useState(false); // 3단: 패스워드 인증 성공 여부
  const [showRawKey, setShowRawKey] = useState(false); // 라이선스 키 숨김/눈표시 토글

  // 다른 소프트웨어 클릭 시 버전을 첫 번째 요소로 안전하게 리셋해주는 동적 유도 장치
  const handleSWSelect = (sw) => {
    setSelectedSW(sw);
    setSelectedVersion(sw.versions[0]);
    setIsKeyUnlocked(false);
    setShowRawKey(false);
  };

  // 가상 보안 비밀번호 인증 프로시저
  const handleVerifySecurity = () => {
    const password = prompt(
      "보안 자산 접근을 위해 IT 최고 관리자 인증 비밀번호를 입력하세요:",
    );
    if (password === "admin") {
      // 가상 패스워드 검증
      setIsKeyUnlocked(true);
    } else {
      alert(
        "보안 인증에 실패했습니다. 올바른 사내 관리 권한 비밀번호를 입력하세요.",
      );
    }
  };

  return (
    <Container>
      {/* 1️⃣ 좌측 단 (Column 1): 사내 전체 소프트웨어 마스터 리스트 */}
      <LeftPanel>
        <PanelHeader>
          <div>
            <PanelTitle>S/W 인벤토리</PanelTitle>
            <PanelSubtitle>보유 소프트웨어 자산 내역</PanelSubtitle>
          </div>
          <IconButton>
            <Plus size={16} />
          </IconButton>
        </PanelHeader>

        <SearchBarWrapper>
          <Search size={16} className="search-icon" />
          <SearchInput placeholder="S/W 명, 제조사 검색..." />
        </SearchBarWrapper>

        <SoftwareScrollZone>
          {softwareList.map((sw) => {
            const isSelected = selectedSW.id === sw.id;
            const isOverused = sw.usedLicenses > sw.totalLicenses; // 라이선스 초과 알림 판단
            return (
              <SoftwareCard
                key={sw.id}
                isSelected={isSelected}
                onClick={() => handleSWSelect(sw)}
              >
                <CardTop>
                  <div className="sw-identity">
                    <Package size={16} className="sw-icon" />
                    <span className="sw-name">{sw.name}</span>
                  </div>
                  <ChevronRight size={16} className="arrow-icon" />
                </CardTop>
                <CardMeta>
                  {sw.vendor} · {sw.category}
                </CardMeta>

                <LicenseProgressZone>
                  <div className="progress-labels">
                    <span>라이선스 사용 현황</span>
                    <span className={isOverused ? "over" : ""}>
                      {sw.usedLicenses} / {sw.totalLicenses} Copy
                    </span>
                  </div>
                  <ProgressBar>
                    <ProgressFill
                      percent={(sw.usedLicenses / sw.totalLicenses) * 100}
                      isOver={isOverused}
                    />
                  </ProgressBar>
                </LicenseProgressZone>
              </SoftwareCard>
            );
          })}
        </SoftwareScrollZone>
      </LeftPanel>

      {/* 2️⃣ 중간 단 (Column 2): 선택된 S/W의 배포 릴리즈 버전 리스트 */}
      <MiddlePanel>
        <PanelHeader>
          <div>
            <PanelTitle>배포 버전 아카이브</PanelTitle>
            <PanelSubtitle>{selectedSW.name} 의 릴리즈 내역</PanelSubtitle>
          </div>
        </PanelHeader>

        <VersionListZone>
          {selectedSW.versions.map((ver, idx) => {
            const isVerSelected = selectedVersion.versionStr === ver.versionStr;
            return (
              <VersionRow
                key={idx}
                isSelected={isVerSelected}
                onClick={() => {
                  setSelectedVersion(ver);
                  setIsKeyUnlocked(false);
                  setShowRawKey(false);
                }}
              >
                <div>
                  <div className="ver-string">{ver.versionStr}</div>
                  <div className="ver-date">릴리즈 일자: {ver.releaseDate}</div>
                </div>
                <div className="ver-badge">배포판</div>
              </VersionRow>
            );
          })}
        </VersionListZone>
      </MiddlePanel>

      {/* 3️⃣ 우측 단 (Column 3): 파일 다운로드 및 권한 인증 라이선스 키 + 실사용자 매핑 뷰 */}
      <RightPanel>
        <PanelHeader className="border-bottom">
          <div>
            <PanelTitle style={{ color: theme.colors.primary }}>
              {selectedSW.name} [{selectedVersion.versionStr}]
            </PanelTitle>
            <PanelSubtitle>
              인프라 배포 파일 인계 및 실사용 임직원 매핑 매트릭스
            </PanelSubtitle>
          </div>
        </PanelHeader>

        <DetailScrollZone>
          {/* 하위 파트 1: 설치 파일 다운로드 게이트웨이 */}
          <SectionBlock>
            <SectionTitle>
              <Download size={15} /> 인프라 설치 바이너리 다운로드
            </SectionTitle>
            <DownloadBox
              href="#download"
              onClick={(e) => {
                e.preventDefault();
                alert(`${selectedVersion.fileName} 다운로드를 시작합니다.`);
              }}
            >
              <div className="file-info">
                <Layers size={18} className="file-icon" />
                <div>
                  <div className="file-name">{selectedVersion.fileName}</div>
                  <div className="file-meta">
                    사내 내부망 전용 초고속 배포팩 · 배포 패치 완료
                  </div>
                </div>
              </div>
              <DownloadButton>
                <Download size={14} /> 다운로드
              </DownloadButton>
            </DownloadBox>
          </SectionBlock>

          {/* 하위 파트 2: 중요★ 자산 라이선스 인증 마스크 제어 영역 */}
          <SectionBlock>
            <SectionTitle>
              <Key size={15} /> 볼륨 라이선스 인증 키 관리
            </SectionTitle>
            {!isKeyUnlocked ? (
              <SecurityMaskCard>
                <Lock size={22} className="lock-icon" />
                <div className="mask-title">보안 접근 제한 구역</div>
                <div className="mask-desc">
                  해당 제품 키 조회 시 IT 자산 감사 시스템에 로그가 기록됩니다.
                </div>
                <VerifyButton type="button" onClick={handleVerifySecurity}>
                  <ShieldCheck size={14} /> 관리자 패스워드 인증인증 (Hint:
                  admin)
                </VerifyButton>
              </SecurityMaskCard>
            ) : (
              <KeyDisplayCard>
                <div className="key-header">
                  <span className="success-tag">
                    <CheckCircle2 size={12} /> 감사 로그 기록됨 (인증 완료)
                  </span>
                  <HideToggleButton onClick={() => setShowRawKey(!showRawKey)}>
                    {showRawKey ? (
                      <>
                        <EyeOff size={13} /> 키 숨기기
                      </>
                    ) : (
                      <>
                        <Eye size={13} /> 제품키 보기
                      </>
                    )}
                  </HideToggleButton>
                </div>
                <KeyValueBox>
                  {showRawKey
                    ? selectedVersion.licenseKey
                    : "••••• - ••••• - ••••• - ••••• - •••••"}
                </KeyValueBox>
              </KeyDisplayCard>
            )}
          </SectionBlock>

          {/* 하위 파트 3: 실사용 임직원 리스트 테이블 매핑 매트릭스 */}
          <SectionBlock style={{ marginBottom: 0 }}>
            <SectionTitle>
              <User size={15} /> 현재 실사용 임직원 인벤토리 (
              {selectedVersion.users.length}명 할당됨)
            </SectionTitle>
            <UserTableContainer>
              <UserTable>
                <thead>
                  <tr>
                    <th>실사용자</th>
                    <th>소속 부서</th>
                    <th>지급 자산 코드</th>
                    <th>소프트웨어 할당일</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedVersion.users.map((user, uIdx) => (
                    <tr key={uIdx}>
                      <td className="user-name">
                        <User size={12} className="table-u-icon" /> {user.name}
                      </td>
                      <td>{user.dept}</td>
                      <td className="asset-code">{user.assetId}</td>
                      <td>{user.assignedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </UserTable>
            </UserTableContainer>
          </SectionBlock>
        </DetailScrollZone>
      </RightPanel>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  background-color: ${() => theme.colors.bg};
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-family: sans-serif;
`;

const PanelHeader = styled.div`
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &.border-bottom {
    border-bottom: 1px solid ${() => theme.colors.borderLight};
  }
`;
const PanelTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  margin: 0;
`;
const PanelSubtitle = styled.p`
  font-size: 12px;
  color: ${() => theme.colors.textMuted};
  margin-top: 2px;
`;
const IconButton = styled.button`
  background: ${() => theme.colors.white};
  border: 1px solid ${() => theme.colors.border};
  padding: 6px;
  border-radius: 8px;
  cursor: pointer;
  color: ${() => theme.colors.textSub};
`;

/* ─── 1단 분할 (좌측): S/W 인덱스 목록 스타일 ─── */
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
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
    background: #fff;
  }
`;

const SoftwareScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
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
  &:hover {
    transform: translateY(-2px);
    border-color: ${() => theme.colors.primary};
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
  .arrow-icon {
    color: ${() => theme.colors.textMuted};
  }
`;
const CardMeta = styled.p`
  font-size: 11px;
  color: ${() => theme.colors.textMuted};
  font-weight: 500;
  margin-top: 4px;
  padding-left: 24px;
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

/* ─── 2단 분할 (중간): 릴리즈 아카이브 스타일 ─── */
const MiddlePanel = styled.div`
  width: 280px;
  border-right: 1px solid ${() => theme.colors.border};
  background: #fff;
  display: flex;
  flex-direction: column;
`;
const VersionListZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const VersionRow = styled.div`
  padding: 14px 16px;
  border: 1px solid
    ${(props) => (props.isSelected ? theme.colors.primary : "transparent")};
  background: ${(props) =>
    props.isSelected ? theme.colors.primaryLight : theme.colors.bg};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.15s;

  .ver-string {
    font-size: 13px;
    font-weight: 700;
    color: ${(props) =>
      props.isSelected ? theme.colors.primary : theme.colors.textMain};
  }
  .ver-date {
    font-size: 11px;
    color: ${() => theme.colors.textMuted};
    margin-top: 2px;
  }
  .ver-badge {
    font-size: 10px;
    font-weight: 700;
    color: ${() => theme.colors.textMuted};
    border: 1px solid ${() => theme.colors.border};
    padding: 1px 6px;
    border-radius: 4px;
    background: #fff;
  }
`;

/* ─── 3단 분할 (우측): 메인 상세 기술지원 존 스타일 ─── */
const RightPanel = styled.div`
  flex: 1;
  background: ${() => theme.colors.white};
  display: flex;
  flex-direction: column;
`;
const DetailScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
`;
const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

/* 📦 다운로드 카드 */
const DownloadBox = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px dashed ${() => theme.colors.primary};
  border-radius: 12px;
  background: ${() => theme.colors.primaryLight};
  text-decoration: none;
  transition: transform 0.2s;
  &:hover {
    transform: scale(1.005);
  }
  .file-info {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .file-icon {
    color: ${() => theme.colors.primary};
  }
  .file-name {
    font-size: 14px;
    font-weight: 700;
    color: ${() => theme.colors.primary};
  }
  .file-meta {
    font-size: 12px;
    color: ${() => theme.colors.textSub};
    margin-top: 2px;
  }
`;
const DownloadButton = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${() => theme.colors.primary};
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
`;

/* 🔒 보안 인증 마스크 카드 */
const SecurityMaskCard = styled.div`
  background: ${() => theme.colors.bg};
  border: 1px solid ${() => theme.colors.border};
  border-radius: 14px;
  padding: 32px;
  text-align: center;
  .lock-icon {
    color: ${() => theme.colors.textMuted};
    margin-bottom: 8px;
  }
  .mask-title {
    font-size: 14px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
  }
  .mask-desc {
    font-size: 12px;
    color: ${() => theme.colors.textMuted};
    margin: 4px 0 16px 0;
  }
`;
const VerifyButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: none;
  background: ${() => theme.colors.textMain};
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  &:hover {
    background: #000;
  }
`;

/* 🔓 마스크 해제 후 제품 키 박스 */
const KeyDisplayCard = styled.div`
  border: 1px solid ${() => theme.colors.success};
  border-radius: 14px;
  padding: 18px;
  background: ${() => theme.colors.successBg};
  .key-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .success-tag {
    font-size: 11px;
    font-weight: 700;
    color: ${() => theme.colors.success};
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;
const HideToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 600;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
`;
const KeyValueBox = styled.div`
  margin-top: 12px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 8px;
  padding: 12px;
  font-family: monospace;
  font-size: 15px;
  font-weight: 700;
  text-align: center;
  color: ${() => theme.colors.textMain};
  letter-spacing: 0.05em;
`;

/* 👥 실사용자 테이블 매트릭스 */
const UserTableContainer = styled.div`
  border: 1px solid ${() => theme.colors.borderLight};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${() => theme.shadows.card};
`;
const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  th {
    background: ${() => theme.colors.bg};
    padding: 12px 16px;
    font-size: 12px;
    font-weight: 600;
    color: ${() => theme.colors.textSub};
    border-bottom: 1px solid ${() => theme.colors.borderLight};
  }
  tr {
    border-bottom: 1px solid ${() => theme.colors.borderLight};
    &:last-child {
      border-bottom: none;
    }
  }
  td {
    padding: 14px 16px;
    font-size: 13px;
    color: ${() => theme.colors.textSub};
    .table-u-icon {
      color: ${() => theme.colors.textMuted};
      vertical-align: middle;
      margin-right: 4px;
    }
  }
  .user-name {
    font-weight: 600;
    color: ${() => theme.colors.textMain};
  }
  .asset-code {
    font-family: monospace;
    font-weight: 700;
    color: ${() => theme.colors.primary};
    font-size: 12px;
  }
`;
