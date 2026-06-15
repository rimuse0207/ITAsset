import { Calendar, Terminal, User } from "lucide-react";
import React from "react";
import styled from "styled-components";
import { theme } from "../../../../Style/MainStyle";

const UserInfo = ({ selectedAsset }) => {
  console.log(selectedAsset);
  return (
    <InfoCard>
      <div className="item">
        <User size={14} />{" "}
        <span>
          사용자:{" "}
          {selectedAsset.currentUser ? (
            <b>
              {selectedAsset.departmentName} {selectedAsset.fullName}{" "}
              {selectedAsset.titleName}
            </b>
          ) : (
            <b>-</b>
          )}
        </span>
      </div>
      <div className="item">
        <Terminal size={14} />{" "}
        <span>
          S/N: <b>{selectedAsset.serial}</b>
        </span>
      </div>
      <div className="item">
        <Calendar size={14} />{" "}
        <span>
          등록일: <b>{selectedAsset.date}</b>
        </span>
      </div>
    </InfoCard>
  );
};

const InfoCard = styled.div`
  background: ${() => theme.colors.bg};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
  .item {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: ${() => theme.colors.textSub};
    b {
      color: ${() => theme.colors.textMain};
    }
  }
`;
export default UserInfo;
