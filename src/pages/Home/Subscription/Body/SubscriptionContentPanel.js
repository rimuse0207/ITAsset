// 🚀 Body/SubscriptionContentPanel.js
import React from "react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";

import {
  AlertTriangle,
  Calendar,
  ExternalLink,
  FileText,
  Plus,
  RefreshCw,
  ShieldCheck,
  User,
  Edit3,
  Trash2,
} from "lucide-react";
import { getExpirationStatus } from "../InfrastructureSubscription";

import SoftwareHeader from "../../SoftWare/Header/SoftwareHeader";
import { FileDownload } from "../../../../publicFunc/FileDownload/FileDownload";

export default function SubscriptionContentPanel({
  selectedVendor,
  selectedItem,
  onOpenRenewalModal,
  onOpenItemEdit,
  onDeleteRenewal,
}) {
  if (!selectedVendor || !selectedItem) {
    return (
      <EmptyZone>
        좌측에서 조회할 서비스 및 세부 관리 항목을 선택해주세요.
      </EmptyZone>
    );
  }

  const expInfo = getExpirationStatus(
    selectedItem.expireDate,
    selectedItem.alertDays,
  );
  const isAlertTarget =
    expInfo.status === "WARNING" || expInfo.status === "EXPIRED";

  // 🚀 DB 테이블(subscriptionRenewals) 매핑 배열
  const renewals = selectedItem.renewals || [];

  return (
    <RightPanel>
      <SoftwareHeader
        title={`${selectedItem.itemName}`}
        subTitle={`${selectedVendor.vendorName} · ${selectedVendor.category}`}
        onModalOpen={() => onOpenItemEdit && onOpenItemEdit(selectedItem)}
        isButton={false}
      />

      <DetailScrollZone>
        {/* 🚨 1. 만료 임박(D-60 이내) 또는 만료 경과 시 자동 노출되는 경고 배너 */}
        {isAlertTarget && (
          <ExpirationAlertBanner isExpired={expInfo.status === "EXPIRED"}>
            <div className="alert-left">
              <AlertTriangle size={22} className="alert-icon" />
              <div>
                <div className="alert-title">
                  {expInfo.status === "EXPIRED"
                    ? `서비스 만료일(${selectedItem.expireDate})이 경과되었습니다! (${expInfo.label})`
                    : `서비스 만료일이 ${expInfo.diffDays}일 남았습니다! (사전 알림 기준: ${selectedItem.alertDays}일 전)`}
                </div>
                <div className="alert-desc">
                  도메인(DNS) 연결 끊김이나 인증서 만료 장애가 발생하지 않도록
                  업체 사이트에서 기간 연장을 진행한 후 아래에 결재 이력을
                  등록해 주세요.
                </div>
              </div>
            </div>
            <RenewTriggerButton type="button" onClick={onOpenRenewalModal}>
              <RefreshCw size={14} /> 기간 연장 등록
            </RenewTriggerButton>
          </ExpirationAlertBanner>
        )}

        {/* 📋 2. 계약 및 접속 정보 요약 카드 (subscriptionItems 컬럼 매핑) */}
        <SectionBlock>
          <SectionHeaderZone>
            <SectionTitle>
              <ShieldCheck size={15} /> 계약 및 만료 상세 명세
            </SectionTitle>
            {onOpenItemEdit && (
              <SectionAddButton
                type="button"
                onClick={() => onOpenItemEdit(selectedItem)}
              >
                <Edit3 size={12} /> 항목 설정 수정
              </SectionAddButton>
            )}
          </SectionHeaderZone>

          <SpecGridCard>
            <div className="spec-box">
              <span className="label">시작일 (startDate)</span>
              <span className="value mono">
                {selectedItem.startDate || "-"}
              </span>
            </div>

            <div className="spec-box">
              <span className="label">현재 만료 예정일 (expireDate)</span>
              <span
                className="value mono"
                style={{ color: expInfo.color, fontWeight: 800 }}
              >
                {selectedItem.expireDate} ({expInfo.label})
              </span>
            </div>

            <div className="spec-box">
              <span className="label">갱신 주기 / 사전 알림 기준</span>
              <span className="value">
                {selectedItem.cycleType} 단위 / 만료{" "}
                <b style={{ color: "#d97706" }}>
                  {selectedItem.alertDays}일 전
                </b>{" "}
                경고
              </span>
            </div>

            <div className="spec-box">
              <span className="label">
                관리 계정 ID / 식별 정보 (accountInfo)
              </span>
              <span className="value">{selectedItem.accountInfo || "-"}</span>
            </div>

            <div className="spec-box">
              <span className="label">업체 관리 콘솔 URL (siteUrl)</span>
              {selectedVendor.siteUrl ? (
                <a
                  href={selectedVendor.siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="url-link"
                >
                  {selectedVendor.siteUrl} <ExternalLink size={12} />
                </a>
              ) : (
                <span className="value muted">등록된 URL 없음</span>
              )}
            </div>

            <div className="spec-box">
              <span className="label">업체 마스터 비고</span>
              <span className="value sub">{selectedVendor.memo || "-"}</span>
            </div>

            {selectedItem.memo && (
              <div className="spec-box full-width">
                <span className="label">항목 상세 비고 (결제/갱신 안내)</span>
                <span className="value sub">{selectedItem.memo}</span>
              </div>
            )}
          </SpecGridCard>
        </SectionBlock>

        {/* 💳 3. 기간 연장 및 품의서 결재 이력 테이블 (subscriptionRenewals 컬럼 매핑) */}
        <SectionBlock>
          <SectionHeaderZone>
            <SectionTitle>
              <Calendar size={15} /> 기간 연장 및 지출 품의 이력 (총{" "}
              {renewals.length}건)
            </SectionTitle>
            <SectionAddButton type="button" onClick={onOpenRenewalModal}>
              <Plus size={12} /> 기간 연장 갱신 등록
            </SectionAddButton>
          </SectionHeaderZone>

          <TableContainer>
            <HistoryTable>
              <thead>
                <tr>
                  <th>연장 결재일</th>
                  <th>연장 전 만료일</th>
                  <th>연장 후 만료일</th>
                  <th style={{ textAlign: "right" }}>결제 비용</th>
                  <th>품의서 / 영수증 증빙</th>
                  <th>기안 번호 및 비고</th>
                  {onDeleteRenewal && (
                    <th style={{ width: "60px", textAlign: "center" }}>관리</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {renewals.length === 0 ? (
                  <tr>
                    <td colSpan={onDeleteRenewal ? 7 : 6} className="empty-row">
                      등록된 기간 연장 이력이 없습니다. 우측 상단 버튼을 통해
                      연장 내역을 추가하세요.
                    </td>
                  </tr>
                ) : (
                  renewals.map((hist) => (
                    <tr key={hist.renewalId}>
                      <td className="mono">{hist.renewalDate}</td>
                      <td className="mono muted">{hist.prevExpireDate}</td>
                      <td className="mono primary">{hist.nextExpireDate}</td>
                      <td
                        className="mono"
                        style={{ textAlign: "right", fontWeight: 700 }}
                      >
                        {Number(hist.renewalCost || 0).toLocaleString()}원
                      </td>
                      <td>
                        {hist.proposalFilePath ? (
                          <FileBadge
                            onDoubleClick={(e) =>
                              FileDownload(
                                e,
                                hist.proposalFilePath,
                                hist.proposalFileName,
                                "subscription",
                              )
                            }
                            title="더블 클릭 시 첨부된 품의서 사본을 다운로드합니다."
                          >
                            <FileText size={12} />
                            <span className="f-name">
                              {hist.proposalFileName}
                            </span>
                          </FileBadge>
                        ) : (
                          <span className="muted" style={{ fontSize: "11px" }}>
                            증빙 파일 미첨부
                          </span>
                        )}
                      </td>
                      <td>{hist.logMemo || "-"}</td>
                      {onDeleteRenewal && (
                        <td style={{ textAlign: "center" }}>
                          <TableActionButton
                            type="button"
                            className="danger"
                            title="연장 이력 삭제"
                            onClick={() => onDeleteRenewal(hist)}
                          >
                            <Trash2 size={12} />
                          </TableActionButton>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </HistoryTable>
          </TableContainer>
        </SectionBlock>
      </DetailScrollZone>
    </RightPanel>
  );
}

/* ─── 🎨 스타일 시트 (동일) ─── */
const RightPanel = styled.div`
  flex: 1;
  background: ${() => theme.colors.white};
  display: flex;
  flex-direction: column;
`;
const EmptyZone = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${() => theme.colors.textMuted};
  font-size: 13.5px;
  background: ${() => theme.colors.bg};
`;
const DetailScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
const ExpirationAlertBanner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 22px;
  border-radius: 12px;
  background: ${(props) => (props.isExpired ? "#fef2f2" : "#fffbeb")};
  border: 1px solid ${(props) => (props.isExpired ? "#fca5a5" : "#fde68a")};
  gap: 16px;
  .alert-left {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .alert-icon {
    color: ${(props) => (props.isExpired ? "#dc2626" : "#d97706")};
    flex-shrink: 0;
    margin-top: 2px;
  }
  .alert-title {
    font-size: 14.5px;
    font-weight: 800;
    color: ${(props) => (props.isExpired ? "#991b1b" : "#92400e")};
  }
  .alert-desc {
    font-size: 12.5px;
    color: ${(props) => (props.isExpired ? "#b91c1c" : "#b45309")};
    margin-top: 4px;
    line-height: 1.4;
  }
`;
const RenewTriggerButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  background: #ea580c;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(234, 88, 12, 0.2);
  transition: background 0.15s ease;
  &:hover {
    background: #c2410c;
  }
`;
const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const SectionHeaderZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
`;
const SectionAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 12px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${() => theme.colors.primary};
    color: ${() => theme.colors.primary};
    background: ${() => theme.colors.primaryLight};
  }
`;
const SpecGridCard = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  background: ${() => theme.colors.bg};
  padding: 18px;
  border-radius: 12px;
  border: 1px solid ${() => theme.colors.borderLight};
  .spec-box {
    display: flex;
    flex-direction: column;
    gap: 4px;
    background: #fff;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    &.full-width {
      grid-column: 1 / -1;
    }
  }
  .label {
    font-size: 11px;
    font-weight: 600;
    color: #64748b;
  }
  .value {
    font-size: 13.5px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
    &.mono {
      font-family: monospace;
    }
    &.sub {
      font-size: 12.5px;
      font-weight: 500;
      color: #475569;
      line-height: 1.4;
    }
    &.muted {
      font-size: 12px;
      font-weight: 500;
      color: #94a3b8;
    }
  }
  .url-link {
    font-size: 13px;
    font-weight: 700;
    color: #2563eb;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const TableContainer = styled.div`
  border: 1px solid ${() => theme.colors.borderLight};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${() => theme.shadows.card};
  background: #fff;
`;
const HistoryTable = styled.table`
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
    &:hover {
      background-color: #fafafa;
    }
  }
  td {
    padding: 12px 16px;
    font-size: 13px;
    color: ${() => theme.colors.textSub};
    &.mono {
      font-family: monospace;
    }
    &.muted {
      color: #94a3b8;
    }
    &.primary {
      color: #2563eb;
      font-weight: 700;
    }
    &.empty-row {
      text-align: center;
      padding: 32px;
      color: ${() => theme.colors.textMuted};
    }
  }
`;
const FileBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  max-width: 220px;
  cursor: pointer;
  transition: all 0.12s ease-in-out;
  svg {
    color: #64748b;
    flex-shrink: 0;
  }
  .f-name {
    font-size: 11.5px;
    font-weight: 600;
    color: #475569;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:hover {
    background: #f0f7ff;
    border-color: #bfdbfe;
    svg,
    .f-name {
      color: #2563eb;
    }
  }
`;
const TableActionButton = styled.button`
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${() => theme.colors.textSub};
  &:hover {
    border-color: ${() => theme.colors.primary};
    color: ${() => theme.colors.primary};
  }
  &.danger:hover {
    border-color: ${() => theme.colors.error};
    color: ${() => theme.colors.error};
    background: ${() => theme.colors.errorBg};
  }
`;
