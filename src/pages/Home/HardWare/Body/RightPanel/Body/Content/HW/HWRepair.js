import React from "react";
import { theme } from "../../../../../../Style/MainStyle";
import styled from "styled-components";
import { Download, FileText, Wrench, Coins, Image } from "lucide-react";
import moment from "moment";

const HWRepair = ({ selectedAsset }) => {
  // 🚀 확장자 판별 가속 유틸 함수 (이미지 포맷 필터링)
  const isImageFile = (fileName) => {
    if (!fileName) return false;
    const allowedExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
    const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
    return allowedExtensions.includes(ext);
  };

  const handleDownload = async (fileNamePath, originalName) => {
    if (!fileNamePath) return;

    const fileUrl = `${process.env.REACT_APP_DB_HOST}/itasset/hardwares/${fileNamePath}`;

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", originalName || "품의서_다운로드.pdf");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("파일 다운로드 중 에러 발생:", error);
      window.open(fileUrl, "_blank");
    }
  };

  if (
    !selectedAsset?.repairHistories ||
    selectedAsset.repairHistories.length === 0
  ) {
    return (
      <EmptyZone>
        <Wrench size={18} style={{ color: "#cbd5e1" }} />
        <span>하드웨어 정비/수리 내역이 존재하지 않습니다.</span>
      </EmptyZone>
    );
  }

  return (
    <Timeline>
      {selectedAsset.repairHistories.map((repair, idx) => {
        // 복합 바인딩용 변수 선언 표준화
        const filePath = repair.proposal_file_path || repair.proposalFilePath;
        const fileName = repair.proposal_file_name || repair.proposalFileName;
        const isImg = isImageFile(filePath || fileName);

        return (
          <TimelineItem key={idx}>
            <TimelineLine />
            <TimelineNode color={theme.colors.error} />
            <TimelineContent>
              {/* 상단 헤더 영역 (날짜 / 정비 주체) */}
              <div className="time-header">
                <span className="time-date">
                  {repair.date ||
                    moment(repair.repairDate).format("YYYY년 MM월 DD일")}
                </span>
                <span className="time-tech">{repair.technician}</span>
              </div>

              {/* 메인 정비 조치 타이틀 */}
              <div className="time-title">{repair.title}</div>

              {/* 수리 비용 배지 바 */}
              {repair.repair_cost > 0 && (
                <CostBadgeBar>
                  <Coins size={13} className="cost-icon" />
                  <span className="cost-label">정비 비용</span>
                  <span className="cost-value">
                    {repair.repair_cost.toLocaleString()}원
                  </span>
                </CostBadgeBar>
              )}

              {/* 상세 조치 내용 박스 */}
              <DescriptionBox>
                {repair.desc || repair.description}
              </DescriptionBox>

              {/* ─── 🚀 [분기 구역 1]: 첨부파일이 '이미지'일 때 렌더링할 미리보기 영역 ─── */}
              {filePath && isImg && (
                <ImagePreviewContainer
                  onClick={() => handleDownload(filePath, fileName)}
                  title="클릭하시면 원본 이미지를 다운로드합니다."
                >
                  <img
                    src={`${process.env.REACT_APP_DB_HOST}/itasset/hardwares/${filePath}`}
                    alt={fileName || "정비 증빙 사진"}
                    className="preview-img"
                  />
                  <ImageHoverOverlay>
                    <Image size={18} />
                    <span>원본 다운로드</span>
                  </ImageHoverOverlay>
                </ImagePreviewContainer>
              )}

              {/* ─── 🚀 [분기 구역 2]: 첨부파일이 '일반 파일(PDF 등)'일 때만 기존 다운로드 바 노출 ─── */}
              {filePath && !isImg && (
                <FileAttachmentBar
                  onClick={() => handleDownload(filePath, fileName)}
                  title={fileName || "품의서 다운로드"}
                >
                  <div className="file-info-side">
                    <FileText size={14} className="f-icon" />
                    <span className="file-title-text">
                      {fileName || "첨부 품의서 확인"}
                    </span>
                  </div>
                  <DownloadBtnZone>
                    <Download size={12} />
                    <span>다운로드</span>
                  </DownloadBtnZone>
                </FileAttachmentBar>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

/* ─── 🎨 관제 레이아웃 & 이미지 프리뷰 컴포넌트 스타일 ─── */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`;
const TimelineItem = styled.div`
  display: flex;
  position: relative;
  padding-bottom: 28px;
  &:last-child {
    padding-bottom: 0;
  }
`;
const TimelineLine = styled.div`
  position: absolute;
  left: 6px;
  top: 14px;
  bottom: -6px;
  width: 2px;
  background: ${() => theme.colors.borderLight};
  ${TimelineItem}:last-child & {
    display: none;
  }
`;
const TimelineNode = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${(props) => props.color};
  border: 3px solid ${() => theme.colors.white};
  box-shadow: 0 0 0 1px ${(props) => props.color};
  z-index: 2;
  margin-top: 4px;
`;
const TimelineContent = styled.div`
  margin-left: 16px;
  flex: 1;
  overflow: hidden;
  .time-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .time-date {
    font-size: 12px;
    font-weight: 700;
    color: ${() => theme.colors.textMuted};
    font-family: monospace;
  }
  .time-tech {
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 2px 8px;
    border-radius: 6px;
  }
  .time-title {
    font-size: 14.5px;
    font-weight: 700;
    color: #0f172a;
    line-height: 1.3;
  }
`;
const CostBadgeBar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding: 3px 8px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  .cost-icon {
    color: #d97706;
  }
  .cost-label {
    font-size: 11px;
    font-weight: 600;
    color: #b45309;
  }
  .cost-value {
    font-size: 11.5px;
    font-weight: 700;
    color: #78350f;
    font-family: monospace;
  }
`;
const DescriptionBox = styled.div`
  font-size: 13px;
  color: #475569;
  margin-top: 8px;
  line-height: 1.5;
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  white-space: pre-wrap;
`;

/* 🚀 사내 증빙 사진 뷰어 프레임 */
const ImagePreviewContainer = styled.div`
  position: relative;
  margin-top: 10px;
  max-width: 280px; /* 라이트 오버레이 패널 핏에 최적화된 컴팩트 크기 */
  max-height: 180px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  background: #f8fafc;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  .preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지 비율 깨짐 없이 크롭 적재 */
    display: block;
    transition: transform 0.2s ease-in-out;
  }

  &:hover .preview-img {
    transform: scale(1.03); /* 호버 시 약간의 줌인 애니메이션 */
  }
`;

/* 🚀 이미지 마우스 오버레이 효과 */
const ImageHoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6); /* 모던한 다크 딤 처리 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.15s ease-in-out;

  ${ImagePreviewContainer}:hover & {
    opacity: 1; /* 마우스 올렸을 때만 스무스하게 켜짐 */
  }
`;

const FileAttachmentBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  gap: 12px;
  transition: all 0.15s ease-in-out;
  .file-info-side {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
    .f-icon {
      color: #64748b;
      flex-shrink: 0;
    }
  }
  .file-title-text {
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    .file-title-text {
      color: #2563eb;
    }
    .f-icon {
      color: #2563eb;
    }
  }
`;
const DownloadBtnZone = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  background: #fff;
  padding: 4px 8px;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(37, 99, 235, 0.04);
  flex-shrink: 0;
`;
const EmptyZone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 0;
  font-size: 12.5px;
  color: #94a3b8;
  font-weight: 500;
`;

export default HWRepair;
