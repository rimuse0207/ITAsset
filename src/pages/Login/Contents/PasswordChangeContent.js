import React from "react";
import { AiFillMail } from "react-icons/ai";
import { BsKey } from "react-icons/bs";

const PasswordChangeContent = ({
  Change_password,
  setChange_password,
  HandleChangePassword,
}) => {
  return (
    <div className="login-form-left-side">
      <form onSubmit={(e) => HandleChangePassword(e)}>
        <div className="login-input-container">
          <div className="login-input-wrap input-id">
            <i className="far fa-envelope">
              <AiFillMail></AiFillMail>
            </i>
            <input
              placeholder="Email"
              type="text"
              value={Change_password.email}
              readOnly
            />
          </div>
          <div className="login-input-wrap input-password">
            <i className="fas fa-key">
              <BsKey></BsKey>
            </i>
            <input
              placeholder="변경 할 비밀번호"
              type="password"
              value={Change_password.password}
              onChange={(e) =>
                setChange_password({
                  ...Change_password,
                  password: e.target.value,
                })
              }
            />
          </div>
          <div className="login-input-wrap input-password">
            <i className="fas fa-key">
              <BsKey></BsKey>
            </i>
            <input
              placeholder="변경 할 비밀번호 확인"
              type="password"
              value={Change_password.passwordCheck}
              onChange={(e) =>
                setChange_password({
                  ...Change_password,
                  passwordCheck: e.target.value,
                })
              }
            />
          </div>
        </div>
        <div className="login-btn-wrap">
          <button className="login-btn" type="submit">
            Change
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordChangeContent;
