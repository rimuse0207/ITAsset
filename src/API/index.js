import axios from "axios";
import { toast } from "../ToastMessage/ToastManager";
import { useDispatch } from "react-redux";
import {
  Now_Loader_Info,
  Now_Loader_Info_Initial,
} from "../Models/LoaderReducer/LoaderReducer";
import { useCallback } from "react";

export const request = axios.create({
  baseURL: `${process.env.REACT_APP_DB_HOST}/API/ITInfra`,
});
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Token"); // 최신 Token 가져오기
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const Request_Post_Axios = async (path, data) => {
  try {
    const Post_Axios = await request.post(path, data, {
      validateStatus: function (status) {
        return true; // 모든 status를 성공으로 간주
      },
    });

    switch (Post_Axios.status) {
      // 데이터 성공
      case 200: {
        return {
          message: Post_Axios.data.message,
          data: Post_Axios.data.data,
          status: true,
        };
      }
      case 500: {
        return {
          message: `서버오류 발생.`,
          data: [],
          status: false,
        };
      }

      //요청의 구문이 잘못 됨
      case 400:
      case 403:
      case 404: {
        toast.show({
          title: `${Post_Axios.data.message}`,
          successCheck: false,
          duration: 6000,
        });
        return {
          data: [],
          status: false,
          message: Post_Axios.data.message,
        };
      }
      // 토큰이 없음
      case 600:
        localStorage.clear();
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return { message: "세션 만료", data: [], status: false }; // 👈 반드시 return 추가!

      default:
        // 정의되지 않은 모든 상태 코드에 대한 처리
        return {
          message: `알 수 없는 상태 코드: ${Post_Axios.status}`,
          data: [],
          status: false,
        };
    }
  } catch (error) {
    console.error("Request_Get_Axios Catch:", error);
    // 에러 발생 시에도 호출부가 멈추지 않게 status: false 객체 반환
    return { message: error.message, data: [], status: false };
  }
};

export const Request_Get_Axios = async (path, params) => {
  try {
    const Get_Axios = await request.get(path, {
      params: params,
      validateStatus: function (status) {
        return true; // 모든 status를 성공으로 간주
      },
    });

    switch (Get_Axios.status) {
      // 데이터 성공
      case 200: {
        return {
          message: Get_Axios.data.message,
          data: Get_Axios.data.data,
          status: true,
        };
      }
      case 500: {
        return {
          message: `서버오류 발생.`,
          data: [],
          status: false,
        };
      }

      //요청의 구문이 잘못 됨
      case 400:
      case 403:
      case 404: {
        return {
          data: [],
          status: false,
          message: Get_Axios.data.message,
        };
      }
      // 토큰이 없음
      case 600:
        localStorage.clear();
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return { message: "세션 만료", data: [], status: false }; // 👈 반드시 return 추가!

      default:
        // 정의되지 않은 모든 상태 코드에 대한 처리
        return {
          message: `알 수 없는 상태 코드: ${Get_Axios.status}`,
          data: [],
          status: false,
        };
    }
  } catch (error) {
    console.error("Request_Get_Axios Catch:", error);
    // 에러 발생 시에도 호출부가 멈추지 않게 status: false 객체 반환
    return { message: error.message, data: [], status: false };
  }
};

export const useMealFetch = () => {
  const dispatch = useDispatch();
  dispatch(Now_Loader_Info_Initial());
  const fetchWithLoader = useCallback(
    async (apiFunc) => {
      dispatch(Now_Loader_Info());
      try {
        const result = await apiFunc();
        return result;
      } finally {
        dispatch(Now_Loader_Info_Initial());
      }
    },
    [dispatch],
  );

  return { fetchWithLoader };
};
