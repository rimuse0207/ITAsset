import { Request_Get_Axios, Request_Post_Axios } from "../../API/index";
import { toast } from "../../ToastMessage/ToastManager";

export default function useConsumableAPI() {
  const baseType = "Consumable";

  const getConsumableCategories = async () => {
    const request = await Request_Get_Axios(
      `/${baseType}/getConsumableCategory`,
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  const addConsumableCategory = async (formData) => {
    const request = await Request_Post_Axios(
      `/${baseType}/addConsumableCategory`,
      formData,
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  const updateConsumableCategory = async (formData) => {
    const request = await Request_Post_Axios(
      `/${baseType}/updateConsumableCategory`,
      formData,
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };
  const deleteConsumableCategory = async (selcetId) => {
    const request = await Request_Post_Axios(
      `/${baseType}/deleteConsumableCategory`,
      { selcetId },
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 실 사용자 지급 내역 조회
  const getConsumableUserUsedList = async (selectedItem) => {
    const request = await Request_Get_Axios(`/${baseType}/getUsedUserList`, {
      selectedItem,
    });

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 실 사용자 지급 내역 추가
  const addConsumableUserUsed = async (insertData, selectedItem) => {
    const request = await Request_Post_Axios(
      `/${baseType}/addConsumableUserUsed`,
      { insertData, selectedItem },
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 실 사용자 지급 내역 변경
  const updateConsumableUserUsed = async (insertData) => {
    const request = await Request_Post_Axios(
      `/${baseType}/updateConsumableUserUsed`,
      insertData,
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 실 사용자 지급 내역 삭제
  const deleteConsumableUserUsed = async (selectId, consumableId) => {
    const request = await Request_Post_Axios(
      `/${baseType}/deleteConsumableUserUsed`,
      { selectId, consumableId },
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 구매 및 입고 내역 조회
  const getStockPurchase = async (selectedItem) => {
    const request = await Request_Get_Axios(`/${baseType}/getStockPurchase`, {
      selectedItem,
    });

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 구매 및 입고 내역 추가
  const addStockPurchase = async (formData) => {
    const request = await Request_Post_Axios(
      `/${baseType}/addStockPurchase`,
      formData,
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 구매 및 입고 내역 수정
  const updateStockPurchase = async (formData) => {
    const request = await Request_Post_Axios(
      `/${baseType}/updateStockPurchase`,
      formData,
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  // 구매 및 입고 내역 삭제
  const deleteStockPurchase = async (selectId) => {
    const request = await Request_Post_Axios(
      `/${baseType}/deleteStockPurchase`,
      { selectId },
    );

    if (!request.status) {
      alert("오류발생");
    } else {
      return request.data;
    }
  };

  return {
    getConsumableCategories,
    addConsumableCategory,
    updateConsumableCategory,
    deleteConsumableCategory,
    getConsumableUserUsedList,
    addConsumableUserUsed,
    updateConsumableUserUsed,
    deleteConsumableUserUsed,
    getStockPurchase,
    addStockPurchase,
    updateStockPurchase,
    deleteStockPurchase,
  };
}
