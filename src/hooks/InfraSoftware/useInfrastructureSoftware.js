import { useState, useEffect } from "react";
import useSoftwareAPI from "./useSoftwareAPI";
import { REGISTER } from "redux-persist";

export default function useInfrastructureSoftware() {
  const [activeModal, setActiveModal] = useState(null);
  const [modalTargetData, setModalTargetData] = useState(null);

  const [softwareList, setSoftwareList] = useState([
    {
      swCode: "SW-001",
      swName: "Microsoft 365 Apps",
      swVendor: "Microsoft",
      swCategory: "오피스/생산성",
      isLicenseRequired: true,
      totalLicenses: 150,
      usedLicenses: 124,
      versions: [
        {
          id: "VER-365-01",
          versionStr: "v16.0.17 (최신)",
          releaseDate: "2026-03-01",
          totalPurchasedLicenses: 150,
          purchaseList: [],
          fileList: [],
          licenseKeys: [],
          users: [],
        },
      ],
    },
    {
      swCode: "SW-002",
      swName: "Microsoft 365 Apps",
      swVendor: "Microsoft",
      swCategory: "오피스/생산성",
      isLicenseRequired: false,
      totalLicenses: 150,
      usedLicenses: 124,
      versions: [
        {
          id: "VER-365-01",
          versionStr: "v16.0.17 (최신)",
          releaseDate: "2026-03-01",
          totalPurchasedLicenses: 150,
          purchaseList: [],
          fileList: [],
          licenseKeys: [],
          users: [],
        },
      ],
    },
  ]);

  const [selectedSW, setSelectedSW] = useState(
    softwareList[0] ? softwareList[0] : null,
  );
  const [selectedVersion, setSelectedVersion] = useState(
    softwareList[0].versions[0] ? softwareList[0].versions[0] : null,
  );
  const [isKeyUnlocked, setIsKeyUnlocked] = useState(false);
  const [showRawKey, setShowRawKey] = useState(false);

  const {
    addSoftwareFetch,
    updateSoftwareFetch,
    addSoftwareVersionFetch,
    mainSoftwareSelectFetch,
    addSoftwareFileFetch,
    updateSoftwareFileFetch,
    addSoftwarePurchaseFetch,
    addSoftwareUserUsedFetch,
    openLicenseKeyFetch,
    addLicenseKeyFetch,
    updateLicenseKeyFetch,
    deleteSoftwareUserUsedFetch,
    deleteLicenseKeyFetch,
    deleteSoftwareFileFetch,
  } = useSoftwareAPI();

  useEffect(() => {
    selectBaseSoftwareData();
  }, []);

  const selectBaseSoftwareData = async () => {
    const result = await mainSoftwareSelectFetch();

    if (result && result.length > 0) {
      setSoftwareList(result);

      setSelectedSW((prevSW) => {
        const currentSw =
          result.find((item) => item.swCode === prevSW?.swCode) || result[0];

        setSelectedVersion((prevVersion) => {
          const currentVersion =
            currentSw.versions?.find((v) => v.id === prevVersion?.id) ||
            currentSw.versions?.[0] ||
            null;

          return currentVersion;
        });

        return currentSw;
      });
    }
  };

  const handleSWSelect = (sw) => {
    setSelectedSW(sw);
    setSelectedVersion(sw.versions?.[0] || null);
    setIsKeyUnlocked(false);
    setShowRawKey(false);
  };

  const handleVerifySecurity = () => {
    const password = prompt(
      "보안 자산 접근을 위해 IT 최고 관리자 인증 비밀번호를 입력하세요:",
    );
    if (password === "admin") {
      setIsKeyUnlocked(true);
    } else {
      alert(
        "보안 인증에 실패했습니다. 올바른 사내 관리 권한 비밀번호를 입력하세요.",
      );
    }
  };

  const handleContentAction = (actionType, dataType, data, selectedVersion) => {
    setModalTargetData(data);
    if (actionType === "DELETE") {
      executeDeleteAction(dataType, data, selectedVersion);
      return;
    }

    const modalMapping = {
      MSTR: { REGISTER: "SW_REG", EDIT: "SW_EDIT" },
      VERSION: { REGISTER: "VER_REG", EDIT: "VER_EDIT" },
      FILE: { REGISTER: "CRED_REG", EDIT: "CRED_EDIT" },
      KEY: { REGISTER: "KEY_REG", EDIT: "KEY_EDIT" },
      USER: { REGISTER: "USER_REG", EDIT: "USER_EDIT" },
      PURCHASE: { REGISTER: "PURCHASE_REG", EDIT: "PURCHASE_EDIT" },
      VIEW_VERIFY: { VIEW_VERIFY: "VIEW_VERIFY", EDIT: "VIEW_VERIFY" },
    };

    const targetScope = modalMapping[dataType];

    if (targetScope && targetScope[actionType]) {
      setActiveModal(targetScope[actionType]);
    }
  };

  const executeDeleteAction = async (dataType, data, selectedVersion) => {
    const messages = {
      FILE: `설치 파일 [${data.fileName}]을 삭제하시겠습니까?`,
      KEY: `제품 인증 키 [${data.keyStr}]를 삭제하시겠습니까?`,
      USER: `임직원 [${data.departmentName} ${data.fullName} ${data.titleName}]의 라이선스 할당을 회수(만료) 처리하시겠습니까?`,
      PURCHASE: `[${data.contractName}] 라이선스 취득 계약 건을 영구 파기하시겠습니까?\n파기 시 보유 수량에서 [-${data.licenseCount} Copy]가 전산 제외됩니다.`,
    };

    if (window.confirm(messages[dataType])) {
      if (dataType === "FILE") {
        await deleteSoftwareFileFetch(data);
      } else if (dataType === "KEY") {
        await deleteLicenseKeyFetch(data);
      } else if (dataType === "USER") {
        await deleteSoftwareUserUsedFetch(data, selectedVersion);
      } else if (dataType === "PURCHASE") {
      }
    }
    await selectBaseSoftwareData();
    setModalTargetData(null);
  };

  const handleDecryptSuccess = async (
    auditPayload,
    currentSW,
    currentVersion,
    targetKey,
  ) => {
    try {
      const response = await openLicenseKeyFetch(
        auditPayload,
        currentSW,
        currentVersion,
        targetKey,
      );

      if (!response || !response.status) {
        alert(response?.message || "라이선스 복호화 서버 인증에 실패했습니다.");
        return false;
      }

      const serverDecryptedKeyStr = response.data;

      await selectBaseSoftwareData();

      setSelectedVersion((prevVersion) => {
        if (!prevVersion) return null;

        return {
          ...prevVersion,
          licenseKeys: prevVersion.licenseKeys.map((keyObj) => {
            if (keyObj.id === targetKey?.id) {
              return {
                ...keyObj,
                keyStr: serverDecryptedKeyStr,
                viewUnlocked: true,
              };
            }
            return keyObj;
          }),
        };
      });

      return true;
    } catch (error) {
      console.error("복호화 데이터 파이프라인 연동 치명적 실패:", error);
      alert("서버 통신 중 오류가 발생했습니다. 인프라 로그를 확인하세요.");
      return false;
    }
  };

  return {
    activeModal,
    setActiveModal,
    modalTargetData,
    setModalTargetData,
    softwareList,
    selectedSW,
    selectedVersion,
    setSelectedVersion,
    isKeyUnlocked,
    setIsKeyUnlocked,
    showRawKey,
    setShowRawKey,
    handleSWSelect,
    handleVerifySecurity,
    handleContentAction,
    addSoftwareFetch,
    updateSoftwareFetch,
    addSoftwareVersionFetch,
    selectBaseSoftwareData,
    addSoftwareFileFetch,
    updateSoftwareFileFetch,
    addSoftwarePurchaseFetch,
    addSoftwareUserUsedFetch,
    openLicenseKeyFetch,
    handleDecryptSuccess,
    addLicenseKeyFetch,
    updateLicenseKeyFetch,
  };
}
