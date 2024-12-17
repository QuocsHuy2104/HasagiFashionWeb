import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import FormHelperText from "@mui/material/FormHelperText";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import LoginHooks from "./loginWithGG"; 

const bgImage = "https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg";

function Illustration() {
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const validateForm = () => {
    let formErrors = {};

    if (!username.trim()) formErrors.username = "Vui lòng nhập tên người dùng.";

    if (!password.trim()) formErrors.password = "Vui lòng nhập mật khẩu.";

    return formErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        { username: username.trim(), password: password.trim() },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const expirationTime = rememberMe
          ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
          : new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

        const token = response.data.token;

        Cookies.set('user', token, { expires: expirationTime });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Đăng nhập không thành công. Vui lòng thử lại.");
      } else if (error.request) {
        setMessage("Không có phản hồi từ máy chủ. Vui lòng kiểm tra mạng của bạn.");
      } else {
        setMessage("Đăng nhập không thành công. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <IllustrationLayout
      title="Đăng nhập"
      description="Vui lòng nhập tài khoản và mật khẩu của bạn"
      illustration={{
        image: bgImage,
        title: "\"Chúc bạn có ngày mới vui vẻ\"",
        description: "Viết càng dễ dàng thì người viết càng bỏ nhiều công sức vào quá trình viết.",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={handleLogin}>
        <ArgonBox mb={2}>
          <ArgonInput
            type="text"
            placeholder="Tên đăng nhập"
            size="large"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={!!errors.username}
          />
          <FormHelperText error={!!errors.username}>
            {errors.username}
          </FormHelperText>
        </ArgonBox>
        <ArgonBox mb={2}>
          <ArgonInput
            type="password"
            placeholder="Mật khẩu"
            size="large"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
          />
          <FormHelperText error={!!errors.password}>
            {errors.password}
          </FormHelperText>
        </ArgonBox>
        {message && (
          <ArgonBox mb={2}>
            <ArgonTypography variant="body2" color="error" textAlign="center">
              {message}
            </ArgonTypography>
          </ArgonBox>
        )}
        <ArgonBox display="flex" justifyContent="start" alignItems="center">
          <ArgonTypography
            component={Link}
            to="/forgot-password"
            variant="button"
            fontWeight="regular"
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            Quên mật khẩu
          </ArgonTypography>
        </ArgonBox>

        <ArgonBox mt={4} mb={1}>
          <ArgonButton color="info" size="large" fullWidth type="submit" disabled={loading}>
            {loading ? "Loading..." : "Đăng nhập"}
          </ArgonButton>
        </ArgonBox>
        <ArgonBox mt={3} textAlign="center">
          <ArgonTypography variant="button" color="text" fontWeight="regular">
            Bạn không có tài khoản?{" "}
            <ArgonTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
            >
              Đăng ký
            </ArgonTypography>
          </ArgonTypography>
        </ArgonBox>
      </ArgonBox>
      <ArgonBox mt={4} mb={1}>
        <LoginHooks />
      </ArgonBox>
    </IllustrationLayout>
  );
}

export default Illustration;