import { useState, useEffect, useRef } from "react";
import { Request_Get_Axios, Request_Post_Axios } from "../../API";

export default function useAssetManagement(initialAssets = []) {
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [activeTab, setActiveTab] = useState("software-issue");

  const [activeModal, setActiveModal] = useState(null);

  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    asset: null,
  });
  const menuRef = useRef(null);
  useEffect(() => {
    GettingAssetData();
  }, []);

  const GettingAssetData = async () => {
    try {
      const GettingAssetData = await Request_Get_Axios("/Asset/Select");

      if (GettingAssetData.status) setAssets(GettingAssetData.data);
    } catch (error) {
      console.log(error);
    }
  };

  // 자산 폐기
  const deleteAssetData = async (asset) => {
    const request = await Request_Post_Axios(
      `/Asset/Delete/${asset.deviceType}`,
      asset,
    );
    if (request.status) return true;
    else return false;
  };

  // 1. 우측 클릭 메뉴 트리거
  const handleContextMenu = (e, asset) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      asset: asset,
    });
  };

  // 2. 컨텍스트 메뉴 바깥 클릭 시 닫기 감지
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };
    if (contextMenu.visible) {
      document.addEventListener("click", handleOutsideClick);
    }
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [contextMenu.visible]);

  // 3. 메뉴 액션 공통 처리기
  const handleMenuAction = async (action, asset) => {
    setContextMenu((prev) => ({ ...prev, visible: false }));
    if (asset) setSelectedAsset(asset);

    // 액션 타입에 따라 모달 스위칭
    switch (action) {
      case "edit":
        setActiveModal("EDIT");
        break;
      case "change-user":
        setActiveModal("REALLOCATION");
        break;
      case "repair":
        setActiveModal("REPAIR");
        break;
      case "software":
        setActiveTab("software-issue");
        // 소프트웨어 이슈 등록 모달이 따로 있다면 여기서 처리
        break;
      case "status":
        setActiveModal("STATUS");
        // 소프트웨어 이슈 등록 모달이 따로 있다면 여기서 처리
        break;
      case "delete":
        if (window.confirm(`${asset.id} 자산을 폐기하시겠습니까?`)) {
          const result = await deleteAssetData(asset);
          if (result) {
            setAssets((prev) => prev.filter((a) => a.id !== asset.id));
          } else {
            alert("오류 발생.");
          }
        }
        break;
      default:
        break;
    }
  };
  const closeModal = () => setActiveModal(null);
  const openModal = (modalType) => setActiveModal(modalType);

  const selectAsset = (asset) => {
    setSelectedAsset(asset);
    setActiveTab("software-issue");
  };

  return {
    assets,
    setAssets,
    selectedAsset,
    setSelectedAsset,
    selectAsset,
    activeTab,
    setActiveTab,
    contextMenu,
    menuRef,
    handleContextMenu,
    handleMenuAction,
    activeModal,
    openModal,
    closeModal,
    GettingAssetData,
  };
}
