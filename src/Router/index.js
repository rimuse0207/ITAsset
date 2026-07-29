import React, { useState } from "react";
import {
  Route,
  Routes,
  Router,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import LoginMainPage from "../pages/Login/LoginMainPage";
import LoginRoute from "./LoginRoute/LoginRouteMainPage";
import InfrastructureAssets from "../pages/Home/HardWare/InfrastructureAssets";
import InfrastructureSoftware from "../pages/Home/SoftWare/InfrastructureSoftware";
import { useSelector } from "react-redux";
import HelpDeskManage from "../pages/Home/HelpDesk/HelpDeskManage";
import EveryOnePublicTicket from "../pages/Home/HelpDesk/EveryOne/EveryOnePublicTicket";

const RouterMainPage = () => {
  const User_Info = useSelector(
    (state) => state.Login_Info_Reducer_State.Login_Info,
  );
  const [RouterInfo, setRouterInfo] = useState([
    {
      path: "/",
      element: <LoginMainPage></LoginMainPage>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/asset",
      element: <InfrastructureAssets></InfrastructureAssets>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/software",
      element: <InfrastructureSoftware></InfrastructureSoftware>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/helpdesk",
      element: <HelpDeskManage></HelpDeskManage>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
    {
      path: "/open/User/IT/HelpDesk",
      element: <EveryOnePublicTicket></EveryOnePublicTicket>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },

    {
      path: "*",
      element: <Navigate to="/asset"></Navigate>,
      withAuthorization: false,
      withAdminAuthorization: false,
    },
  ]);

  return (
    <BrowserRouter>
      <Routes>
        {RouterInfo.map((route) => {
          return (
            <Route
              key={route.path}
              path={route.path}
              element={
                <LoginRoute
                  withAdminAuthorization={route.withAdminAuthorization}
                  withAuthorization={route.withAuthorization}
                  component={route.element}
                  authCode={route.authCode}
                  User_Info={User_Info}
                ></LoginRoute>
              }
            ></Route>
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};
export default RouterMainPage;
