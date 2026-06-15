const FileDownload = async (e, fileName, originalFileName, fileTargets) => {
  e.preventDefault();

  try {
    const downloadUrl = `${process.env.REACT_APP_DB_HOST}/API/ITInfra/License/DownloadSoftwareFile?fileName=${encodeURIComponent(fileName)}&fileTargets=${fileTargets}`;

    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("서버 파일 다운로드 실패");

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", originalFileName); // 저장될 파일명 지정
    document.body.appendChild(link);
    link.click();

    // 가상 메모리 해제 청소
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(error);
    alert("설치 파일 다운로드에 실패했습니다. 네트워크 상태를 확인하세요.");
  }
};

export { FileDownload };
