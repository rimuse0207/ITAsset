import React from "react";
import { Filter, Search, RotateCcw, Download } from "lucide-react";
import styled from "styled-components";
import { theme } from "../../Style/MainStyle";
import * as XLSX from "xlsx";

const FilterBar = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  openModal,
  hasAdvanced,
  onResetAdvanced,
  processedAssets = [],
}) => {
  const handleExportExcel = () => {
    if (processedAssets.length === 0) {
      alert("다운로드할 자산 데이터가 없습니다.");
      return;
    }

    // 1. 기종별 데이터 분류
    const pcAssets = processedAssets.filter((a) => a.deviceType === "PC");
    const iphoneAssets = processedAssets.filter(
      (a) => a.deviceType === "IPHONE",
    );
    const monitorAssets = processedAssets.filter(
      (a) => a.deviceType === "MONITOR",
    );

    // 2. 실사용자 이름 정제 함수
    const formatUser = (asset) => {
      if (!asset.user || asset.user === "-" || asset.user === "재고") return "";
      return `${asset.departmentName || ""} ${asset.fullName || ""} ${asset.titleName || ""}`.trim();
    };

    // 3. 시트별 JSON 데이터 매핑
    const pcData = pcAssets.map((a) => ({
      관리코드: a.id,
      모델명: a.name,
      실사용자: formatUser(a),
      시리얼번호: a.serial,
      CPU: a.specCpu,
      RAM: a.specRam,
      저장장치: a.specStorage,
      ERP코드: a.erpCode,
      비고: a.memo,
      등록일자: a.date,
      기기상태: a.status,
      카테고리: a.category,
    }));

    const iphoneData = iphoneAssets.map((a) => ({
      관리코드: a.id,
      모델명: a.name,
      실사용자: formatUser(a),
      시리얼번호: a.serial,
      IMEI1: a.imei1,
      IMEI2: a.imei2,
      EID: a.eid,
      전화번호: a.phoneNumber,
      ERP코드: a.erpCode,
      비고: a.memo,
      등록일자: a.date,
      기기상태: a.status,
      카테고리: a.category,
    }));

    const monitorData = monitorAssets.map((a) => ({
      관리코드: a.id,
      모델명: a.name,
      실사용자: formatUser(a),
      시리얼번호: a.serial,
      화면크기: a.monitorSize,
      ERP코드: a.erpCode,
      비고: a.memo,
      등록일자: a.date,
      기기상태: a.status,
      카테고리: a.category,
    }));

    // 4. 워크시트 생성
    const wb = XLSX.utils.book_new();
    const wsPc = XLSX.utils.json_to_sheet(pcData);
    const wsIphone = XLSX.utils.json_to_sheet(iphoneData);
    const wsMonitor = XLSX.utils.json_to_sheet(monitorData);

    // 컬럼 너비 최적화
    const colWidths = [
      { wch: 18 },
      { wch: 25 },
      { wch: 15 },
      { wch: 18 },
      { wch: 22 },
      { wch: 15 },
      { wch: 12 },
    ];
    wsPc["!cols"] = colWidths;
    wsIphone["!cols"] = colWidths;
    wsMonitor["!cols"] = colWidths;

    XLSX.utils.book_append_sheet(wb, wsPc, "PC");
    XLSX.utils.book_append_sheet(wb, wsIphone, "IPHONE");
    XLSX.utils.book_append_sheet(wb, wsMonitor, "MONITOR");

    // 5. 파일명에 오늘 날짜 조합하여 다운로드
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    XLSX.writeFile(wb, `IT자산_목록_추출_${today}.xlsx`);
  };

  return (
    <FilterBarMain>
      <SearchWrapper>
        <SearchIcon size={18} />
        <SearchInput
          type="text"
          placeholder="자산 코드, 시리얼, 사용자 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SearchWrapper>

      <RightControlBoxGrid>
        <SelectCombo
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">전체 운영상태</option>
          <option value="사용중">사용중</option>
          <option value="재고">재고</option>
          <option value="고장">고장</option>
          <option value="수리중">수리중</option>
        </SelectCombo>

        <SelectCombo value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="LATEST">최근 입고 순</option>
          <option value="CODE">자산 코드 순</option>
        </SelectCombo>

        <OutlineButton active={hasAdvanced} onClick={openModal}>
          <Filter size={16} />
          <span>상세조건 필터</span>
        </OutlineButton>

        <ExportExcelButton
          onClick={handleExportExcel}
          title="현재 화면의 데이터를 엑셀로 내보냅니다."
        >
          <Download size={16} />
          <span>목록 추출</span>
        </ExportExcelButton>

        {hasAdvanced && (
          <ResetAdvancedBadge
            onClick={onResetAdvanced}
            title="고급 필터 조건 초기화"
          >
            <RotateCcw size={12} /> 전체 초기화
          </ResetAdvancedBadge>
        )}
      </RightControlBoxGrid>
    </FilterBarMain>
  );
};

/* --- 🎨 스타일 영역 --- */
const FilterBarMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const SearchWrapper = styled.div`
  position: relative;
  width: 320px;
`;
const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 12px;
  color: ${() => theme.colors.textMuted};
`;
const SearchInput = styled.input`
  width: 100%;
  padding: 11px 14px 11px 42px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  font-size: 13.5px;
  background-color: ${() => theme.colors.white};
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;
const RightControlBoxGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const SelectCombo = styled.select`
  padding: 10px 12px;
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  background-color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  color: ${() => theme.colors.textSub};
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${() => theme.colors.primary};
  }
`;
const OutlineButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: 1px solid
    ${(props) => (props.active ? "#2563eb" : theme.colors.border)};
  background-color: ${(props) =>
    props.active ? "#eff6ff" : theme.colors.white};
  color: ${(props) => (props.active ? "#2563eb" : theme.colors.textSub)};
  border-radius: 12px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    border-color: #2563eb;
    color: #2563eb;
  }
`;

// 🚀 엑셀 내보내기 전용 초록색 버튼 스타일
const ExportExcelButton = styled(OutlineButton)`
  border-color: #10b981;
  color: #059669;
  background-color: #f0fdf4;
  &:hover {
    background-color: #d1fae5;
    border-color: #059669;
    color: #047857;
  }
`;

const ResetAdvancedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  &:hover {
    background: #fee2e2;
    color: #ef4444;
    border-color: #fca5a5;
  }
`;

export default FilterBar;
