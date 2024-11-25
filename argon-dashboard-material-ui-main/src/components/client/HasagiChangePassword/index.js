import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArgonBox from "components/ArgonBox";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import ChangePasswordService from "../../../services/ChangePasswordServices";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
 
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
  
    if (newPassword !== confirmPassword) {
      setErrorMessage("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    const formData = {
      oldPassword,
        newPassword,
        confirmPassword,
  };
  
    try {
      const response = await ChangePasswordService.changePass(formData) ;
  
      if (response.status === 200) {
        setSuccessMessage("Đổi mật khẩu thành công");
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setErrorMessage("");
      }
    } catch (error) {
      if (error.response) {
        // Check if error.response.data is an object with a message property
        const message =
          typeof error.response.data === "object" && error.response.data.message
            ? error.response.data.message
            : "Lỗi Không mong muốn";
        setErrorMessage(message);
      } else {
        setErrorMessage("Lỗi Không mong muốn");
      }
    }
  };
  
  return (
    <div className="user-profile-container">
      <div className="row p-3">
        <h5>Đổi mật khẩu</h5>
        <h6 className="mb-4" style={{ color: "#555", fontSize: "17px" }}>
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
        </h6>
        <hr style={{ color: "#888" }} />
        <div className="col-10">
          <div className="profile-form">
            <form onSubmit={handleSubmit}>
              <div className="form-row mt-3" style={{ gap: "20px" }}>
                <label className="form-label" style={{ width: "160px" }}>
                  Nhập mật khẩu cũ
                </label>
                <ArgonBox mb={1} width={"400px"} position="relative">
                  <ArgonInput
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu cũ"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={{ paddingRight: "30px" }}
                  />
                  <FontAwesomeIcon
                    icon={showOldPassword ? faEye : faEyeSlash}
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                    }}
                  />
                </ArgonBox>
              </div>

              <div className="form-row mt-3" style={{ gap: "20px" }}>
                <label className="form-label" style={{ width: "160px" }}>
                  Nhập mật khẩu mới
                </label>
                <ArgonBox mb={1} width={"400px"} position="relative">
                  <ArgonInput
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={{ paddingRight: "30px" }}
                  />
                  <FontAwesomeIcon
                    icon={showNewPassword ? faEye : faEyeSlash}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                    }}
                  />
                </ArgonBox>
              </div>

              <div className="form-row mt-3" style={{ gap: "20px" }}>
                <label className="form-label" style={{ width: "160px" }}>
                  Nhập lại mật khẩu mới
                </label>
                <ArgonBox mb={1} width={"400px"} position="relative">
                  <ArgonInput
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    style={{ paddingRight: "30px" }}
                  />
                  <FontAwesomeIcon
                    icon={showConfirmPassword ? faEye : faEyeSlash}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                    }}
                  />
                </ArgonBox>
              </div>

              {successMessage && (
                <p style={{ color: "green", marginLeft: "175px" }}>{successMessage}</p>
              )}
              {errorMessage && <p style={{ color: "red", marginLeft: "175px" }}>{errorMessage}</p>}

              <ArgonButton
                color="dark"
                size="small"
                type="submit"
                style={{ marginLeft: "175px", marginTop: "15px" }}
                disabled={!(newPassword && confirmPassword && oldPassword)}
              >
                Xác nhận
              </ArgonButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
