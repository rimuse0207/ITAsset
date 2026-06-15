import { Request_Post_Axios } from "../../API/index";
import { toast } from "../../ToastMessage/ToastManager";

export default function useAssetAPI() {
  const assetAddFetch = async (data, dataType) => {
    const request = await Request_Post_Axios(`/Asset/Add/${dataType}`, data);
    if (!request.status) {
      alert("오류발생");
    }
  };
  const assetUpdateFetch = async (data, dataType) => {
    const request = await Request_Post_Axios(`/Asset/Update/${dataType}`, data);
    if (!request.status) {
      alert("오류발생");
    }
  };
  const assetChangeUserFetch = async (data, dataType) => {
    const request = await Request_Post_Axios(
      `/Asset/User/Update/${dataType}`,
      data,
    );
    if (!request.status) {
      alert("오류발생");
    }
  };
  const saveAssetRepairHistoryFetch = async (log) => {
    const request = await Request_Post_Axios("/Asset/Save_Repair_History", log);
    if (!request.status) {
      alert("오류발생");
    }
  };
  const assetStatusUpdateFetch = async (data, SelectData) => {
    const request = await Request_Post_Axios("/Asset/Status_Update", {
      data,
      SelectData,
    });
    if (!request.status) {
      alert("오류발생");
    }
  };
  return {
    assetAddFetch,
    assetUpdateFetch,
    assetChangeUserFetch,
    saveAssetRepairHistoryFetch,
    assetStatusUpdateFetch,
  };
}
