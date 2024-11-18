// react-router-dom components
import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Argon Dashboard 2 MUI components
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import ArgonAlert from "components/ArgonAlert";
import { Spinner } from "reactstrap";
import axios from "axios";
// import PhoneInput from "react-phone-input-2";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";
import "./forgotPassword.css";
import ReCAPTCHA from "react-google-recaptcha";
//6LfydhoqAAAAAE2wPxlnGXh0iXc-5l1y5tu8P8Tc

// Images
const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg";
//"https://static.vecteezy.com/system/resources/previews/023/251/027/original/forgot-password-button-speech-bubble-banner-label-forgot-password-vector.jpg";
//"https://static.vecteezy.com/system/resources/previews/023/250/815/non_2x/forgot-password-button-speech-bubble-banner-label-forgot-password-vector.jpg";

function ForgotPassword() {
  const recaptchaRef = useRef(null); // Tạo tham chiếu đến ReCAPTCHA
  const [email, setEmail] = useState("");
  const [capValue, setCapValue] = useState("");
  // Loại bỏ khoảng trắng thừa ở đầu và cuối chuỗi
  const value = email.trim();
  const isEmailValid = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value);
  const [errorEmail, setErrorEmail] = useState();
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const resetPassword = async (e) => {
    e.preventDefault();
    setShowError(false);
    setSuccessMessage("");

    if (!email) {
      setErrorEmail("Email không được để trống!");
      setShowError(true);
      return;
    }

    // Xử lý thông báo lỗi và reset ReCAPTCHA
    if (!isEmailValid) {
      setErrorEmail("Email không hợp lệ!");
      setShowError(true);
      return;
    } else {
      // Thực hiện các hành động khác, ví dụ như gọi API để đặt lại mật khẩu
      try {
        setIsLoading(true);
        const response = await axios.post(
          `http://localhost:8080/api/forgotpassword/forgot-password?email=${email}`,
          {
            // withCredentials: true,
          }
        );
        setIsLoading(false);
        setEmail("");
        setSuccessMessage(
          response.data,
          setTimeout(() => {
            setSuccessMessage("");
          }, 10000)
        );
      } catch (error) {
        setIsLoading(false);
        if (error.response) {
          setErrorEmail(error.response.data); // Thông báo lỗi từ server
        } else {
          setErrorEmail("Lỗi không xác định vui lòng thử lại!"); // Thông báo lỗi không xác định
        }
        setShowError(true);
      }
    }

    // Đặt lại ReCAPTCHA
    if (recaptchaRef.current) {
      setEmail("");
      setCapValue("");
      recaptchaRef.current.reset();
    }
  };

  const handleInputChange = (e) => {
    setEmail(e.target.value);
    if (errorEmail) {
      setShowError(false);
    }
    setErrorEmail("");
    setSuccessMessage("");
  };

  const handleReCAPTCHA = (e) => {
    setCapValue(e);
    if (errorEmail) {
      setShowError(false);
    }
    setErrorEmail("");
    setSuccessMessage("");
  };

  useEffect(() => {
    if (isLoading) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }

    // Clean up on component unmount
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [isLoading]);
  return (
    <CoverLayout
      //title="Chào mừng!"
      // description="Use these awesome forms to login or create new account in your project for free."
      image={bgImage}
      imgPosition="top"
      button={{ color: "dark", variant: "gradient" }}
    >
      <div className="content-wrapper">
        {isLoading && (
          <div className="loading-overlay">
            <Spinner color="primary" />
          </div>
        )}
        <Card w={50} className="mb-5">
          <ArgonBox p={3} mb={1} textAlign="center">
            <ArgonTypography variant="h5" fontWeight="medium">
              Quên mật khẩu
            </ArgonTypography>
          </ArgonBox>
          <ArgonBox pt={2} pb={3} px={3}>
            <ArgonBox component="form" role="form" onSubmit={resetPassword}>
              <ArgonBox mb={3}>
                {showError && errorEmail && (
                  <ArgonAlert
                    color="error"
                    dismissible
                    onClick={() => setShowError(false)}
                    style={{ fontSize: "0.9rem", padding: "0.5rem 0.5rem" }}
                  >
                    {errorEmail}
                  </ArgonAlert>
                )}
                {successMessage && (
                  <ArgonAlert
                    color="success"
                    dismissible
                    onClick={() => setSuccessMessage("")}
                    style={{
                      fontSize: "0.9rem",
                      padding: "0.5rem",
                      textAlign: "justify",
                    }}
                  >
                    {successMessage}
                  </ArgonAlert>
                )}

                {capValue && (
                  <ArgonInput
                    placeholder="Email"
                    type={email}
                    value={email}
                    onChange={handleInputChange}
                    error={capValue ? !!errorEmail : ""}
                    disabled={isLoading} // Disable input khi loading
                    style={{ fontSize: "1.25rem", padding: "0.75rem", width: "100%" }}
                  />
                )}
              </ArgonBox>
              <ArgonBox display="flex" alignItems="center" justifyContent="center">
                <div
                  style={{
                    width: "100%",
                    maxWidth: "325px",
                    borderRadius: "10px",
                    borderTopLeftRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    overflow: "hidden",
                    borderTop: "1px solid lightgray",
                    borderRight: "1px solid lightgray",
                    borderBottom: "1px solid lightgray",
                    borderLeft: "none",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#c0c0c0",
                  }}
                >
                  <div
                    style={{
                      transform: "scale(1.075)",
                      transformOrigin: "0",
                      width: "100%",
                    }}
                  >
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LfydhoqAAAAAE2wPxlnGXh0iXc-5l1y5tu8P8Tc"
                      onChange={handleReCAPTCHA}
                    />
                  </div>
                </div>
              </ArgonBox>

              <ArgonBox mt={3} mb={1}>
                {capValue && (
                  <ArgonButton
                    type="submit"
                    color="info"
                    style={{
                      width: "100%",
                      maxWidth: "325px",
                      fontSize: "1.05rem",
                      padding: "0.75rem",
                    }}
                    disabled={isLoading} // Disable button khi loading
                  >
                    {isLoading ? (
                      <>
                        <Spinner size="sm" /> {/* Reactstrap Spinner nhỏ */}
                        <span style={{ marginLeft: "0.5rem" }}>Loading...</span>
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </ArgonButton>
                )}
              </ArgonBox>
            </ArgonBox>
          </ArgonBox>
        </Card>
      </div>
    </CoverLayout>
  );
}

export default ForgotPassword;
