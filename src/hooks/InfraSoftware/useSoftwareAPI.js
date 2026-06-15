import { Request_Get_Axios, Request_Post_Axios } from "../../API/index";
import { toast } from "../../ToastMessage/ToastManager";

export default function useSoftwareAPI() {
  const baseType = "License";

  const mainSoftwareSelectFetch = async () => {
    const request = await Request_Get_Axios(`/${baseType}/SelectSoftware`);

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  const addSoftwareFetch = async (data) => {
    const request = await Request_Post_Axios(`/${baseType}/AddSoftware`, data);
    if (!request.status) {
      alert("오류발생");
    }
  };

  const updateSoftwareFetch = async (data) => {
    const request = await Request_Post_Axios(
      `/${baseType}/UpdateSoftware`,
      data,
    );
    if (!request.status) {
      alert("오류발생");
    }
  };

  const addSoftwareVersionFetch = async (selectedSW, data) => {
    const request = await Request_Post_Axios(
      `/${baseType}/AddSoftwareVersion`,
      { selectedSW, data },
    );
    if (!request.status) {
      alert("오류발생");
    }
  };

  const updateSoftwareVersionFetch = async (selectedSW, data) => {
    const request = await Request_Post_Axios(
      `/${baseType}/UpdateSoftwareVersion`,
      { selectedSW, data },
    );
    if (!request.status) {
      alert("오류발생");
    }
  };

  const addSoftwareFileFetch = async (data, targetSW) => {
    const request = await Request_Post_Axios(
      `/${baseType}/AddSoftwareFile`,
      data,
    );
    if (!request.status) {
      alert("오류발생");
    }
  };
  const deleteSoftwareFileFetch = async (data, targetSW) => {
    const request = await Request_Post_Axios(
      `/${baseType}/DeleteSoftwareFile`,
      data,
    );
    if (!request.status) {
      return alert("오류발생");
    }
    alert("정상적으로 파기/삭제 처리되었습니다.");
  };
  const updateSoftwareFileFetch = async (data) => {
    const request = await Request_Post_Axios(
      `/${baseType}/UpdateSoftwareFile`,
      data,
    );
    if (!request.status) {
      alert("오류발생");
    }
  };
  const addSoftwarePurchaseFetch = async (data) => {
    const request = await Request_Post_Axios(
      `/${baseType}/AddSoftwarePurchase`,
      data,
    );
    if (!request.status) {
      alert("오류발생");
    }
  };

  const addSoftwareUserUsedFetch = async (
    data,
    selectedSW,
    selectedVersion,
  ) => {
    const request = await Request_Post_Axios(
      `/${baseType}/AddSoftwareUserUsed`,
      {
        data,
        selectedSW,
        selectedVersion,
      },
    );
    if (!request.status) {
      alert("오류발생");
    }
  };

  const deleteSoftwareUserUsedFetch = async (data, selectedVersion) => {
    const request = await Request_Post_Axios(
      `/${baseType}/DeleteSoftwareUserUsed`,
      {
        data,
        selectedVersion,
      },
    );
    if (!request.status) {
      return alert("오류발생");
    }
    alert("정상적으로 파기/삭제 처리되었습니다.");
  };
  const openLicenseKeyFetch = async (
    auditPayload,
    selectedSW,
    selectedVersion,
    modalTargetData,
  ) => {
    const request = await Request_Post_Axios(`/${baseType}/openLicenseKey`, {
      auditPayload,
      selectedSW,
      selectedVersion,
      modalTargetData,
    });
    if (!request.status) {
      alert("오류발생");
    }
    return request;
  };
  const addLicenseKeyFetch = async (
    auditPayload,
    selectedSW,
    selectedVersion,
    modalTargetData,
  ) => {
    const request = await Request_Post_Axios(`/${baseType}/addLicenseKey`, {
      auditPayload,
      selectedSW,
      selectedVersion,
      modalTargetData,
    });
    if (!request.status) {
      alert("오류발생");
    }
    return request;
  };
  const deleteLicenseKeyFetch = async (data) => {
    const request = await Request_Post_Axios(
      `/${baseType}/deleteLicenseKey`,
      data,
    );
    if (!request.status) {
      return alert("오류발생");
    }
    alert("정상적으로 파기/삭제 처리되었습니다.");
    return request;
  };

  const updateLicenseKeyFetch = async (
    auditPayload,
    selectedSW,
    selectedVersion,
    modalTargetData,
  ) => {
    const request = await Request_Post_Axios(`/${baseType}/updateLicenseKey`, {
      auditPayload,
      selectedSW,
      selectedVersion,
      modalTargetData,
    });
    if (!request.status) {
      alert("오류발생");
    }
    return request;
  };

  return {
    mainSoftwareSelectFetch,
    addSoftwareFetch,
    updateSoftwareFetch,
    addSoftwareVersionFetch,
    updateSoftwareVersionFetch,
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
  };
}
