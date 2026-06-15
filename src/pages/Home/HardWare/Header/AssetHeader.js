import React from "react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";
import { Plus } from "lucide-react";

const AssetHeader = ({ openModal }) => {
  return (
    <Header>
      <div>
        <Title>DHKS IT 자산관리</Title>
        <Subtitle>
          자산 행 항목을 우측 클릭하면 바로가기 수정 메뉴가 나타납니다.
        </Subtitle>
      </div>
      <PrimaryButton onClick={() => openModal("REGISTER")}>
        <Plus size={16} /> 자산 등록
      </PrimaryButton>
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;
const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  letter-spacing: -0.03em;
`;
const Subtitle = styled.p`
  font-size: 14px;
  color: ${() => theme.colors.textSub};
  margin-top: 4px;
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: ${() => theme.colors.primary};
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
`;

export default AssetHeader;
