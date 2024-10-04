import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
// @mui material components
import Switch from "@mui/material/Switch";
import ArgonBox from "components/ArgonBox";
import ArgonTypography from "components/ArgonTypography";
import ArgonInput from "components/ArgonInput";
import ArgonButton from "components/ArgonButton";
import FormHelperText from "@mui/material/FormHelperText";
import IllustrationLayout from "layouts/authentication/components/IllustrationLayout";
import LoginHooks from "./loginWithGG"; // Google OAuth2 Login Component

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

  // Update the validation to check for username instead of email
  const validateForm = () => {
    let formErrors = {};

    if (!username.trim()) formErrors.username = "Please enter a username.";

    if (!password.trim()) formErrors.password = "Please enter a password.";

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
          : new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour
  
        const token = response.data.token;
  
        Cookies.set('user', token, { expires: expirationTime });
  
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || "Login failed. Please try again.");
      } else if (error.request) {
        setMessage("No response from server. Please check your network.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <IllustrationLayout
      title="Sign-in"
      description="Please, enter your username and password"
      illustration={{
        image: bgImage,
        title: "\"Attention is the new currency\"",
        description: "The more effortless writing looks, the more effort the writer actually put into the process.",
      }}
    >
      <ArgonBox component="form" role="form" onSubmit={handleLogin}>
        <ArgonBox mb={2}>
          <ArgonInput
            type="text"
            placeholder="Username"
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
            placeholder="Password"
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
        <ArgonBox display="flex" alignItems="center">
          <Switch checked={rememberMe} onChange={handleSetRememberMe} />
          <ArgonTypography
            variant="button"
            fontWeight="regular"
            onClick={handleSetRememberMe}
            sx={{ cursor: "pointer", userSelect: "none" }}
          >
            &nbsp;&nbsp;Remember me
          </ArgonTypography>
        </ArgonBox>
        <ArgonBox mt={4} mb={1}>
          <ArgonButton color="info" size="large" fullWidth type="submit" disabled={loading}>
            {loading ? "Loading..." : "Sign-in"}
          </ArgonButton>
        </ArgonBox>
        <ArgonBox mt={3} textAlign="center">
          <ArgonTypography variant="button" color="text" fontWeight="regular">
            Dont have an account?{" "}
            <ArgonTypography
              component={Link}
              to="/authentication/sign-up"
              variant="button"
              color="info"
              fontWeight="medium"
            >
              Sign-up
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
