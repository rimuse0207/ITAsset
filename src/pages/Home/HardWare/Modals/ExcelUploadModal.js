import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import styled from "styled-components";
import ModalLayout from "./public/ModalLayout";
import * as M from "./public/ModalStyle";
import * as XLSX from "xlsx";
import { request, Request_Post_Axios } from "../../../../API";

export const handleDownloadTemplate = () => {
  const pcHeaders = [
    [
      "관리코드(deviceKey)",
      "모델명(modelName)",
      "실사용자(currentUser)",
      "시리얼번호(serialNumber)",
      "CPU(spec_cpu)",
      "RAM(spec_ram)",
      "저장장치(spec_storage)",
      "ERP코드(erpCode)",
      "비고(memo)",
      "입고일자(purchaseDate)",
    ],
  ];

  const iphoneHeaders = [
    [
      "관리코드(deviceKey)",
      "모델명(modelName)",
      "실사용자(currentUser)",
      "시리얼번호(serialNumber)",
      "IMEI1(imeiNumber1)",
      "IMEI2(imeiNumber2)",
      "EID(eid)",
      "통신사(telecom)",
      "전화번호(phoneNumber)",
      "ERP코드(erpCode)",
      "비고(memo)",
      "입고일자(purchaseDate)",
    ],
  ];

  const monitorHeaders = [
    [
      "관리코드(deviceKey)",
      "모델명(modelName)",
      "실사용자(currentUser)",
      "시리얼번호(serialNumber)",
      "화면크기(monitorSize)",
      "ERP코드(erpCode)",
      "비고(memo)",
      "입고일자(purchaseDate)",
    ],
  ];

  const wb = XLSX.utils.book_new();
  const wsPc = XLSX.utils.aoa_to_sheet(pcHeaders);
  const wsIphone = XLSX.utils.aoa_to_sheet(iphoneHeaders);
  const wsMonitor = XLSX.utils.aoa_to_sheet(monitorHeaders);

  const colWidths = [
    { wch: 20 },
    { wch: 25 },
    { wch: 15 },
    { wch: 25 },
    { wch: 20 },
    { wch: 15 },
  ];
  wsPc["!cols"] = colWidths;
  wsIphone["!cols"] = colWidths;
  wsMonitor["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, wsPc, "PC");
  XLSX.utils.book_append_sheet(wb, wsIphone, "IPHONE");
  XLSX.utils.book_append_sheet(wb, wsMonitor, "MONITOR");

  XLSX.writeFile(wb, "IT_자산_일괄업로드_양식(카테고리_제외).xlsx");
};

export default function ExcelUploadModal({ isOpen, onClose, onSave }) {
  const [uploadMode, setUploadMode] = useState("CREATE"); // CREATE | UPDATE
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const onDownloadClick = () => {
    alert(
      "엔터프라이즈 자산 일괄 등록용 엑셀 양식(.xlsx) 다운로드를 시작합니다.\n(Sheet1: PC, Sheet2: IPHONE, Sheet3: MONITOR)",
    );
    handleDownloadTemplate(); // 🚀 파일 상단의 엑셀 생성/다운로드 로직 호출!
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!selectedFile) {
  //     alert("업로드할 엑셀 파일을 첨부해주세요.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("uploadMode", uploadMode); // 추가 모드인지 수정 모드인지 구분값
  //   formData.append("excelFile", selectedFile);
  //   const a = await uploadAssetExcelFetch(formData);
  //   if (a.status) {
  //     onSave(formData);
  //     setSelectedFile(null);
  //   }
  // };

  const uploadAssetExcelFetch = async (formData) => {
    try {
      // 🚀 파일 다운로드를 위해 커스텀 Axios 래퍼 대신 순수 fetch 사용 권장
      const response = await request.post("/Asset/uploadExcel", formData, {
        responseType: "blob",
        validateStatus: function (status) {
          return true;
        },
      });
      if (response.status === 200) {
        alert("전체 데이터가 성공적으로 처리되었습니다.");
        return { status: true };
      } else if (response.status === 400) {
        // 💥 responseType을 'blob'으로 했기 때문에, response.data 자체가 이미 Blob 파일입니다.
        const blob = response.data;

        // 🚀 엑셀 강제 다운로드 로직
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `반려데이터_리포트_${new Date().getTime()}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        alert(
          "일부 데이터 처리에 실패했습니다. 다운로드된 반려 리포트 마지막 열의 '실패 사유'를 확인 후 다시 업로드해주세요.",
        );
        return { status: false };
      } else {
        alert("서버 처리 중 오류가 발생했습니다.");
        return { status: false };
      }
    } catch (error) {
      console.error("업로드 통신 에러", error);
      alert("서버와의 통신 중 오류가 발생했습니다.");
      return { status: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("업로드할 엑셀 파일을 첨부해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("uploadMode", uploadMode);
    formData.append("excelFile", selectedFile);

    // 🚀 수정된 반환 객체 구조({ status }) 적용
    const result = await uploadAssetExcelFetch(formData);
    if (result.status) {
      onSave(formData);
      setSelectedFile(null);
    }
  };

  const titleZone = (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <FileSpreadsheet size={18} style={{ color: "#10b981" }} />
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", margin: 0 }}>
          대규모 자산 엑셀 일괄 처리
        </h2>
        <p
          style={{
            fontSize: "12px",
            color: "#10b981",
            margin: "2px 0 0 0",
            fontWeight: "600",
          }}
        >
          PC, iPhone, 모니터 대량 등록 및 수정
        </p>
      </div>
    </div>
  );

  return (
    <ModalLayout
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="560px"
      titleZone={titleZone}
    >
      <M.StyledForm onSubmit={handleSubmit}>
        <M.ModalBody style={{ padding: "28px" }}>
          {/* 1. 작업 모드 선택 */}
          <M.FormSection>
            <M.SectionLabel>일괄 처리 작업 모드 선택</M.SectionLabel>
            <ModeSelectorGrid>
              <ModeCard
                type="button"
                active={uploadMode === "CREATE"}
                onClick={() => setUploadMode("CREATE")}
              >
                <div className="radio-dot">
                  {uploadMode === "CREATE" && <div className="inner" />}
                </div>
                <div className="text-zone">
                  <div className="title">신규 자산 대량 입고 (Add)</div>
                  <div className="desc">
                    새로운 시리얼의 자산을 DB에 신규 등록합니다.
                  </div>
                </div>
              </ModeCard>
              <ModeCard
                type="button"
                active={uploadMode === "UPDATE"}
                onClick={() => setUploadMode("UPDATE")}
              >
                <div className="radio-dot">
                  {uploadMode === "UPDATE" && <div className="inner" />}
                </div>
                <div className="text-zone">
                  <div className="title">기존 자산 일괄 수정 (Update)</div>
                  <div className="desc">
                    자산 관리코드 혹은 시리얼을 기준으로 기존 정보를 덮어씁니다.
                  </div>
                </div>
              </ModeCard>
            </ModeSelectorGrid>
          </M.FormSection>

          {/* 2. 양식 다운로드 안내 */}
          <TemplateBanner>
            <AlertCircle size={16} className="info-icon" />
            <div className="info-text">
              반드시 지정된 양식을 다운로드하여 작성해 주세요.{" "}
              <b>Sheet1 (PC), Sheet2 (IPHONE), Sheet3 (MONITOR)</b> 형식으로
              구분되어 있습니다.
            </div>
            <DownloadButton type="button" onClick={onDownloadClick}>
              <Download size={14} /> 양식 다운로드
            </DownloadButton>
          </TemplateBanner>

          {/* 3. 엑셀 파일 업로드 구역 */}
          <M.FormSection style={{ marginTop: "24px", marginBottom: 0 }}>
            <M.SectionLabel>
              작성 완료된 엑셀 파일 첨부 (.xlsx){" "}
              <span className="required">*</span>
            </M.SectionLabel>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept=".xlsx, .xls, .csv"
            />

            {!selectedFile ? (
              <UploadDropZone
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={24} className="upload-icon" />
                <span className="drop-title">
                  여기를 클릭하거나 파일을 드래그하여 업로드하세요
                </span>
                <span className="drop-sub">
                  .xlsx 형식 지원 (최대 1만 건 동시 처리 가능)
                </span>
              </UploadDropZone>
            ) : (
              <FileActiveBarZone>
                <FileSpreadsheet size={16} className="file-icon" />
                <span className="file-name">{selectedFile.name}</span>
                <button
                  type="button"
                  className="clear-btn"
                  onClick={() => setSelectedFile(null)}
                >
                  <X size={14} />
                </button>
              </FileActiveBarZone>
            )}
          </M.FormSection>
        </M.ModalBody>
        <M.ModalFooter>
          <M.CancelButton type="button" onClick={onClose}>
            취소
          </M.CancelButton>
          <M.SubmitButton type="submit" style={{ background: "#10b981" }}>
            <Check size={16} /> 엑셀 데이터 서버 전송
          </M.SubmitButton>
        </M.ModalFooter>
      </M.StyledForm>
    </ModalLayout>
  );
}

// ─── 🎨 스타일 컴포넌트 ───
const ModeSelectorGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 4px;
`;
const ModeCard = styled.button`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  border: 1px solid ${(props) => (props.active ? "#10b981" : "#e2e8f0")};
  background: ${(props) => (props.active ? "#f0fdf4" : "#f8fafc")};
  transition: all 0.2s ease;
  .radio-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid ${(props) => (props.active ? "#10b981" : "#cbd5e1")};
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
    .inner {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }
  }
  .text-zone {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .title {
    font-size: 13.5px;
    font-weight: 700;
    color: ${(props) => (props.active ? "#047857" : "#334155")};
  }
  .desc {
    font-size: 12px;
    color: ${(props) => (props.active ? "#059669" : "#64748b")};
  }
  &:hover {
    border-color: ${(props) => (props.active ? "#10b981" : "#cbd5e1")};
  }
`;
const TemplateBanner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #eff6ff;
  border: 1px dashed #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  .info-icon {
    color: #3b82f6;
  }
  .info-text {
    font-size: 12.5px;
    color: #1e40af;
    line-height: 1.4;
    b {
      font-weight: 700;
      color: #1e3a8a;
    }
  }
`;
const DownloadButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 14px;
  background: #fff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #2563eb;
  cursor: pointer;
  &:hover {
    background: #dbeafe;
  }
`;
const UploadDropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  border: 2px dashed #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease-in-out;
  .upload-icon {
    color: #94a3b8;
    margin-bottom: 12px;
  }
  .drop-title {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
  }
  .drop-sub {
    font-size: 11px;
    color: #64748b;
    margin-top: 6px;
  }
  &:hover {
    background: #ecfdf5;
    border-color: #10b981;
    .upload-icon {
      color: #10b981;
    }
  }
`;
const FileActiveBarZone = styled.div`
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  background: #f0fdf4;
  height: 64px;
  gap: 10px;
  .file-icon {
    color: #059669;
    flex-shrink: 0;
  }
  .file-name {
    font-size: 13px;
    font-weight: 700;
    color: #047857;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
  .clear-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      color: #dc2626;
      background: #fee2e2;
    }
  }
`;
