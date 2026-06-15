import { useState, useEffect } from "react";

export default function useSoftwareForm({
  isOpen,
  mode, // 'create' | 'edit' | 'VER_REG' | 'VER_EDIT' 등으로 분기 처리 가능
  targetSW, // 소프트웨어 마스터 데이터
  initialFormState,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(initialFormState);

  // ⚙️ useSoftwareForm.js 내부 useEffect 구역 수정

  useEffect(() => {
    console.log("targetSW", targetSW, mode);
    if (!isOpen) return;
    console.log("ADJAKLSDJK");
    // 상황 1: 배포 버전 정보 수정 모드일 때
    if (mode === "VER_EDIT" && targetSW?.versions?.[0]) {
      console.log("ADJAKLSDJK123123");
      const currentVersion = targetSW.versions[0];
      setFormData({
        versionStr: currentVersion.versionStr || "",
        releaseDate: currentVersion.releaseDate
          ? currentVersion.releaseDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
    // 상황 2: 소프트웨어 제품 마스터 정보 수정 모드일 때
    else if (mode === "SW_EDIT" && targetSW) {
      console.log(targetSW);
      setFormData({
        swCode: targetSW.swCode || "",
        swName: targetSW.swName || "",
        swVendor: targetSW.swVendor || "",
        swCategory: targetSW.swCategory || "오피스/생산성",
        totalLicenses: targetSW.totalLicenses || "",
        isLicenseRequired: targetSW.isLicenseRequired !== false,
      });
    } else {
      console.log("ADJAKLSDJK12381238");
      setFormData(initialFormState);
    }

    // 🚀 [해결 포인트]: swName과 swVendor, 카테고리의 원시 값 변화까지 추적 단추로 동봉합니다.
    // 이렇게 하면 객체 주소로 인한 무한루프는 막으면서, 첫 번째 아이템 수정 시에도 폼이 정상 초기화됩니다.
  }, [
    isOpen,
    mode,
    targetSW?.swCode,
    targetSW?.swName, // ➕ 추가
    targetSW?.swVendor, // ➕ 추가
    targetSW?.swCategory, // ➕ 추가
    targetSW?.versions?.[0]?.id,
    targetSW?.versions?.[0]?.versionStr,
  ]);
  // 1. 일반 텍스트 Input, Date, Select 요소 공통 체인저
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 2. 모달 내 관리 정책 커널 칩(Chip/Radio) 클릭 시 가동할 다이렉트 변수 체인저
  const handleDirectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. 서브밋 이벤트 핸들러 파이프라인
  const handleSubmit = (e) => {
    e.preventDefault();

    // 상위 부서나 서버 API 단으로 전송할 최종 산출물 데이터 가공 구조화
    const finalPayload = {
      ...formData,
      // 데이터 무결성 디펜스: 수량 정수화 안전장치
      totalLicenses: Number(formData.totalLicenses) || 0,
      // 상용 여부 플래그가 존재한다면 Boolean 타입 명시화 보정 강제 적용
      ...(formData.isLicenseRequired !== undefined && {
        isLicenseRequired: Boolean(formData.isLicenseRequired),
      }),
    };

    if (onSave) onSave(finalPayload);
    if (onClose) onClose();
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleDirectChange,
    handleSubmit,
  };
}
