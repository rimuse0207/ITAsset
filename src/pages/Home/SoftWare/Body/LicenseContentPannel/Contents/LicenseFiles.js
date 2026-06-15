import { Edit3, Layers, Plus, Trash2 } from "lucide-react";
import React from "react";
import { theme } from "../../../../Style/MainStyle";
import styled from "styled-components";
import {
  MiniActionButton,
  SectionAddButton,
  SectionBlock,
  SectionHeaderZone,
  SectionTitle,
} from "../LicenseContentPannel";
import { FileDownload } from "../../../../../../publicFunc/FileDownload/FileDownload";

const LicenseInstallFiles = ({ selectedVersion, onAction }) => {
  return (
    <SectionBlock>
      <SectionHeaderZone>
        <SectionTitle>
          <Layers size={15} /> 설치 프로그램
        </SectionTitle>
        <SectionAddButton
          onClick={() => onAction && onAction("REGISTER", "FILE")}
        >
          <Plus size={12} /> 파일 추가
        </SectionAddButton>
      </SectionHeaderZone>

      <GridCardContainer>
        {!selectedVersion.fileList || selectedVersion.fileList.length === 0 ? (
          <DownloadBoxDummy
            href="#add"
            onClick={(e) => {
              e.preventDefault();
              onAction("REGISTER", "FILE");
            }}
          >
            등록된 설치 파일이 없습니다. 새로운 설치 파일을 등록해주세요.
          </DownloadBoxDummy>
        ) : (
          selectedVersion.fileList.map((file, fIdx) => (
            <DownloadBox
              key={fIdx}
              href="#download"
              onDoubleClick={(e) => {
                e.preventDefault();
                FileDownload(e, file.filePath, file.fileName, "softwares");
              }}
            >
              <div className="file-info">
                <Layers size={18} className="file-icon" />
                <div>
                  <div className="file-name">{file.fileName}</div>
                  <div className="file-meta">
                    {file.osType || "공용"} · {file.fileSize || "Unknown Size"}
                  </div>
                </div>
              </div>
              <CardHoverActionZone>
                <MiniActionButton
                  title="파일명 수정"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction("EDIT", "FILE", file);
                  }}
                >
                  <Edit3 size={12} />
                </MiniActionButton>
                <MiniActionButton
                  title="바이너리 삭제"
                  className="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction("DELETE", "FILE", file);
                  }}
                >
                  <Trash2 size={12} />
                </MiniActionButton>
              </CardHoverActionZone>
            </DownloadBox>
          ))
        )}
      </GridCardContainer>
    </SectionBlock>
  );
};

const CardHoverActionZone = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%) scale(0.95);
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
`;

const DownloadBox = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid ${() => theme.colors.borderLight};
  border-radius: 12px;
  background: ${() => theme.colors.bg};
  cursor: pointer;
  box-sizing: border-box;
  transition: all 0.2s ease;
  .file-info {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .file-icon {
    color: ${() => theme.colors.textSub};
  }
  .file-name {
    font-size: 13.5px;
    font-weight: 700;
    color: ${() => theme.colors.textMain};
  }
  .file-meta {
    font-size: 11px;
    color: ${() => theme.colors.textMuted};
    margin-top: 3px;
    font-weight: 500;
  }
  &:hover {
    border-color: ${() => theme.colors.primary};
    background-color: ${() => theme.colors.primaryLight};
    .file-name,
    .file-icon {
      color: ${() => theme.colors.primary};
    }
    ${CardHoverActionZone} {
      opacity: 1;
      transform: translateY(-50%) scale(1);
    }
  }
`;
const DownloadBoxDummy = styled(DownloadBox)`
  border: 1px dashed ${() => theme.colors.border};
  color: ${() => theme.colors.textMuted};
  font-size: 12px;
  justify-content: center;
`;
const GridCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
`;

export default LicenseInstallFiles;
