import { useState, useEffect } from "react";

export default function useModalForm({
  isOpen,
  mode,
  targetAsset,
  initialFormState,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState(initialFormState);

  // ➕ 대량 등록 모드를 위한 가변 행 상태 (AssetFormModal 전용)
  const [targetRows, setTargetRows] = useState([
    { id: Date.now(), user: "", serial: "" },
  ]);

  // 모달이 열리거나 타겟 자산이 바뀔 때 데이터 프리셋팅 분기
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && targetAsset) {
      // 🛠️ 수정 모드 데이터 매핑
      setFormData({
        deviceType: targetAsset?.deviceType || "PC",
        name: targetAsset?.name || "",
        category: targetAsset?.category || "데스크탑/노트북",
        date: targetAsset?.date || new Date().toISOString().split("T")[0],
        specCpu: targetAsset?.specCpu || "",
        specRam: targetAsset?.specRam || "",
        specStorage: targetAsset?.specStorage || "",
        phoneNumber: targetAsset?.phoneNumber || "",
        monitorSize: targetAsset?.monitorSize || "",
      });
      setTargetRows([
        {
          id: Date.now(),
          user: targetAsset.user || "",
          serial: targetAsset.serial || "",
          memo: targetAsset?.memo || "",
        },
      ]);
    } else {
      // ➕ 등록/일반 모드 초기화
      setFormData({
        ...initialFormState,
        date: new Date().toISOString().split("T")[0],
        assignmentDate: new Date().toISOString().split("T")[0],
      });
      setTargetRows([{ id: Date.now(), user: "", serial: "" }]);
    }
  }, [isOpen, mode, targetAsset]);

  // 공통 인풋 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 공통 다이렉트 상태 체인저 (칩 선택 등)
  const handleDirectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 대량 등록 가변 행 제어 핸들러 스코프
  const handleRowChange = (id, field, value) => {
    setTargetRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };
  const addRow = () =>
    setTargetRows((prev) => [
      ...prev,
      { id: Date.now(), user: "", serial: "" },
    ]);
  const removeRow = (id) =>
    setTargetRows((prev) => prev.filter((row) => row.id !== id));

  // 공통 제출 가공 파트
  const handleSubmit = async (e, customPayloadBuilder, deviceType) => {
    e.preventDefault();

    // 모달별 가공된 페이로드 추출
    const payload = customPayloadBuilder
      ? customPayloadBuilder(formData, targetRows)
      : formData;

    if (onSave) onSave(payload, deviceType);
    if (onClose) onClose();
  };

  return {
    formData,
    setFormData,
    targetRows,
    setTargetRows,
    handleInputChange,
    handleDirectChange,
    handleRowChange,
    addRow,
    removeRow,
    handleSubmit,
  };
}
