import React from "react";
import styled from "styled-components";
import { theme } from "../../../../../../Style/MainStyle";
import { FileText, Image, User } from "lucide-react";

const SWRepair = ({ selectedAsset }) => {
  return (
    <BoardContainer>
      {selectedAsset.softwareIssues.map((issue, idx) => (
        <BoardCard key={idx}>
          <BoardHeader>
            <span className="issue-date">{issue.date}</span>
            <span className="issue-operator">
              <User size={12} /> {issue.operator}
            </span>
          </BoardHeader>
          <BoardTitle>{issue.title}</BoardTitle>
          <BoardContent>{issue.content}</BoardContent>

          {/* 이미지 및 첨부파일 영역 */}
          {issue.attachments.length > 0 && (
            <AttachmentZone>
              {issue.attachments.map((file, fIdx) =>
                file.type === "image" ? (
                  <ImagePreviewCard key={fIdx}>
                    <img src={file.url} alt="첨부 이미지" />
                    <div className="img-info">
                      <Image size={12} /> {file.name}
                    </div>
                  </ImagePreviewCard>
                ) : (
                  <FileLink key={fIdx} href="#log">
                    <FileText size={14} /> <span>{file.name}</span>
                  </FileLink>
                ),
              )}
            </AttachmentZone>
          )}
        </BoardCard>
      ))}
    </BoardContainer>
  );
};

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const BoardCard = styled.div`
  background: ${() => theme.colors.white};
  border: 1px solid ${() => theme.colors.border};
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
`;
const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: ${() => theme.colors.textMuted};
  font-weight: 500;
  .issue-operator {
    display: flex;
    align-items: center;
    gap: 4px;
    color: ${() => theme.colors.textSub};
  }
`;
const BoardTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  color: ${() => theme.colors.textMain};
  margin: 8px 0;
  line-height: 1.3;
`;
const BoardContent = styled.p`
  font-size: 13px;
  color: ${() => theme.colors.textSub};
  line-height: 1.5;
  white-space: pre-wrap;
`;

const AttachmentZone = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px dashed ${() => theme.colors.border};
  padding-top: 12px;
`;

const ImagePreviewCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${() => theme.colors.border};
  img {
    width: 100%;
    height: 140px;
    object-fit: cover;
  }
  .img-info {
    font-size: 11px;
    padding: 6px 10px;
    background: ${() => theme.colors.bg};
    color: ${() => theme.colors.textSub};
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const FileLink = styled.a`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: ${() => theme.colors.bg};
  border-radius: 6px;
  font-size: 12px;
  color: ${() => theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  border: 1px solid ${() => theme.colors.borderLight};
  &:hover {
    background: ${() => theme.colors.primaryLight};
  }
`;

export default SWRepair;
