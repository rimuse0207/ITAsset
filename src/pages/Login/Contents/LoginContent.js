import React from "react";
import { AiFillMail } from "react-icons/ai";
import { BsKey } from "react-icons/bs";

const LoginContent = ({
  LoginDataInfo,
  setLoginDataInfo,
  handleClicksLogin,
}) => {
  return (
    <div className="login-form-left-side">
      <form onSubmit={(e) => handleClicksLogin(e)}>
        <div className="login-input-container">
          <div className="login-input-wrap input-id">
            <i className="far fa-envelope">
              <AiFillMail></AiFillMail>
            </i>
            <input
              placeholder="Email"
              type="text"
              autoFocus
              value={LoginDataInfo.email ? LoginDataInfo.email : ""}
              onChange={(e) =>
                setLoginDataInfo({ ...LoginDataInfo, email: e.target.value })
              }
            />
          </div>
          <div className="login-input-wrap input-password">
            <i className="fas fa-key">
              <BsKey></BsKey>
            </i>
            <input
              placeholder="Password"
              type="password"
              value={LoginDataInfo.password ? LoginDataInfo.password : ""}
              onChange={(e) =>
                setLoginDataInfo({ ...LoginDataInfo, password: e.target.value })
              }
            />
          </div>
        </div>
        <div className="login-btn-wrap">
          <button className="login-btn" type="submit">
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginContent;
