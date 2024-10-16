import React, { useState } from "react";
import Card from "@mui/material/Card";
import { Link, useNavigate } from "react-router-dom";

import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonButton from "components/ArgonButton";
import ArgonInput from "components/ArgonInput";

import CoverLayout from "layouts/authentication/components/CoverLayout";
import Socials from "layouts/authentication/components/Socials";
import Separator from "layouts/authentication/components/Separator";

import AccountService from "services/AccountServices";

const bgImage =
  "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signup-cover.jpg";

function Cover() {
  const [username, setUsername] = useState("");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Xác thực dữ liệu đầu vào
  const validateForm = () => {
    let formErrors = {};

    // Kiểm tra họ tên
    const specialCharRegex = /[^a-zA-Z0-9 ]/;

    if (!username) {
      formErrors.username = "Vui lòng nhập tên đăng nhập.";
    } else if (specialCharRegex.test(username)) {
      formErrors.username = "Tên đăng nhập không được chứa các ký tự đặc biệt.";
    } else if (username.length < 3 || username.length > 10) {
      formErrors.username = "Tên đăng nhập phải có độ dài từ 3 đến 10 ký tự.";
    }
    if (!fullName) formErrors.fullName = "Vui lòng nhập họ tên.";

    // Kiểm tra email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|fpt\.edu\.vn)$/;
    if (!email) formErrors.email = "Vui lòng nhập email.";
    else if (!emailRegex.test(email)) formErrors.email = "Email không hợp lệ.";

    // Kiểm tra mật khẩu
    if (!password) formErrors.password = "Vui lòng nhập mật khẩu.";
    else {
      if (password.length < 6) formErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      if (!/\d/.test(password)) formErrors.password = "Mật khẩu phải chứa ít nhất một ký tự số.";
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
        formErrors.password = "Mật khẩu phải chứa ít nhất một ký tự đặc biệt.";
    }

    return formErrors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setMessage("");

    const userData = { username, fullName, email, password };

    try {
      const response = await fetch("http://localhost:3000/api/regis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.text();
        console.log(result);
        setMessage("Đăng ký thành công.");
        navigate("/authentication/sign-in");
        // Chuyển hướng hoặc thực hiện các hành động khác sau khi đăng ký thành công
      } else {
        const errorText = await response.text();
        console.error("Đăng ký không thành công:", errorText);
        if (errorText.includes("Email này đã tồn tại")) {
          setMessage("Email này đã tồn tại");
        } else if (errorText.includes("Tên đăng nhập này đã tồn tại")) {
          setMessage("Tên đăng nhập này đã tồn tại");
        } else if (errorText.includes("Tên đăng nhập không được chứa các ký tự đặc biệt")) {
          setMessage("Tên đăng nhập không được chứa các ký tự đặc biệt");
        } else if (errorText.includes("Tên đăng nhập phải có độ dài từ 3 đến 10 ký tự")) {
          setMessage("Tên đăng nhập phải có độ dài từ 3 đến 10 ký tự");
        } else {
          setMessage("Đăng ký không thành công. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setMessage("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <CoverLayout
      title="Welcome!"
      description="Use these great form templates to log in or create new accounts in your project for free."
      image={bgImage}
      imgPosition="top"
      button={{ color: "dark", variant: "gradient" }}
    >
      <Card>
        <ArgonBox p={3} mb={1} textAlign="center">
          <ArgonTypography variant="h5" fontWeight="medium">
            ĐĂNG KÝ
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox pt={2} pb={3} px={3}>
          <ArgonBox component="form" role="form" onSubmit={handleSignUp}>
            <ArgonBox mb={2}>
              <ArgonInput
                type="text"
                placeholder="Tên tài khoản"
                value={username}
                name="username"
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                error={!!errors.username}
              />
              {errors.username && (
                <ArgonTypography variant="body2" color="error">
                  {errors.username}
                </ArgonTypography>
              )}
            </ArgonBox>
            <ArgonBox mb={2}>
              <ArgonInput
                type="text"
                placeholder="Họ và tên"
                value={fullName}
                name="fullName"
                onChange={(e) => setFullname(e.target.value)}
                fullWidth
                error={!!errors.fullName}
              />
              {errors.fullName && (
                <ArgonTypography variant="body2" color="error">
                  {errors.fullName}
                </ArgonTypography>
              )}
            </ArgonBox>
            <ArgonBox mb={2}>
              <ArgonInput
                type="text"
                placeholder="Email"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                error={!!errors.email}
              />
              {errors.email && (
                <ArgonTypography variant="body2" color="error">
                  {errors.email}
                </ArgonTypography>
              )}
            </ArgonBox>
            <ArgonBox mb={2}>
              <ArgonInput
                type="password"
                placeholder="Mật khẩu"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                error={!!errors.password}
              />
              {errors.password && (
                <ArgonTypography variant="body2" color="error">
                  {errors.password}
                </ArgonTypography>
              )}
            </ArgonBox>
            {message && (
              <ArgonBox mb={2}>
                <ArgonTypography variant="body2" color={errors ? "error" : "success"}>
                  {message}
                </ArgonTypography>
              </ArgonBox>
            )}
            <ArgonBox mt={4} mb={1}>
              <ArgonButton variant="gradient" color="dark" fullWidth type="submit">
                Đăng ký
              </ArgonButton>
            </ArgonBox>
            <ArgonBox mt={2}>
              <ArgonTypography variant="button" color="text" fontWeight="regular">
                Đã có tài khoản?&nbsp;
                <ArgonTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Đăng nhập
                </ArgonTypography>
              </ArgonTypography>
            </ArgonBox>
          </ArgonBox>
        </ArgonBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
