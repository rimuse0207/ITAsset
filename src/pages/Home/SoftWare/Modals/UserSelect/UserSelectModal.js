import React, { useEffect, useState } from "react";
import { Request_Get_Axios } from "../../../../../API";
import styled from "styled-components";
import { Laptop, Cpu, HardDrive, FileText } from "lucide-react";

const UserSelectModal = ({ isOpen, onClose, userCode, userName, onSelect }) => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    if (isOpen) {
      handleGettingItAssetData();
    }
  }, [isOpen, userCode]);

  const handleGettingItAssetData = async () => {
    if (!isOpen || !userCode) return;
    try {
      const GettingAssetData = await Request_Get_Axios(
        "/Asset/Select/userPicker",
        { userCode },
      );
      if (GettingAssetData.status) setAssets(GettingAssetData.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;

  return (
    <SubModalOverlay onClick={onClose}>
      <SubModalContent onClick={(e) => e.stopPropagation()}>
        <SubHeader>
          <Laptop size={16} style={{ color: "#2563eb" }} />
          <span>{userName} 님의 등록 된 기기 선택</span>
        </SubHeader>

        <AssetList>
          {assets.length > 0 ? (
            assets.map((as) => (
              <AssetItem
                key={as.id}
                onClick={() => {
                  onSelect(as.id);
                  onClose();
                }}
              >
                {/* 1. 상단 라인: 자산코드 및 카테고리 태그 */}
                <AssetCardHeader>
                  <span className="as-id">{as.id}</span>
                  <span className="as-tag">{as.category || "장비"}</span>
                </AssetCardHeader>

                {/* 2. 중단 라인: 모델명 */}
                <AssetModelName>
                  {as.modelName || "모델명 정보 없음"}
                </AssetModelName>

                {(as.specCpu || as.specRam || as.specStorage) && (
                  <SpecBadgeGrid>
                    {as.specCpu && (
                      <div className="spec-chip" title="CPU">
                        <Cpu size={11} />
                        <span>{as.specCpu}</span>
                      </div>
                    )}
                    {as.specRam && (
                      <div className="spec-chip" title="RAM">
                        <Laptop size={11} />
                        <span>{as.specRam}</span>
                      </div>
                    )}
                    {as.specStorage && (
                      <div className="spec-chip" title="Storage">
                        <HardDrive size={11} />
                        <span>{as.specStorage}</span>
                      </div>
                    )}
                  </SpecBadgeGrid>
                )}

                {as.memo && (
                  <AssetMemoRowZone>
                    <FileText size={11} className="memo-icon" />
                    <span className="memo-txt" title={as.memo}>
                      {as.memo}
                    </span>
                  </AssetMemoRowZone>
                )}
              </AssetItem>
            ))
          ) : (
            <EmptyMsg>할당된 하드웨어 자산이 없습니다.</EmptyMsg>
          )}
        </AssetList>
        <SubCloseBtn type="button" onClick={onClose}>
          닫기
        </SubCloseBtn>
      </SubModalContent>
    </SubModalOverlay>
  );
};

export default UserSelectModal;

const SubModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.4); /* 핏 네이비 스케일 암막 */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999; /* 하이어라키 락 해제 */
`;

const SubModalContent = styled.div`
  background: #fff;
  width: 360px; /* 사양 노출을 위해 너비 20px 상향 최적화 */
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.15);
`;

const SubHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 16px;
`;

const AssetList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 340px; /* 정보가 늘어났으므로 유연하게 스크롤 존 확장 */
  overflow-y: auto;
  padding-right: 2px;
  padding-top: 10px;
`;

const AssetItem = styled.div`
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;

  &:hover {
    background: #fff;
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);
    transform: translateY(-1px);
  }
`;

/* 자산 상단 인덱스 플래그 레이아웃 */
const AssetCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .as-id {
    font-size: 11.5px;
    font-weight: 700;
    color: #2563eb;
    font-family: monospace;
    letter-spacing: 0.02em;
  }
  .as-tag {
    font-size: 10px;
    font-weight: 700;
    background: #e0f2fe;
    padding: 2px 6px;
    border-radius: 4px;
    color: #0369a1;
  }
`;

/* 기기 모델명 프레임 */
const AssetModelName = styled.div`
  font-size: 13.5px;
  font-weight: 700;
  color: #334155;
  margin-top: 6px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SpecBadgeGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;

  .spec-chip {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 6px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    color: #475569;
    font-size: 10.5px;
    font-weight: 600;

    svg {
      color: #94a3b8;
    }
  }
`;

const AssetMemoRowZone = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  margin-top: 2px;
  box-sizing: border-box;
  width: 100%;

  .memo-icon {
    color: #64748b;
    flex-shrink: 0;
  }

  .memo-txt {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SubCloseBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #fff;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
  transition: all 0.1s ease;
  &:hover {
    background: #f1f5f9;
    color: #1e293b;
    border-color: #cbd5e1;
  }
`;

const EmptyMsg = styled.div`
  text-align: center;
  padding: 32px 0;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
`;
