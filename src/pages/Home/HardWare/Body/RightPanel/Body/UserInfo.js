import React from "react";
import styled from "styled-components";
import { theme } from "../../../../Style/MainStyle";
import {
  Calendar,
  Terminal,
  User,
  Hash,
  Cpu,
  Database,
  HardDrive,
  Phone,
  Smartphone,
  Monitor,
} from "lucide-react";

const UserInfo = ({ selectedAsset }) => {
  if (!selectedAsset) return null;

  return (
    <InfoCard>
      {/* ─── 1. 공통 기본 정보 영역 ─── */}
      <SectionTitle>기본 정보</SectionTitle>
      <GridZone>
        <div className="item">
          <User size={14} className="icon" />
          <span className="label">사용자</span>
          <span className="value">
            {selectedAsset.user &&
            selectedAsset.user !== "-" &&
            selectedAsset.user !== "재고" ? (
              <b>
                {selectedAsset.departmentName} {selectedAsset.fullName}{" "}
                {selectedAsset.titleName}
              </b>
            ) : (
              <b className="empty">-</b>
            )}
          </span>
        </div>

        <div className="item">
          <Terminal size={14} className="icon" />
          <span className="label">S/N (일련번호)</span>
          <span className="value">
            <b>{selectedAsset.serial || "-"}</b>
          </span>
        </div>

        {selectedAsset.erpCode && (
          <div className="item">
            <Hash size={14} className="icon" />
            <span className="label">ERP 코드</span>
            <span className="value">
              <b>{selectedAsset.erpCode}</b>
            </span>
          </div>
        )}

        <div className="item">
          <Calendar size={14} className="icon" />
          <span className="label">등록일</span>
          <span className="value">
            <b>{selectedAsset.date || "-"}</b>
          </span>
        </div>
      </GridZone>

      <Divider />

      {/* ─── 2. 기종별 상세 사양 영역 ─── */}
      <SectionTitle>상세 사양 ({selectedAsset.deviceType})</SectionTitle>
      <GridZone>
        {/* PC / 노트북 사양 */}
        {selectedAsset.deviceType === "PC" && (
          <>
            <div className="item">
              <Cpu size={14} className="icon" />
              <span className="label">CPU</span>
              <span className="value">
                <b>{selectedAsset.specCpu || "미지정"}</b>
              </span>
            </div>
            <div className="item">
              <Database size={14} className="icon" />
              <span className="label">RAM</span>
              <span className="value">
                <b>{selectedAsset.specRam || "미지정"}</b>
              </span>
            </div>
            <div className="item">
              <HardDrive size={14} className="icon" />
              <span className="label">Storage</span>
              <span className="value">
                <b>{selectedAsset.specStorage || "미지정"}</b>
              </span>
            </div>
          </>
        )}

        {/* 아이폰 사양 */}
        {selectedAsset.deviceType === "IPHONE" && (
          <>
            <div className="item">
              <Phone size={14} className="icon" />
              <span className="label">전화번호</span>
              <span className="value">
                <b>{selectedAsset.phoneNumber || "미지정"}</b>
              </span>
            </div>
            <div className="item">
              <Smartphone size={14} className="icon" />
              <span className="label">IMEI 1</span>
              <span className="value">
                <b>{selectedAsset.imei1 || "미지정"}</b>
              </span>
            </div>
            <div className="item">
              <Smartphone size={14} className="icon" />
              <span className="label">IMEI 2</span>
              <span className="value">
                <b>{selectedAsset.imei2 || "미지정"}</b>
              </span>
            </div>
            <div className="item">
              <Hash size={14} className="icon" />
              <span className="label">EID</span>
              <span className="value" title={selectedAsset.eid}>
                <b className="truncate">{selectedAsset.eid || "미지정"}</b>
              </span>
            </div>
          </>
        )}

        {/* 모니터 사양 */}
        {selectedAsset.deviceType === "MONITOR" && (
          <>
            <div className="item">
              <Monitor size={14} className="icon" />
              <span className="label">화면 크기</span>
              <span className="value">
                <b>{selectedAsset.monitorSize || "미지정"}</b>
              </span>
            </div>
          </>
        )}
      </GridZone>
    </InfoCard>
  );
};

// ─── 🎨 스타일 컴포넌트 ───
const InfoCard = styled.div`
  background: ${() => theme.colors.bg};
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  border: 1px solid ${() => theme.colors.borderLight};
`;

const SectionTitle = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const GridZone = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 12px;

  .item {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
    background: #fff;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;

    .icon {
      color: ${() => theme.colors.primary};
      margin-bottom: 2px;
    }

    .label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
    }

    .value {
      font-size: 13px;
      color: ${() => theme.colors.textMain};
      width: 100%;

      b {
        font-weight: 700;
      }
      .empty {
        color: #94a3b8;
      }
      .truncate {
        display: block;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`;

const Divider = styled.div`
  border-top: 1px dashed #cbd5e1;
  margin: 20px 0;
`;

export default UserInfo;
