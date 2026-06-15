import React, { useState } from "react";
import { theme } from "../../../Style/MainStyle";
import styled from "styled-components";
import { User, Hash, Layers, Smartphone, Tv, Laptop } from "lucide-react";

const AssetTable = ({
  assets, // 필터 가공 완료된 실 가동 리스트
  rawMasterAssets, // 전체 통계 산출용 원본 원시 데이터셋
  selectedAsset,
  setSelectedAsset,
  handleContextMenu,
  setActiveTab,
}) => {
  const [currentTypeFilter, setCurrentTypeFilter] = useState("ALL");

  const counts = {
    ALL: rawMasterAssets.length,
    PC: rawMasterAssets.filter((a) => a.deviceType === "PC").length,
    IPHONE: rawMasterAssets.filter((a) => a.deviceType === "IPHONE").length,
    MONITOR: rawMasterAssets.filter((a) => a.deviceType === "MONITOR").length,
  };

  const finalDisplayAssets = assets.filter((asset) => {
    if (currentTypeFilter === "ALL") return true;
    return asset.deviceType === currentTypeFilter;
  });

  return (
    <TableWrapperZone>
      <FilterTabSegmentBar>
        <TabItem
          active={currentTypeFilter === "ALL"}
          onClick={() => setCurrentTypeFilter("ALL")}
        >
          <Layers size={14} /> <span className="tab-label">전체 인프라</span>
          <span className="count-badge">{counts.ALL}</span>
        </TabItem>
        <TabItem
          active={currentTypeFilter === "PC"}
          onClick={() => setCurrentTypeFilter("PC")}
        >
          <Laptop size={14} />{" "}
          <span className="tab-label"> 데스크탑 / 노트북</span>
          <span className="count-badge primary">{counts.PC}</span>
        </TabItem>
        <TabItem
          active={currentTypeFilter === "IPHONE"}
          onClick={() => setCurrentTypeFilter("IPHONE")}
        >
          <Smartphone size={14} />{" "}
          <span className="tab-label">모바일 (iPhone)</span>
          <span className="count-badge success">{counts.IPHONE}</span>
        </TabItem>
        <TabItem
          active={currentTypeFilter === "MONITOR"}
          onClick={() => setCurrentTypeFilter("MONITOR")}
        >
          <Tv size={14} /> <span className="tab-label"> 모니터</span>
          <span className="count-badge warning">{counts.MONITOR}</span>
        </TabItem>
      </FilterTabSegmentBar>

      {/* 📝 2. 동적 컬럼 바인딩 테이블 */}
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th style={{ width: "200px" }}>자산 관리코드</th>
              <th>자산 모델명</th>
              {currentTypeFilter === "ALL" && (
                <th style={{ width: "140px" }}>기기 카테고리</th>
              )}
              {currentTypeFilter === "ALL" && (
                <th style={{ width: "180px" }}>메모 비고</th>
              )}
              {currentTypeFilter === "PC" && (
                <th style={{ width: "240px" }}>하드웨어 사양 (CPU/RAM/SSD)</th>
              )}
              {currentTypeFilter === "IPHONE" && (
                <th style={{ width: "160px" }}>일련번호 (IMEI)</th>
              )}
              {currentTypeFilter === "IPHONE" && (
                <th style={{ width: "120px" }}>연동 전화번호</th>
              )}
              {currentTypeFilter === "MONITOR" && (
                <th style={{ width: "180px" }}>화면 크기 (Size)</th>
              )}
              <th style={{ width: "120px" }}>기기 상태</th>
              <th style={{ width: "160px" }}>현재 실사용자</th>
            </tr>
          </thead>
          <tbody>
            {finalDisplayAssets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    color: theme.colors.textMuted,
                    padding: "48px 0",
                  }}
                >
                  조건에 해당하는 전산 기기 자산이 비어있습니다.
                </td>
              </tr>
            ) : (
              finalDisplayAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  isSelected={selectedAsset?.id === asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setActiveTab("history");
                  }}
                  onContextMenu={(e) => handleContextMenu(e, asset)}
                >
                  <td className="code">
                    <Hash
                      size={12}
                      style={{ opacity: 0.5, marginRight: "2px" }}
                    />
                    {asset.id}
                  </td>
                  <td className="name">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      {asset.deviceType === "PC" && (
                        <Laptop size={14} style={{ color: "#2563eb" }} />
                      )}
                      {asset.deviceType === "IPHONE" && (
                        <Smartphone size={14} style={{ color: "#10b981" }} />
                      )}
                      {asset.deviceType === "MONITOR" && (
                        <Tv size={14} style={{ color: "#f59e0b" }} />
                      )}
                      <span>{asset.name}</span>
                    </div>
                  </td>

                  {/* 기종 분류 사양 스위칭 표출부 */}
                  {currentTypeFilter === "ALL" && (
                    <td className="meta-text">{asset.category}</td>
                  )}
                  {currentTypeFilter === "ALL" && (
                    <td className="meta-text">{asset.memo || "-"}</td>
                  )}
                  {currentTypeFilter === "PC" && (
                    <td className="spec-text">
                      <code className="spec-chip">
                        {asset.specCpu || "미지정"}
                      </code>
                      <code className="spec-chip">{asset.specRam || "-"}</code>
                      <code className="spec-chip">
                        {asset.specStorage || "-"}
                      </code>
                    </td>
                  )}
                  {currentTypeFilter === "IPHONE" && (
                    <td className="imei-text">{asset.serial || "-"}</td>
                  )}
                  {currentTypeFilter === "IPHONE" && (
                    <td className="meta-text">{asset.phoneNumber || "-"}</td>
                  )}
                  {currentTypeFilter === "MONITOR" && (
                    <td className="spec-text">
                      <span style={{ fontWeight: 700, color: "#f59e0b" }}>
                        {asset.monitorSize || "-"}
                      </span>
                    </td>
                  )}

                  <td>
                    <StatusBadge status={asset.status}>
                      <span className="dot" />
                      {asset.status}
                    </StatusBadge>
                  </td>
                  <td className="user-cell">
                    <User size={13} className="u-icon" />
                    <span>
                      {asset.user ? (
                        `${asset.departmentName} ${asset.fullName} ${asset.titleName}`
                      ) : asset.status === "폐기" ? (
                        <span className="stock">폐기</span>
                      ) : (
                        <span className="stock">재고 보관중</span>
                      )}
                    </span>
                  </td>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </TableContainer>
    </TableWrapperZone>
  );
};

/* ─── 🎨 관제 레이아웃 컴포넌트 ─── */
const TableWrapperZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
`;
const FilterTabSegmentBar = styled.div`
  display: flex;
  gap: 6px;
  background: #f1f5f9;
  padding: 5px;
  border-radius: 12px;
  width: fit-content;
`;
const TabItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.active ? "#fff" : "transparent")};
  color: ${(props) => (props.active ? "#0f172a" : "#64748b")};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: ${(props) =>
    props.active ? "0 2px 8px rgba(15, 23, 42, 0.08)" : "none"};
  transition: all 0.15s ease-in-out;
  .tab-label {
    margin-top: -1px;
  }
  .count-badge {
    font-size: 11px;
    font-weight: 800;
    padding: 1px 6px;
    border-radius: 20px;
    background: #e2e8f0;
    color: #475569;
  }
  ${(props) =>
    props.active &&
    ` .count-badge.primary { background: #eff6ff; color: #2563eb; } .count-badge.success { background: #f0fdf4; color: #10b981; } .count-badge.warning { background: #fffbeb; color: #b45309; } `} &:hover {
    color: #0f172a;
    background: ${(props) => (props.active ? "#fff" : "rgba(255,255,255,0.5)")};
  }
`;
const TableContainer = styled.div`
  background: ${() => theme.colors.white};
  border-radius: 14px;
  border: 1px solid ${() => theme.colors.border};
  box-shadow: ${() => theme.shadows.soft};
  overflow: hidden;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    background: #f8fafc;
    padding: 14px 20px;
    font-size: 12.5px;
    font-weight: 700;
    color: #475569;
    text-align: left;
    border-bottom: 1px solid ${() => theme.colors.border};
  }
`;
const TableRow = styled.tr`
  cursor: pointer;
  border-bottom: 1px solid ${() => theme.colors.borderLight};
  background-color: ${(props) =>
    props.isSelected ? theme.colors.primaryLight : "transparent"};
  user-select: none;
  transition: all 0.1s;
  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background-color: ${(props) =>
      props.isSelected ? theme.colors.primaryLight : "#fafafa"};
  }
  td {
    padding: 14px 20px;
    font-size: 13.5px;
    color: ${() => theme.colors.textSub};
    vertical-align: middle;
    &.code {
      font-family: monospace;
      font-weight: 700;
      color: ${() => theme.colors.primary};
      font-size: 12.5px;
    }
    &.name {
      font-weight: 700;
      color: ${() => theme.colors.textMain};
    }
  }
  .spec-text {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    .spec-chip {
      font-family: monospace;
      font-size: 11.5px;
      font-weight: 600;
      background: #f1f5f9;
      color: #334155;
      padding: 2px 6px;
      border-radius: 4px;
    }
  }
  .imei-text {
    font-family: monospace;
    font-weight: 600;
    color: #475569;
    letter-spacing: 0.02em;
  }
  .meta-text {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
  }
  .user-cell {
    font-weight: 600;
    color: #334155;
    display: flex;
    align-items: center;
    gap: 6px;
    .u-icon {
      color: #94a3b8;
    }
    .stock {
      color: #94a3b8;
      font-weight: 500;
      font-style: italic;
    }
  }
`;
const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${(props) =>
    props.status === "사용중"
      ? "#e6f4ea"
      : props.status === "수리중"
        ? "#fee2e2"
        : "#ffeece"};
  color: ${(props) =>
    props.status === "사용중"
      ? "#137333"
      : props.status === "수리중"
        ? "#ef4444"
        : "#b06000"};
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: ${(props) =>
      props.status === "사용중"
        ? "#137333"
        : props.status === "수리중"
          ? "#ef4444"
          : "#b06000"};
  }
`;

export default AssetTable;
