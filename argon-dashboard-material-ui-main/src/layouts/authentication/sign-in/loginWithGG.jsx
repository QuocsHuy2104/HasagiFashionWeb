import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginHooks = () => {
  const navigate = useNavigate();

  const handleLogin = async (response) => {
    try {
      console.log("Google Login Response:", response);

      const token = response?.credential;

      console.log("Received token:", token);

      const backendResponse = await axios.post("http://localhost:8080/oauth2/verify", {
        token,
      });

      console.log("Backend response:", backendResponse.data);

      localStorage.setItem("Account", token);
      navigate("/feature-section");

    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId="576683154565-adkki79r5dvm6v4j8alacmbg73cagt72.apps.googleusercontent.com">
      <GoogleLogin
        onSuccess={handleLogin}
        onError={(error) => console.error("Login Error:", error)}
      />
    </GoogleOAuthProvider>
  );
};

export default LoginHooks;