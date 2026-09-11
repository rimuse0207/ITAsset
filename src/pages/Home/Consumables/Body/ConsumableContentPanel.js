import React from "react";
import styled from "styled-components";

import { Users, FileText, Plus, Paperclip, Edit3, Trash2 } from "lucide-react";
import SoftwareHeader from "../../SoftWare/Header/SoftwareHeader";
import { theme } from "../../Style/MainStyle";
import moment from "moment/moment";
import { InlineFileDownloadBadge } from "../../SoftWare/Body/LicenseContentPannel/Contents/LicensePurchaseHistory";
import { FileDownload } from "../../../../publicFunc/FileDownload/FileDownload";

export default function ConsumableContentPanel({
  selectedItem,
  onAction,
  userUsedList,
  purchaseList,
}) {
  if (!selectedItem)
    return <EmptyZone>목록에서 소모품을 선택해주세요.</EmptyZone>;

  return (
    <RightPanel>
      <SoftwareHeader
        title={selectedItem.name}
        subTitle={"소모품 재고 및 지급 현황 관리"}
        isButton={false}
      />

      <DetailScrollZone>
        {/* 구역 1: 사용자 지급 내역 */}
        <SectionBlock>
          <SectionHeaderZone>
            <SectionTitle>
              <Users size={16} /> 실사용자 지급 내역
            </SectionTitle>
            <SectionAddButton
              onClick={() => onAction("ISSUE_TO_USER", selectedItem)}
            >
              <Plus size={12} /> 사용자 지급 등록
            </SectionAddButton>
          </SectionHeaderZone>

          <TableContainer>
            <PlaceholderTable>
              <thead>
                <tr>
                  <th>지급 일자</th>
                  <th>지급자</th>
                  <th>수량</th>
                  <th>비고</th>
                  <th style={{ width: "70px", textAlign: "center" }}>
                    관리
                  </th>{" "}
                </tr>
              </thead>
              <tbody>
                {userUsedList.map((list) => {
                  return (
                    <tr key={list.id}>
                      <td>{moment(list.issueDate).format("YY년 MM월 DD일")}</td>
                      <td>
                        {list.departmentName} {list.fullName} {list.titleName}
                      </td>

                      <td>{list.issueCount}</td>
                      <td>{list.memo}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "center",
                          }}
                        >
                          <TableActionButton
                            type="button"
                            onClick={() => onAction("EDIT_ISSUE", list)}
                          >
                            <Edit3 size={13} />
                          </TableActionButton>
                          <TableActionButton
                            className="danger"
                            type="button"
                            onClick={() => onAction("DELETE_ISSUE", list)}
                          >
                            <Trash2 size={13} />
                          </TableActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </PlaceholderTable>
          </TableContainer>
        </SectionBlock>

        {/* 구역 2: 구매 및 입고 (결재 내역 첨부) */}
        <SectionBlock>
          <SectionHeaderZone>
            <SectionTitle>
              <FileText size={16} /> 구매 및 입고 내역
            </SectionTitle>
            <SectionAddButton
              onClick={() => onAction("REGISTER_PURCHASE", selectedItem)}
            >
              <Plus size={12} /> 입고/품의 등록
            </SectionAddButton>
          </SectionHeaderZone>

          <TableContainer>
            <PlaceholderTable>
              <thead>
                <tr>
                  <th>입고 일자</th>
                  <th>구매 수량</th>
                  <th>단가</th>
                  <th>결재 품의서 / 첨부파일</th>
                  <th>비고</th>
                  <th style={{ width: "70px", textAlign: "center" }}>
                    관리
                  </th>{" "}
                </tr>
              </thead>
              <tbody>
                {purchaseList.map((list) => {
                  return (
                    <tr key={list.purchaseId}>
                      <td>
                        {moment(list.purchaseDate).format("YY년 MM월 DD일")}
                      </td>
                      <td>{list.restockCount}</td>
                      <td style={{ fontWeight: 600 }}>
                        ₩ {list.unitPrice?.toLocaleString()}
                      </td>
                      <td className={list.originalFileName ? "file-link" : ""}>
                        {list.originalFileName ? (
                          <InlineFileDownloadBadge
                            onDoubleClick={(e) => {
                              FileDownload(
                                e,
                                list.purchaseProofUrl,
                                list.originalFileName,
                                "consumable",
                              );
                            }}
                            title="더블 클릭 시 지출 품의서 사본을 다운로드합니다."
                          >
                            <FileText size={12} />
                            <span className="f-name">
                              {list.originalFileName}
                            </span>
                            {/* <Paperclip size={12} /> {list.originalFileName} */}
                          </InlineFileDownloadBadge>
                        ) : (
                          <></>
                        )}
                      </td>
                      <td style={{ color: "#64748b" }}>{list.logMemo}</td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "6px",
                            justifyContent: "center",
                          }}
                        >
                          <TableActionButton
                            type="button"
                            onClick={() => onAction("EDIT_PURCHASE", list)}
                          >
                            <Edit3 size={13} />
                          </TableActionButton>
                          <TableActionButton
                            className="danger"
                            type="button"
                            onClick={() => onAction("DELETE_PURCHASE", list)}
                          >
                            <Trash2 size={13} />
                          </TableActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </PlaceholderTable>
          </TableContainer>
        </SectionBlock>
      </DetailScrollZone>
    </RightPanel>
  );
}

const TableActionButton = styled.button`
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${() => theme.colors.textSub};
  transition: all 0.15s;
  &:hover {
    border-color: ${() => theme.colors.primary};
    color: ${() => theme.colors.primary};
    background: ${() => theme.colors.primaryLight};
  }
  &.danger:hover {
    border-color: ${() => theme.colors.error};
    color: ${() => theme.colors.error};
    background: ${() => theme.colors.errorBg};
  }
`;

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
  font-size: 14px;
  color: ${() => theme.colors.textMuted};
  background: ${() => theme.colors.bg};
`;
const DetailScrollZone = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;
const SectionBlock = styled.div`
  display: flex;
  flex-direction: column;
`;
const SectionHeaderZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;
const SectionTitle = styled.h3`
  font-size: 15px;
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
  padding: 6px 12px;
  background: #fff;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${() => theme.colors.primary};
    color: ${() => theme.colors.primary};
    background: ${() => theme.colors.primaryLight};
  }
`;
const TableContainer = styled.div`
  border: 1px solid ${() => theme.colors.borderLight};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: ${() => theme.shadows.card};
  background: #fff;
`;
const PlaceholderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;
  th {
    background: ${() => theme.colors.bg};
    padding: 12px 16px;
    font-weight: 600;
    color: ${() => theme.colors.textSub};
    border-bottom: 1px solid ${() => theme.colors.borderLight};
  }
  td {
    padding: 14px 16px;
    border-bottom: 1px solid ${() => theme.colors.borderLight};
    color: ${() => theme.colors.textMain};
  }
  tr:last-child td {
    border-bottom: none;
  }
  .file-link {
    color: ${() => theme.colors.primary};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    &:hover {
      text-decoration: underline;
    }
  }
`;
