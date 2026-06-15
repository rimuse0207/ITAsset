import React from "react";
import {
  MiniActionButton,
  PurchaseHistoryContainer,
  SectionAddButton,
  SectionBlock,
  SectionHeaderZone,
  SectionTitle,
  TableActionButton,
  UserTableContainer,
} from "../LicenseContentPannel";
import {
  BadgeDollarSign,
  FileText,
  Globe,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import styled from "styled-components";
import moment from "moment";
import { theme } from "../../../../Style/MainStyle";
import { FileDownload } from "../../../../../../publicFunc/FileDownload/FileDownload";

const LicensePuchaseHistory = ({
  isLicenseRequired,
  selectedVersion,
  onAction,
}) => {
  return (
    <SectionBlock>
      <SectionHeaderZone>
        <SectionTitle>
          {isLicenseRequired ? (
            <>
              <BadgeDollarSign size={15} />
              라이선스 수량 및 구매 이력 (
              {selectedVersion.totalPurchasedLicenses || 0} Copy 보유)
            </>
          ) : (
            <>
              <Globe size={15} />
              오픈소스 라이선스 불필요
            </>
          )}
        </SectionTitle>

        {isLicenseRequired && (
          <SectionAddButton
            onClick={() => onAction && onAction("REGISTER", "PURCHASE")}
          >
            <Plus size={12} /> 라이선스 구매 수량 추가
          </SectionAddButton>
        )}
      </SectionHeaderZone>

      <PurchaseHistoryContainer>
        {isLicenseRequired ? (
          <UserTable>
            <thead>
              <tr>
                <th>구매일</th>
                <th style={{ textAlign: "right" }}>구매 수량</th>
                <th>지출 증빙 및 품의서 문서</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              {!selectedVersion.purchaseList ||
              selectedVersion.purchaseList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign: "center",
                      color: theme.colors.textMuted,
                      padding: "28px",
                    }}
                  >
                    등록된 라이선스 구매 내역이 없습니다. 상단 버튼을 통해 보유
                    Copy 수를 넣어주세요.
                  </td>
                </tr>
              ) : (
                selectedVersion.purchaseList.map((item, pIdx) => (
                  <tr key={pIdx}>
                    <td style={{ fontFamily: "monospace" }}>
                      {moment(item.purchaseDate).format("YYYY-MM-DD")}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontWeight: "700",
                        color: "#2563eb",
                        fontFamily: "monospace",
                      }}
                    >
                      +{item.licenseCount} Copy
                    </td>
                    <td>
                      {item.proposal_file_path || item.proposalFilePath ? (
                        <InlineFileDownloadBadge
                          onDoubleClick={(e) => {
                            FileDownload(
                              e,
                              item.proposalFilePath,
                              item.proposalFileName,
                              "softwares",
                            );
                          }}
                          title="더블 클릭 시 지출 품의서 사본을 다운로드합니다."
                        >
                          <FileText size={12} />
                          <span className="f-name">
                            {item.proposal_file_name || item.proposalFileName}
                          </span>
                        </InlineFileDownloadBadge>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: "11px" }}>
                          증빙 파일 미첨부
                        </span>
                      )}
                    </td>
                    <td>{item.logMemo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </UserTable>
        ) : (
          <FreePolicyBannerZone>
            <Info size={18} />
            <div className="policy-message-block">
              <div className="main-msg">
                본 소프트웨어는 [무료 / 오픈소스 프리웨어] 자산 정책이 적용
                중입니다.
              </div>
              <div className="sub-msg">
                사내 예산 집행이 수반되지 않는 도구이므로{" "}
                <strong>
                  구매 품의서 업로드 및 보유 카피 수 한도 제어가 면제
                </strong>
                됩니다. 하단의 테이블 매핑 구역을 통해 임직원에게 자유롭게 배정
                및 회수 처리를 진행할 수 있습니다.
              </div>
            </div>
          </FreePolicyBannerZone>
        )}
      </PurchaseHistoryContainer>
    </SectionBlock>
  );
};

export const TableActionFlexZone = styled.div`
  display: flex;
  gap: 4px;
  justify-content: center;
`;

export const UserTable = styled.table`
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

const InlineFileDownloadBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background-color: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  max-width: 220px;
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
    background-color: #f0f7ff;
    border-color: #bfdbfe;
    svg {
      color: #2563eb;
    }
    .f-name {
      color: #2563eb;
    }
  }
`;

const FreePolicyBannerZone = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background-color: #f0f7ff; /* 핏 블루스케일 소프트 배경 */
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 16px 20px;
  box-sizing: border-box;

  svg {
    color: #2563eb; /* 블루 포인트 처리 */
    flex-shrink: 0;
    margin-top: 2px;
  }

  .policy-message-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .main-msg {
    font-size: 13.5px;
    font-weight: 700;
    color: #1e40af;
  }

  .sub-msg {
    font-size: 12px;
    color: #475569;
    line-height: 1.5;
    font-weight: 500;
    strong {
      color: #1e3a8a;
      font-weight: 700;
    }
  }
`;

export default LicensePuchaseHistory;
