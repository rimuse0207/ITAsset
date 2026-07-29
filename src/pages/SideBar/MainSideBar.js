import React from "react";
import styled from "styled-components";
import {
  Monitor,
  Shield,
  Headphones,
  Settings,
  LogOut,
  Terminal,
} from "lucide-react";
import { theme } from "../Home/Style/MainStyle";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * @param {string} currentMenu - 현재 페이지 위치를 기반으로 활성화 배지를 켜줄 메뉴 ID ('Home' | 'Software' | 'Helpdesk')
 */
export default function MainSidebar({ currentMenu }) {
  const navigate = useNavigate();
  const LoginInfo = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );

  // 🧭 메뉴 식별자(id)와 브라우저 주소창 주소(path)를 명확하게 분리 정의
  const menuItems = [
    {
      id: "asset",
      label: "IT 자산 관리",
      path: "/asset",
      icon: <Monitor size={18} />,
    },
    {
      id: "software",
      label: "소프트웨어 관리",
      path: "/software",
      icon: <Shield size={18} />,
    },
    {
      id: "helpdesk",
      label: "HelpDesk 이력 관리",
      path: "/helpdesk",
      icon: <Headphones size={18} />,
    },
  ];

  return (
    <SidebarContainer>
      {/* 1️⃣ 상단 브랜드 로고 섹션 */}
      <LogoZone>
        <LogoIconWrapper>
          <Terminal size={20} />
        </LogoIconWrapper>
        <div>
          <LogoText>DHK Solution</LogoText>
          <LogoSubText>IT Infra Admin</LogoSubText>
        </div>
      </LogoZone>

      {/* 2️⃣ 중간 메뉴 아이템 링크 트리 */}
      <MenuNavigation>
        <MenuSectionTitle>Core Console</MenuSectionTitle>
        {menuItems.map((item) => {
          const isActive = currentMenu === item.id;
          return (
            <MenuItem
              key={item.id}
              isActive={isActive}
              onClick={() =>
                navigate(item.path)
              } /* 🚀 아이템에 지정된 실제 URL path 주소로 이동 */
            >
              <IconWrapper isActive={isActive}>{item.icon}</IconWrapper>
              <MenuLabel isActive={isActive}>{item.label}</MenuLabel>
              {isActive && <ActiveIndicator />}
            </MenuItem>
          );
        })}
      </MenuNavigation>

      {/* 3️⃣ 하단 접속 관리자 세션 프로필 및 유틸리티 */}
      <SidebarFooter>
        <AdminProfileCard>
          <AvatarWrapper>
            <User size={16} style={{ color: theme.colors.primary }} />
          </AvatarWrapper>
          <AdminInfo>
            <AdminName>
              {LoginInfo?.name} {LoginInfo?.position}
            </AdminName>
            <AdminRole>{LoginInfo?.team}</AdminRole>
          </AdminInfo>
          <SettingsButton title="시스템 설정">
            <Settings size={16} />
          </SettingsButton>
        </AdminProfileCard>

        <LogoutButton onClick={() => alert("로그아웃 처리가 요청되었습니다.")}>
          <LogOut size={14} />
          <span>콘솔 세션 종료</span>
        </LogoutButton>
      </SidebarFooter>
    </SidebarContainer>
  );
}

// 👤 프로필 전용 인라인 임포트 대체 컴포넌트
function User({ size, style }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ─── Styled Components 정의 구역 ─── */
const SidebarContainer = styled.div`
  width: 260px;
  height: 100vh;
  background-color: ${() => theme.colors.white};
  border-right: 1px solid ${() => theme.colors.border};
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  flex-shrink: 0;
`;

const LogoZone = styled.div`
  padding: 28px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${() => theme.colors.borderLight};
`;

const LogoIconWrapper = styled.div`
  background: linear-gradient(
    135deg,
    ${() => theme.colors.primary} 0%,
    #1d4ed8 100%
  );
  color: ${() => theme.colors.white};
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
`;

const LogoText = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  letter-spacing: -0.03em;
`;

const LogoSubText = styled.div`
  font-size: 11px;
  color: ${() => theme.colors.textMuted};
  font-weight: 500;
  margin-top: 1px;
`;

const MenuNavigation = styled.nav`
  flex: 1;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MenuSectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: ${() => theme.colors.textMuted};
  padding-left: 12px;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 11px 14px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease-in-out;
  background-color: ${(props) =>
    props.isActive ? theme.colors.primaryLight : "transparent"};

  &:hover {
    background-color: ${(props) =>
      props.isActive ? theme.colors.primaryLight : theme.colors.bg};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.isActive ? theme.colors.primary : theme.colors.textSub};
  transition: color 0.2s;

  ${MenuItem}:hover & {
    color: ${() => theme.colors.primary};
  }
`;

const MenuLabel = styled.span`
  font-size: 13.5px;
  font-weight: ${(props) => (props.isActive ? "700" : "500")};
  color: ${(props) =>
    props.isActive ? theme.colors.primary : theme.colors.textSub};
  margin-left: 12px;
  transition: color 0.2s;

  ${MenuItem}:hover & {
    color: ${() => theme.colors.textMain};
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  right: 0;
  top: 12px;
  bottom: 12px;
  width: 3px;
  background-color: ${() => theme.colors.primary};
  border-radius: 4px 0 0 4px;
`;

const SidebarFooter = styled.div`
  padding: 16px;
  border-top: 1px solid ${() => theme.colors.borderLight};
  background-color: ${() => theme.colors.bg};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AdminProfileCard = styled.div`
  background: ${() => theme.colors.white};
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AvatarWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${() => theme.colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AdminInfo = styled.div`
  flex: 1;
`;

const AdminName = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
`;

const AdminRole = styled.div`
  font-size: 11px;
  color: ${() => theme.colors.textMuted};
`;

const SettingsButton = styled.button`
  background: none;
  border: none;
  color: ${() => theme.colors.textMuted};
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: ${() => theme.colors.textSub};
    background-color: ${() => theme.colors.bg};
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${() => theme.colors.textMuted};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    color: ${() => theme.colors.error};
    background-color: ${() => theme.colors.errorBg || "#fef2f2"};
  }
`;
